import warnings
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, ClassifierMixin
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier
from xgboost import XGBClassifier

warnings.filterwarnings("ignore")

# Define the custom ELMClassifier as it is part of the training pipeline
class ELMClassifier(BaseEstimator, ClassifierMixin):
    def __init__(self, n_hidden=500, activation='tanh', alpha=1.0, random_state=42):
        self.n_hidden = n_hidden
        self.activation = activation
        self.alpha = alpha
        self.random_state = random_state

    def _act(self, X):
        if self.activation == 'tanh':
            return np.tanh(X)
        elif self.activation == 'relu':
            return np.maximum(0, X)
        return np.tanh(X)

    def fit(self, X, y):
        rnd = np.random.RandomState(self.random_state)
        n_features = X.shape[1]
        self.W_ = rnd.normal(size=(n_features, self.n_hidden)) * 0.5
        self.b_ = rnd.normal(size=(self.n_hidden,)) * 0.1
        H = self._act(X.dot(self.W_) + self.b_)
        self.clf_ = RidgeClassifier(alpha=self.alpha)
        self.clf_.fit(H, y)
        self.classes_ = np.unique(y)
        return self

    def decision_function(self, X):
        H = self._act(X.dot(self.W_) + self.b_)
        return self.clf_.decision_function(H)

    def predict(self, X):
        H = self._act(X.dot(self.W_) + self.b_)
        return self.clf_.predict(H)

    def predict_proba(self, X):
        df = self.decision_function(X)
        probs = 1 / (1 + np.exp(-df))
        return np.vstack([1 - probs, probs]).T

def train_and_get_model():
    """
    Loads the dataset, defines the preprocessing and model pipelines,
    and trains the final Stacking Classifier on the entire dataset for deployment.
    Returns the trained model object and the list of feature names.
    """
    print("Loading dataset from 'data/rockfall_prediction_dataset_clean.xlsx'...")
    try:
        df = pd.read_excel("data/rockfall_prediction_dataset_clean.xlsx")
    except FileNotFoundError:
        print("\nFATAL ERROR: 'rockfall_prediction_dataset_clean.xlsx' not found.")
        print("Please place your dataset file inside the 'astra-backend/data/' directory and restart the server.\n")
        return None, None

    print(f"Dataset loaded successfully. Shape: {df.shape}")

    target_col = "rockfall_event"
    X = df.drop(columns=[target_col])
    y = df[target_col].astype(int)

    # Define the preprocessor pipeline
    preprocessor = Pipeline([
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler())
    ])

    # For the final model, we select the top performers based on your research code
    estimators = [
        ('XGBoost', XGBClassifier(n_estimators=200, eval_metric='logloss', random_state=42, use_label_encoder=False)),
        ('RandomForest', RandomForestClassifier(n_estimators=300, max_depth=10, random_state=42)),
        ('GradientBoosting', GradientBoostingClassifier(n_estimators=200, learning_rate=0.05, max_depth=3, random_state=42)),
        ('ELM', ELMClassifier(n_hidden=500, activation='tanh', alpha=1.0, random_state=42))
    ]
    
    # We create full pipelines for each estimator to ensure preprocessing is part of the final model
    full_estimators = [(name, Pipeline([('preproc', preprocessor), ('clf', clf)])) for name, clf in estimators]

    meta_learner = LogisticRegression(max_iter=2000, random_state=42)

    # We do not use cross-validation for the final deployed model. We fit on all data.
    # The `cv` parameter is used internally by StackingClassifier for fitting base learners if needed.
    stack = StackingClassifier(
        estimators=full_estimators,
        final_estimator=meta_learner,
        passthrough=False, # We don't pass the original data to the meta-learner
        n_jobs=-1
    )

    print("Training the Stacking Ensemble model on the full dataset...")
    stack.fit(X, y)
    print("Model training complete.")

    return stack, list(X.columns)

