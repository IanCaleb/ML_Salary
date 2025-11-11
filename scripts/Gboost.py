# ==============================
# preprocess_train.py
# ==============================

import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer, make_column_selector as selector
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingClassifier

# -----------------------------------
# Seletores genéricos de colunas
# -----------------------------------
num_selector = selector(dtype_include=["int64", "float64"])
cat_selector = selector(dtype_include=["object", "category"])

# -----------------------------------
# Pipeline de pré-processamento
# -----------------------------------
preprocess = ColumnTransformer(
    transformers=[
        ("num", SimpleImputer(strategy="median"), num_selector),
        ("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore"))
        ]), cat_selector),
    ]
)

# -----------------------------------
# Pipeline completo: pré-processamento + modelo
# -----------------------------------
model = Pipeline([
    ("prep", preprocess),
    ("gb", GradientBoostingClassifier(random_state=42))
])
