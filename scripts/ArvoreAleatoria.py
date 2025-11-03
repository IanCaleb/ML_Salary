# ==============================
# preprocess_train.py
# ==============================

import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer, make_column_selector as selector
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# ==============================
# 1. Carregar os dados
# ==============================
# Exemplo: substitua pelo seu dataset real
df = pd.read_csv("C:/ML_salary/ML_Salary/data/TB_salary.csv")

# Supondo que a coluna alvo seja 'faixa_salarial'
X = df.drop("salary", axis=1)
y = df["salary"]

# Divisão em treino e teste (80% / 20%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ==============================
# 2. Pré-processamento
# ==============================

# Seletores automáticos de colunas
num_selector = selector(dtype_include=["int64", "float64"])
cat_selector = selector(dtype_include=["object", "category"])

# Transformer de pré-processamento
preprocess = ColumnTransformer(
    transformers=[
        ("num", SimpleImputer(strategy="median"), num_selector),
        ("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore"))
        ]), cat_selector),
    ]
)

# ==============================
# 3. Modelo (Random Forest)
# ==============================
model = Pipeline([
    ("prep", preprocess),
    ("rf", RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        random_state=42,
        n_jobs=-1
    ))
])

# ==============================
# 4. Treinamento
# ==============================
model.fit(X_train, y_train)

# ==============================
# 5. Avaliação
# ==============================
y_pred = model.predict(X_test)

print("========== AVALIAÇÃO ==========")
print(f"Acurácia: {accuracy_score(y_test, y_pred):.4f}")
print("\nRelatório de classificação:\n", classification_report(y_test, y_pred))
print("\nMatriz de confusão:\n", confusion_matrix(y_test, y_pred))

# ==============================
# 6. Validação cruzada (opcional)
# ==============================
scores = cross_val_score(model, X, y, cv=5, scoring="accuracy")
print("\n========== VALIDAÇÃO CRUZADA ==========")
print(f"Acurácia média (5 folds): {scores.mean():.4f}")
print(f"Desvio padrão: {scores.std():.4f}")

# ==============================
# 7. Salvar modelo treinado
# ==============================
joblib.dump(model, "modelo_predicao_salarial.pkl")
print("\nModelo salvo como 'modelo_predicao_salarial.pkl'")