# ==============================
# preprocess_train_xgb.py
# ==============================
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer, make_column_selector as selector
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

# -------------------------------
# Carregando os dados
# -------------------------------
df = pd.read_csv("C:/ML_salary/ML_Salary/data/TB_salary.csv")

# Supondo que a coluna alvo se chame "salary"
X = df.drop("salary", axis=1)
y = df["salary"]

# -------------------------------
# Convertendo y (rótulos) para numérico
# -------------------------------
le = LabelEncoder()
y = le.fit_transform(y)  # Ex: ['<=50K', '>50K'] → [0, 1]

# -------------------------------
# Dividindo em treino e teste
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# -------------------------------
# Seletores genéricos de colunas
# -------------------------------
num_selector = selector(dtype_include=["int64", "float64"])
cat_selector = selector(dtype_include=["object", "category"])

# -------------------------------
# Pipeline de pré-processamento
# -------------------------------
preprocess = ColumnTransformer(
    transformers=[
        ("num", SimpleImputer(strategy="median"), num_selector),
        ("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore"))
        ]), cat_selector),
    ]
)

# -------------------------------
# Pipeline completo: pré-processamento + XGBoost
# -------------------------------
model = Pipeline([
    ("prep", preprocess),
    ("xgb", XGBClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        use_label_encoder=False,
        eval_metric='logloss',
        random_state=42
    ))
])

# -------------------------------
# Treinando o modelo
# -------------------------------
model.fit(X_train, y_train)

# -------------------------------
# Fazendo previsões
# -------------------------------
y_pred = model.predict(X_test)

# -------------------------------
# Avaliando desempenho
# -------------------------------
print("Acurácia:", accuracy_score(y_test, y_pred))
print("Precisão:", precision_score(y_test, y_pred, average='weighted'))
print("Recall:", recall_score(y_test, y_pred, average='weighted'))
print("F1-Score:", f1_score(y_test, y_pred, average='weighted'))
print("\nRelatório completo:\n", classification_report(y_test, y_pred, target_names=le.classes_))
