from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()

# --- CORS (permite frontend React acessar API) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Carrega o modelo treinado ---
model = joblib.load(r"C:\Users\Ian Caleb\OneDrive\Área de Trabalho\ML_salary\salary_xgb_pipeline.pkl")

# --- Modelo esperado na API ---
class SalaryFeatures(BaseModel):
    Age: int
    EducationNum: int
    CapitalGain: int
    CapitalLoss: int
    HoursPerWeek: int
    Workclass: str
    Education: str
    MaritalStatus: str
    Occupation: str
    Relationship: str
    Race: str
    Sex: str
    NativeCountry: str


# --- MAPEAMENTO para os nomes usados no treino ---
mapping = {
    "Age": "age",
    "EducationNum": "education-num",
    "CapitalGain": "capital-gain",
    "CapitalLoss": "capital-loss",
    "HoursPerWeek": "hours-per-week",
    "Workclass": "workclass",
    "Education": "education",
    "MaritalStatus": "marital-status",
    "Occupation": "occupation",
    "Relationship": "relationship",
    "Race": "race",
    "Sex": "sex",
    "NativeCountry": "native-country"
}


@app.post("/predict")
def predict_salary(features: SalaryFeatures):

    # transforma pydantic -> dict
    data = features.dict()

    # aplica renomeação correta
    data_corrected = {mapping[k]: v for k, v in data.items()}

    # cria DataFrame com os nomes esperados pelo modelo
    df = pd.DataFrame([data_corrected])

    # adiciona fnlwgt (necessário para o dataset original)
    df["fnlwgt"] = 1

    # faz previsão
    pred = model.predict(df)[0]

    # converte 0/1 em texto
    label = "mais que 50k" if pred == 1 else "menos que 50k"

    return {"prediction": label}
