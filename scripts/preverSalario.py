# ==============================
# predict_salary.py
# ==============================

import joblib
import pandas as pd

# Carrega o pipeline completo (preprocessamento + xgboost)
model = joblib.load("salary_xgb_pipeline.pkl")

# -------------------------------
# Lista oficial das colunas
# -------------------------------
columns = [
    "age",
    "workclass",
    "fnlwgt",
    "education",
    "education-num",
    "marital-status",
    "occupation",
    "relationship",
    "race",
    "sex",
    "capital-gain",
    "capital-loss",
    "hours-per-week",
    "native-country"
]

print("\n=== Previsor de salário (>50K ou <=50K) ===\n")

# Dicionário para armazenar respostas
data = {}

# Recebe cada input do usuário
for col in columns:
    value = input(f"Informe '{col}': ")

    # Converte numéricos para int
    if col in ["age", "fnlwgt", "education-num", "capital-gain", "capital-loss", "hours-per-week"]:
        try:
            value = int(value)
        except:
            raise ValueError(f"Valor inválido para {col}, deve ser número inteiro.")

    data[col] = value

# Converte para DataFrame
df_input = pd.DataFrame([data])

print("\nProcessando predição...\n")

# Predição
pred = model.predict(df_input)[0]

# Converte para rótulo humano
label = ">50K" if pred == 1 else "<=50K"

print(f"=== RESULTADO DA PREDIÇÃO ===")
print(f"Salário previsto: {label}")
