# ==============================
# evaluate.py
# ==============================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, classification_report
from preprocess_train import model  # importa o pipeline do preprocess_train.py

from sklearn.ensemble import GradientBoostingClassifier  # para classificação
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# -----------------------------------
# 1) Carrega os dados
# -----------------------------------
df = pd.read_csv("../data/TB_salary.csv")
TARGET_COL = "salary"

# binariza a variável alvo
y = df[TARGET_COL].map({">50K": 1, "<=50K": 0})
X = df.drop(columns=[TARGET_COL])

# -----------------------------------
# 2) Define cenários de teste
# -----------------------------------
def scenario_baseline(X):
    """Cenário original"""
    return X.copy()

def scenario_no_fnlwgt(X):
    """Remove a coluna fnlwgt"""
    X_new = X.drop(columns=["fnlwgt"])
    return X_new

#age,
#workclass,
#fnlwgt,
#education,
#education-num,
#marital-status,
#occupation,
#relationship,
#race,
#sex,
#capital-gain,
#capital-loss,
#hours-per-week,
#native-country,
#salary

def scenario_no_fnlwgt_no_capital(X):
    X_new = X.drop(columns=["fnlwgt"]).copy()
    X_new = X.drop(columns=["capital-loss"]).copy()
    X_new = X.drop(columns=["capital-gain"]).copy()
    return X_new

def scenario_one_hot(X):
    X_new = pd.get_dummies(X, columns=['race']).copy()
    X_new = pd.get_dummies(X, columns=['relationship']).copy()
    X_new = pd.get_dummies(X, columns=['native-country']).copy()
    X_new = pd.get_dummies(X, columns=['workclass']).copy()
    return X_new



scenarios = {
    "baseline": scenario_baseline,
    "sem_fnlwgt": scenario_no_fnlwgt,
    "sem_fnlwgt_sem_capital": scenario_no_fnlwgt_no_capital,
    "com_one_hot": scenario_one_hot,
}

# -----------------------------------
# 3) Loop de avaliação
# -----------------------------------
results = []

for name, transform_func in scenarios.items():
    X_mod = transform_func(X)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_mod, y, test_size=0.2, stratify=y, random_state=42
    )
    
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    results.append({
        "cenario": name,
        "acuracia": acc,
        "f1_score": f1
    })
    
    print(f"\n===== Cenário: {name} =====")
    print(f"Acurácia: {acc:.4f} | F1 Score: {f1:.4f}")
    print("Relatório de classificação:\n", classification_report(y_test, y_pred))

# -----------------------------------
# 4) Resumo dos resultados
# -----------------------------------
results_df = pd.DataFrame(results).sort_values("acuracia", ascending=False)
print("\n=== Comparativo de todos os cenários ===")
print(results_df)
