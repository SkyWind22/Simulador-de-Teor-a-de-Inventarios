# 📦 Simulador de Inventario Probabilístico (Q, R)
> **Universidad Nacional Experimental del Táchira (UNET)**  
> **Asignatura:** Investigación de Operaciones II  
> **Caso de Estudio:** Gestión de Inventario Estocástico (Port Harcourt)

---

## 📌 1. Objetivo del Proyecto

El objetivo principal de este desarrollo es proporcionar una **herramienta interactiva y visual de simulación de inventarios** basada en el **Modelo de Revisión Continua con Demanda Estocástica (Q, R)**. 

A través de una interfaz de usuario moderna (con estética *Dark UI / Riot Games*), la aplicación permite a los gestores de logística y alumnos calcular de forma precisa y en tiempo real el **Lote Óptimo de Compra ($Q^*$)**, el **Punto de Reorden ($R^*$)** y el **Stock de Seguridad ($B$)**, minimizando los costos de almacenamiento y el riesgo de desabastecimiento.

---

## 🧮 2. Conceptos Teóricos e Ingenieriles Utilizados

El simulador implementa los fundamentos matemáticos de la **Teoría de Inventarios Estocásticos**:

* **Modelo del Lote Económico ($EOQ / Q^*$):** Determina la cantidad óptima a pedir para minimizar la suma de los costos de pedido y de mantenimiento:
  $$Q^* = \sqrt{\frac{2 \cdot D \cdot K}{h}}$$
  *Donde $D$ es la demanda anual, $K$ el costo por pedido y $h$ el costo de mantenimiento unitario.*

* **Demanda durante el Tiempo de Entrega ($\mu_L$ y $\sigma_L$):** Modela el comportamiento probabilístico mientras se espera el pedido (Lead Time $L$ días):
  $$\mu_L = d \cdot L \quad \text{y} \quad \sigma_L = \sigma_d \cdot \sqrt{L}$$
  *Donde $d$ es la demanda diaria promedio y $\sigma_d$ su desviación estándar diaria.*

* **Factor de Nivel de Servicio ($Z$) y Stock de Seguridad ($B$):** Utiliza la distribución normal acumulada ($N(\mu_L, \sigma_L)$) mediante la inversa de la CDF (`scipy.stats.norm.ppf`) para garantizar la cobertura frente a la incertidumbre:
  $$B = Z \cdot \sigma_L$$

* **Punto de Reorden ($R^*$):** Umbral exacto en unidades físicas de inventario que activa la emisión de una nueva orden de compra:
  $$R^* = \mu_L + B$$

---

## 🏗️ 3. Arquitectura Interna del Código

El proyecto está diseñado bajo una arquitectura de **Desacoplamiento Frontend-Backend (API RESTful)**:

```text
Simulador-de-Teor-a-de-Inventarios/
├── backend/                  # Servidor de Cálculo Numérico (Python)
│   ├── main.py               # API FastAPI, CORS y lógica con SciPy/NumPy
│   └── venv/                 # Entorno virtual de Python
├── frontend/                 # Interfaz de Usuario y Cuadro de Mando (React)
│   ├── src/
│   │   ├── App.jsx           # Dashboard interactivo con Recharts y Lucide
│   │   └── main.jsx          # Punto de entrada de Vite
│   └── package.json
└── README.md