# ==============================
# tune_xgb_model.py
# ==============================

import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer, make_column_selector as selector
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score, f1_score
from xgboost import XGBClassifier
import numpy as np

# -----------------------------------
# Seletores de colunas
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
# Modelo base XGBoost
# -----------------------------------
xgb_model = XGBClassifier(
    eval_metric="aucpr",
    use_label_encoder=False,
    random_state=42
)

# Pipeline completo
model = Pipeline([
    ("preprocess", preprocess),
    ("xgb", xgb_model)
])

# -----------------------------------
# Execução principal
# -----------------------------------
if __name__ == "__main__":
    # Carrega dados
    df = pd.read_csv(
        r"C:\Users\Ian Caleb\OneDrive\Área de Trabalho\ML_salary\ML_Salary\data\TB_salary.csv"
    )

    # Mapeia a variável alvo (">50K" = 1, "<=50K" = 0)
    df["salary"] = df["salary"].replace({
        ">50K": 1,
        "<=50K": 0,
        ">50K.": 1,
        "<=50K.": 0
    })

    X = df.drop("salary", axis=1)
    y = df["salary"].astype(int)

    # Divide em treino e teste
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # -----------------------------------
    # Configuração dos hiperparâmetros
    # -----------------------------------
    param_grid = {
        "xgb__n_estimators": [100, 200, 300, 400],
        "xgb__learning_rate": [0.01, 0.05, 0.1, 0.2],
        "xgb__max_depth": [3, 4, 5, 6, 8],
        "xgb__subsample": [0.7, 0.8, 0.9, 1.0],
        "xgb__colsample_bytree": [0.7, 0.8, 0.9, 1.0],
        "xgb__gamma": [0, 0.1, 0.3, 1],
        "xgb__min_child_weight": [1, 3, 5, 7],
        "xgb__scale_pos_weight": [1, (len(y_train[y_train == 0]) / len(y_train[y_train == 1]))]
    }

    # -----------------------------------
    # Randomized Search
    # -----------------------------------
    search = RandomizedSearchCV(
        estimator=model,
        param_distributions=param_grid,
        n_iter=25,                 # número de combinações testadas
        scoring="f1",              # pode trocar para 'roc_auc' ou 'accuracy'
        cv=3,                      # validação cruzada 3-fold
        verbose=2,
        random_state=42,
        n_jobs=-1
    )

    # Treina e busca melhores parâmetros
    search.fit(X_train, y_train)

    print("\n=====================")
    print("Melhores parâmetros encontrados:")
    print(search.best_params_)
    print("=====================\n")

    # Avaliação no conjunto de teste
    best_model = search.best_estimator_
    y_pred = best_model.predict(X_test)
    y_pred_proba = best_model.predict_proba(X_test)[:, 1]

    print("=== Avaliação Final ===")
    print("Acurácia:", accuracy_score(y_test, y_pred))
    print("F1-Score:", f1_score(y_test, y_pred))
    print("ROC-AUC:", roc_auc_score(y_test, y_pred_proba))
    print("\nMatriz de confusão:\n", confusion_matrix(y_test, y_pred))
    print("\nRelatório de classificação:\n", classification_report(y_test, y_pred))
