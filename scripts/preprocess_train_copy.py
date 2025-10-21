import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score

from sklearn.compose import make_column_selector as selector

# Seleciona tipos de colunas
num_cols = selector(dtype_include=["int64", "float64"])(X_train)
cat_cols = selector(dtype_include=["object", "category"])(X_train)

# Pré-processamento
preprocess = ColumnTransformer(
    transformers=[
        ("num", SimpleImputer(strategy="median"), num_cols),
        ("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore"))
        ]), cat_cols),
    ]
)

# Pipeline completo
model = Pipeline([
    ("prep", preprocess),
    ("gb", GradientBoostingClassifier(random_state=42))
])
