import math
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.stats import norm  # pyrefly: ignore
#.\venv\Scripts\activate
#uvicorn main:app --reload --port 8000
#npm run dev
app = FastAPI(
    title="Simulador de Inventario Probabilístico - UNET", version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InventoryInput(BaseModel):
    demanda_anual: float
    costo_pedido: float
    costo_mantenimiento: float
    lead_time_dias: float
    demanda_diaria_promedio: float
    desviacion_diaria: float
    nivel_servicio_pct: float


@app.post("/api/calcular")
def calcular_modelo_q_r(data: InventoryInput):
    # 1. Tamaño Óptimo de Pedido (EOQ base)
    Q_opt = math.sqrt(
        (2 * data.costo_pedido * data.demanda_anual) / data.costo_mantenimiento
    )

    # 2. Parámetros del Tiempo de Entrega (Lead Time)
    mu_L = data.demanda_diaria_promedio * data.lead_time_dias
    sigma_L = data.desviacion_diaria * math.sqrt(data.lead_time_dias)

    # 3. Factor Z y Stock de Seguridad
    alpha = data.nivel_servicio_pct / 100.0
    Z = float(norm.ppf(alpha))
    B = Z * sigma_L
    R = mu_L + B

    # 4. Puntos para la curva normal
    x_vals = [mu_L + (i * 0.1 * sigma_L) for i in range(-40, 41)]
    y_vals = [float(norm.pdf(x, mu_L, sigma_L)) for x in x_vals]

    return {
        "Q_opt": round(Q_opt, 2),
        "R_punto_reorden": round(R, 2),
        "B_stock_seguridad": round(B, 2),
        "Z_factor": round(Z, 4),
        "mu_L": round(mu_L, 2),
        "sigma_L": round(sigma_L, 2),
        "dias_entre_pedidos": round((Q_opt / data.demanda_anual) * 365, 1),
        "curva_normal": {"x": [round(x, 2) for x in x_vals], "y": y_vals},
        "instruccion_usuario": f"Ordene {round(Q_opt)} unidades cada vez que el inventario baje a {round(R)} unidades. Mantenga {round(B)} unidades en reserva permanente.",
    }