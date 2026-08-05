import React, { useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Package, ShieldAlert, RefreshCw, Cpu, Activity } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    demanda_anual: 12000,
    costo_pedido: 50,
    costo_mantenimiento: 2.0,
    lead_time_dias: 7,
    demanda_diaria_promedio: 32.87,
    desviacion_diaria: 10.0,
    nivel_servicio_pct: 95.0
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleSimular = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/calcular', formData);
      setResult(res.data);
    } catch (err) {
      alert("Error de conexión con la API en Python.");
    }
  };

  const chartData = result?.curva_normal.x.map((x, i) => ({
    x,
    y: result.curva_normal.y[i]
  })) || [];

  return (
    <div style={{ 
      backgroundColor: '#111111', 
      color: '#f9f9f9', 
      minHeight: '100vh', 
      fontFamily: "'Avenir Next', 'Helvetica Neue', Arial, sans-serif",
      padding: '0 0 40px 0'
    }}>
      {/* Barra Superior estilo Navbar Riot */}
      <header style={{ 
        backgroundColor: '#000000', 
        borderBottom: '2px solid #2b2b2b', 
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#d13639', padding: '6px 12px', fontWeight: '900', borderRadius: '2px', letterSpacing: '1px' }}>
            UNET
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
              SIMULADOR DE INVENTARIO
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Investigación de Operaciones II — Caso Port Harcourt
            </p>
          </div>
        </div>

        {/* Badge / Label Descriptivo del Modelo */}
        <div style={{ 
          backgroundColor: '#1a1a1a', 
          border: '1px solid #333333', 
          borderLeft: '3px solid #d13639',
          padding: '8px 16px', 
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Cpu size={18} color="#d13639" />
          <div>
            <span style={{ fontSize: '10px', color: '#888888', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>MODELO MATEMÁTICO:</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.5px' }}>
              Revisión Continua con Demanda Estocástica (Q, R)
            </span>
          </div>
        </div>
      </header>

      {/* Contenedor Principal */}
      <div style={{ maxWidth: '1400px', margin: '30px auto 0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '25px' }}>
        
        {/* Panel Lateral: Parámetros de Entrada */}
        <div style={{ 
          backgroundColor: '#181818', 
          border: '1px solid #2a2a2a', 
          padding: '25px', 
          borderRadius: '4px' 
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #2a2a2a', paddingBottom: '12px', marginTop: 0, color: '#f9f9f9' }}>
            PARÁMETROS DE ENTRADA
          </h2>

          {Object.keys(formData).map((key) => (
            <div key={key} style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '10px', fontWeight: '700', color: '#888888', letterSpacing: '0.8px', display: 'block', marginBottom: '5px' }}>
                {key.replace(/_/g, ' ').toUpperCase()}
              </label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '2px', 
                  backgroundColor: '#0a0a0a', 
                  color: '#ffffff', 
                  border: '1px solid #333333', 
                  fontSize: '13px',
                  fontWeight: '600',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          ))}

          <button
            onClick={handleSimular}
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: '#d13639', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '2px', 
              fontWeight: '900', 
              fontSize: '13px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer', 
              marginTop: '10px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#bc2c2f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#d13639'}
          >
            EJECUTAR SIMULACIÓN
          </button>
        </div>

        {/* Panel de Resultados y Gráfica */}
        <div style={{ 
          backgroundColor: '#181818', 
          border: '1px solid #2a2a2a', 
          padding: '25px', 
          borderRadius: '4px' 
        }}>
          {result ? (
            <div>
              {/* Instrucción Operativa */}
              <div style={{ 
                backgroundColor: '#0a0a0a', 
                borderLeft: '4px solid #d13639', 
                padding: '20px', 
                borderRadius: '2px', 
                marginBottom: '25px' 
              }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#d13639', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  INSTRUCCIÓN OPERATIVA PARA ALMACÉN
                </span>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#ffffff', lineHeight: '1.4' }}>
                  {result.instruccion_usuario}
                </p>
              </div>

              {/* Métrica Cards estilo Riot */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '2px', textAlign: 'center' }}>
                  <Package color="#d13639" style={{ marginBottom: '8px' }} />
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888888' }}>LOTE A PEDIR (Q*)</h4>
                  <p style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', margin: 0 }}>{result.Q_opt} <span style={{ fontSize: '12px', color: '#666' }}>unids</span></p>
                </div>

                <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '2px', textAlign: 'center' }}>
                  <RefreshCw color="#c8aa6e" style={{ marginBottom: '8px' }} />
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888888' }}>PUNTO REORDEN (R*)</h4>
                  <p style={{ fontSize: '26px', fontWeight: '900', color: '#c8aa6e', margin: 0 }}>{result.R_punto_reorden} <span style={{ fontSize: '12px', color: '#666' }}>unids</span></p>
                </div>

                <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '2px', textAlign: 'center' }}>
                  <ShieldAlert color="#208b3a" style={{ marginBottom: '8px' }} />
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888888' }}>STOCK SEGURIDAD (B)</h4>
                  <p style={{ fontSize: '26px', fontWeight: '900', color: '#208b3a', margin: 0 }}>{result.B_stock_seguridad} <span style={{ fontSize: '12px', color: '#666' }}>unids</span></p>
                </div>
              </div>

              {/* Gráfica Estocástica */}
              <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#888888', marginBottom: '15px' }}>
                DISTRIBUCIÓN NORMAL DE LA DEMANDA EN LEAD TIME
              </h3>
              <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', padding: '20px', borderRadius: '2px', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="x" stroke="#444444" tick={{ fill: '#888888', fontSize: 11 }} />
                    <YAxis stroke="#444444" tick={{ fill: '#888888', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid #333333', color: '#ffffff' }} />
                    <Area type="monotone" dataKey="y" stroke="#d13639" fill="#d13639" fillOpacity={0.25} strokeWidth={2} />
                    <ReferenceLine x={result.R_punto_reorden} stroke="#c8aa6e" strokeDasharray="3 3" label={{ value: 'R*', fill: '#c8aa6e', position: 'top', fontSize: 12, fontWeight: 'bold' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#666666' }}>
              <Activity size={48} color="#333333" style={{ marginBottom: '15px' }} />
              <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                PRESIONA "EJECUTAR SIMULACIÓN" PARA GENERAR LOS RESULTADOS
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}