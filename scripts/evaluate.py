# ==============================
# evaluate.py
# ==============================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from preprocess_train import model  # importa o pipeline do preprocess_train.py

# -----------------------------------
# 1) Carrega os dados
# -----------------------------------
df = pd.read_csv("../data/TB_salary.csv")  # ajuste o caminho conforme a sua estrutura

TARGET_COL = "salary"  # coluna alvo
X = df.drop(columns=[TARGET_COL])
y = df[TARGET_COL].map({">50K": 1, "<=50K": 0})  # binariza

# -----------------------------------
# 2) Divide em treino e teste
# -----------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# -----------------------------------
# 3) Treina o modelo
# -----------------------------------
model.fit(X_train, y_train)

# -----------------------------------
# 4) Avalia o modelo
# -----------------------------------
y_pred = model.predict(X_test)

print("Acurácia:", accuracy_score(y_test, y_pred))
print("F1 Score:", f1_score(y_test, y_pred))
print("\nRelatório de Classificação:\n", classification_report(y_test, y_pred))
print("\nMatriz de Confusão:\n", confusion_matrix(y_test, y_pred))

# -----------------------------------
# 5) Importância das features
# -----------------------------------
prep = model.named_steps["prep"]
num_cols = prep.transformers_[0][2]  # colunas numéricas
cat_cols = prep.transformers_[1][2]  # colunas categóricas

# pega os nomes das features geradas pelo OneHotEncoder
cat_features = prep.transformers_[1][1].named_steps["onehot"].get_feature_names_out(cat_cols)
all_features = np.concatenate([num_cols, cat_features])

importances = pd.DataFrame({
    "feature": all_features,
    "importance": model.named_steps["gb"].feature_importances_
}).sort_values("importance", ascending=False)

print("\nTop 10 variáveis mais importantes:")
print(importances.head(50))
