# ==============================
# preprocess_train_xgb_split.py
# ==============================

import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer, make_column_selector as selector
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from xgboost import XGBClassifier

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
# Modelo XGBoost
# -----------------------------------
xgb_model = XGBClassifier(
    n_estimators=250,
    learning_rate=0.1,
    max_depth=4,
    subsample=0.8,
    colsample_bytree=0.9,
    eval_metric="logloss",
    random_state=42,
)


# -----------------------------------
# Pipeline completo: pré-processamento + modelo
# -----------------------------------
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

    # Define X e y
    X = df.drop("salary", axis=1)
    y = df["salary"].astype(int)

    # -------------------------------
    # Divide os dados em 3 partes
    # -------------------------------
    # Primeiro: treino (60%) e temp (40%)
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.4, random_state=42, stratify=y
    )

    # Depois: divide temp em validação (20%) e teste (20%)
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )

    print(f"Tamanhos:")
    print(f"Treino: {len(X_train)} | Validação: {len(X_val)} | Teste: {len(X_test)}")

    # -------------------------------
    # Treinamento
    # -------------------------------
    model.fit(X_train, y_train)

    # -------------------------------
    # Avaliação no conjunto de validação
    # -------------------------------
    y_val_pred = model.predict(X_val)

    print("\n=== Avaliação no conjunto de VALIDAÇÃO ===")
    print("Acurácia:", accuracy_score(y_val, y_val_pred))
    print("\nMatriz de confusão:\n", confusion_matrix(y_val, y_val_pred))
    print("\nRelatório de classificação:\n", classification_report(y_val, y_val_pred))

    # -------------------------------
    # Avaliação final no conjunto de teste
    # -------------------------------
    y_test_pred = model.predict(X_test)

    print("\n=== Avaliação no conjunto de TESTE (final) ===")
    print("Acurácia:", accuracy_score(y_test, y_test_pred))
    print("\nMatriz de confusão:\n", confusion_matrix(y_test, y_test_pred))
    print("\nRelatório de classificação:\n", classification_report(y_test, y_test_pred))