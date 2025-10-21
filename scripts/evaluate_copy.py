import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score

df = pd.read_csv("../data/TB_salary.csv")

print(df.head())
print(df.columns)

#Vai definir qual a coluna alvo
TARGET_COL = "salary" 
#Vai criar outros dois df
#Um sem a coluna alvo
X = df.drop(columns=[TARGET_COL])
#Um apenas com a acoluna alvo
y = df[TARGET_COL]

#Binariza os dados da coluna salary no df y
y = y.map({">50K": 1, "<=50K": 0})

#Separa os dados de treino e teste
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

from preprocess_train import model

#treina o modelo
model.fit(X_train, y_train)


#faz previsões e avalia
y_pred = model.predict(X_test)

print("Acurácia:", accuracy_score(y_test, y_pred))
print("F1 Score:", f1_score(y_test, y_pred))
print("\nRelatório de Classificação:\n", classification_report(y_test, y_pred))
print("\nMatriz de Confusão:\n", confusion_matrix(y_test, y_pred))




#-------------------------------------------------------------------------------------#




#vai mostrar oas variáveis mais importantes para o modelo

import numpy as np

# Recupera o modelo treinado
gb = model.named_steps["gb"]

# Como usamos OneHotEncoder, precisamos ver quais colunas o transformador criou
cat_features = model.named_steps["prep"].transformers_[1][1]\
    .named_steps["onehot"].get_feature_names_out(cat_cols)

all_features = np.concatenate([num_cols, cat_features])

importances = pd.DataFrame({
    "feature": all_features,
    "importance": gb.feature_importances_
}).sort_values("importance", ascending=False)

#Mostra as 10 mais importantes
print(importances.head(10))


'''
print(df.head())

print("--------------------------------------------------")

df['sex'] = df['sex'].replace({'Male': 0, 'Female': 1})
df['salary'] = df['salary'].replace({'<=50K': 0, '>50K': 1})

#Separa os dados entre treino e teste (Ainda tenho que criar um novo df para validação)
train_df = df.sample(frac=0.8, random_state=42)
test_df = df.drop(train_df.index)

print(df.head())
'''