import pandas as pd

# Nome do arquivo CSV
df = pd.read_csv(r"C:\Users\Ian Caleb\OneDrive\Área de Trabalho\ML_salary\ML_Salary\data\TB_salary.csv")

# Colunas que você quer analisar
colunas_desejadas = [
    "workclass", "education", "education-num",
    "marital-status", "occupation", "relationship", "race", "sex",
    "capital-gain", "capital-loss", "hours-per-week",
    "native-country", "salary"
]

print("\n===== POSSÍVEIS VALORES POR COLUNA =====\n")

for coluna in colunas_desejadas:
    if coluna in df.columns:
        valores = df[coluna].dropna().unique()   # remove NaN
        try:
            valores = sorted(valores)  # tenta ordenar
        except:
            valores = list(valores)   # caso não consiga ordenar strings diferentes
        
        print(f"\n📌 Coluna: {coluna}")
        print("Valores possíveis:")
        print(valores)
    else:
        print(f"\n⚠️ Coluna '{coluna}' não encontrada no CSV.")
