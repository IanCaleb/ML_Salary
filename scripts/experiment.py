# ==============================
# experiment.py
# ==============================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer, make_column_selector as selector
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, f1_score

# -----------------------------------
# 1) Carrega os dados
# -----------------------------------
df = pd.read_csv("../data/TB_salary.csv")
TARGET_COL = "salary"
X = df.drop(columns=[TARGET_COL])
y = df[TARGET_COL].map({">50K": 1, "<=50K": 0})

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# -----------------------------------
# 2) Seletores de colunas
# -----------------------------------
num_selector = selector(dtype_include=["int64", "float64"])
cat_selector = selector(dtype_include=["object", "category"])

# -----------------------------------
# 3) Define diferentes pipelines para teste
# -----------------------------------
experiments = {}

# Pipeline básico (seu baseline)
preprocess_base = ColumnTransformer([
    ("num", SimpleImputer(strategy="median"), num_selector),
    ("cat", Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ]), cat_selector)
])
experiments["baseline"] = Pipeline([
    ("prep", preprocess_base),
    ("gb", GradientBoostingClassifier(random_state=42))
])

# Pipeline com normalização de numéricas
preprocess_scaled = ColumnTransformer([
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]), num_selector),
    ("cat", Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ]), cat_selector)
])
experiments["scaled"] = Pipeline([
    ("prep", preprocess_scaled),
    ("gb", GradientBoostingClassifier(random_state=42))
])

# Aqui você pode adicionar mais pipelines experimentais
# Ex.: remover colunas, agrupar categorias, alterar parâmetros do modelo

# -----------------------------------
# 4) Treina e avalia cada pipeline
# -----------------------------------
results = {}

for name, pipeline in experiments.items():
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    results[name] = {"accuracy": acc, "f1": f1}
    print(f"\n--- {name} ---")
    print(f"Acurácia: {acc:.4f} | F1 Score: {f1:.4f}")

# -----------------------------------
# 5) Comparação geral
# -----------------------------------
print("\n=== Comparação de Experimentos ===")
results_df = pd.DataFrame(results).T.sort_values("accuracy", ascending=False)
print(results_df)
