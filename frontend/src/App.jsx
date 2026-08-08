import React, { useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Package, ShieldAlert, RefreshCw, Cpu, Activity, Sun, Moon, HelpCircle, X } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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
      const res = await axios.post('/api/calcular', formData);
      setResult(res.data);
    } catch (err) {
      alert("Error de conexión con la API en Python.");
    }
  };

  const chartData = result?.curva_normal.x.map((x, i) => ({
    x,
    y: result.curva_normal.y[i]
  })) || [];

  // Paleta UI calibrada profesionalmente para Dark y Light Mode
  const theme = {
    bgApp: isDarkMode ? '#111111' : '#f8fafc',
    bgHeader: isDarkMode ? '#111111' : '#ffffff',
    bgCard: isDarkMode ? '#181818' : '#ffffff',
    bgInner: isDarkMode ? '#181818' : '#f1f5f9',
    bgPill: isDarkMode ? '#222222' : '#f1f5f9',
    border: isDarkMode ? '#262626' : '#e2e8f0',
    textMain: isDarkMode ? '#ffffff' : '#0f172a',
    textSub: isDarkMode ? '#a1a1aa' : '#475569',
    labelColor: isDarkMode ? '#a1a1aa' : '#334155',
    inputBg: isDarkMode ? '#0a0a0a' : '#f8fafc',
    inputBorder: isDarkMode ? '#333333' : '#cbd5e1',
    chartLine: isDarkMode ? '#444444' : '#94a3b8',
    cardShadow: isDarkMode ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)'
  };

  return (
    <div style={{ 
      backgroundColor: theme.bgApp, 
      color: theme.textMain, 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Header Estilo Riot Games */}
      <header style={{ 
        backgroundColor: theme.bgHeader, 
        borderBottom: `1px solid ${theme.border}`, 
        padding: '0 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '65px',
        boxSizing: 'border-box',
        flexShrink: 0,
        boxShadow: theme.cardShadow
      }}>
        {/* Branding & Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            backgroundColor: '#e52136', 
            color: '#fff', 
            padding: '8px 16px', 
            fontWeight: '900', 
            borderRadius: '8px', 
            letterSpacing: '1.5px', 
            fontSize: '13px',
            boxShadow: '0 2px 8px rgba(229, 33, 54, 0.3)'
          }}>
            UNET
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: theme.border }} />

          <div>
            <h1 style={{ margin: 0, fontSize: '13px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', color: theme.textMain }}>
              SIMULADOR DE INVENTARIO
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: theme.textSub, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
              Investigación de Operaciones II — Caso Port Harcourt
            </p>
          </div>
        </div>

        {/* Acciones e Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            backgroundColor: theme.bgPill, 
            padding: '6px 16px', 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: `1px solid ${theme.border}`
          }}>
            <Cpu size={14} color="#e52136" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: theme.textMain, letterSpacing: '0.5px' }}>
              Revisión Continua (Q, R)
            </span>
          </div>

          <button 
            onClick={() => setShowGuide(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              backgroundColor: theme.bgPill, 
              border: `1px solid ${theme.border}`, 
              color: theme.textMain, 
              padding: '8px 18px', 
              borderRadius: '20px', 
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease'
            }}
          >
            <HelpCircle size={14} color="#e52136" /> Guía
          </button>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ 
              backgroundColor: theme.bgPill, 
              border: `1px solid ${theme.border}`, 
              color: theme.textMain, 
              padding: '8px 12px', 
              borderRadius: '20px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {isDarkMode ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#475569" />}
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div style={{ 
        width: '100%', 
        height: 'calc(100vh - 65px)', 
        padding: '16px 24px', 
        display: 'grid', 
        gridTemplateColumns: '340px 1fr', 
        gap: '16px',
        boxSizing: 'border-box'
      }}>
        
        {/* Panel Izquierdo: Inputs */}
        <div style={{ 
          backgroundColor: theme.bgCard, 
          border: `1px solid ${theme.border}`, 
          padding: '20px', 
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          height: '100%',
          boxShadow: theme.cardShadow
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <h2 style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px', margin: 0, textAlign: 'center', color: theme.textMain }}>
              PARÁMETROS DE ENTRADA
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '12px 0' }}>
              <div>
                <label style={labelStyle(theme)}>DEMANDA ANUAL (D) <span style={{ opacity: 0.75 }}>[unids/año]</span></label>
                <input type="number" name="demanda_anual" value={formData.demanda_anual} onChange={handleChange} style={inputStyle(theme)} />
              </div>

              <div>
                <label style={labelStyle(theme)}>COSTO DE PEDIDO (K) <span style={{ opacity: 0.75 }}>[$ / orden]</span></label>
                <input type="number" name="costo_pedido" value={formData.costo_pedido} onChange={handleChange} style={inputStyle(theme)} />
              </div>

              <div>
                <label style={labelStyle(theme)}>COSTO MANTENIMIENTO (h) <span style={{ opacity: 0.75 }}>[$ / unid-año]</span></label>
                <input type="number" name="costo_mantenimiento" value={formData.costo_mantenimiento} onChange={handleChange} style={inputStyle(theme)} />
              </div>

              <div>
                <label style={labelStyle(theme)}>TIEMPO DE ENTREGA - LEAD TIME (L) <span style={{ opacity: 0.75 }}>[días]</span></label>
                <input type="number" name="lead_time_dias" value={formData.lead_time_dias} onChange={handleChange} style={inputStyle(theme)} />
              </div>

              <div>
                <label style={labelStyle(theme)}>DEMANDA DIARIA PROMEDIO (d) <span style={{ opacity: 0.75 }}>[unids/día]</span></label>
                <input type="number" name="demanda_diaria_promedio" value={formData.demanda_diaria_promedio} onChange={handleChange} style={inputStyle(theme)} />
              </div>

              <div>
                <label style={labelStyle(theme)}>DESVIACIÓN ESTÁNDAR DIARIA (σd) <span style={{ opacity: 0.75 }}>[unids/día]</span></label>
                <input type="number" name="desviacion_diaria" value={formData.desviacion_diaria} onChange={handleChange} style={inputStyle(theme)} />
              </div>

              <div>
                <label style={labelStyle(theme)}>NIVEL DE SERVICIO DESEADO (NS) <span style={{ opacity: 0.75 }}>[%]</span></label>
                <input type="number" name="nivel_servicio_pct" value={formData.nivel_servicio_pct} onChange={handleChange} style={inputStyle(theme)} />
              </div>
            </div>
          </div>

          <button
            onClick={handleSimular}
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: '#e52136', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '900', 
              fontSize: '11px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer', 
              marginTop: '10px',
              boxShadow: '0 4px 12px rgba(229, 33, 54, 0.3)'
            }}  >
            EJECUTAR SIMULACIÓN
          </button>
        </div>

        {/* Panel Derecho: Dashboard */}
        <div style={{ 
          backgroundColor: theme.bgCard, 
          border: `1px solid ${theme.border}`, 
          padding: '20px', 
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          height: '100%',
          overflow: 'hidden',
          boxShadow: theme.cardShadow
        }}>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>
              {/* Banner Instrucción */}
              <div style={{ 
                backgroundColor: theme.bgInner, 
                borderLeft: '4px solid #e52136', 
                padding: '12px 16px', 
                borderRadius: '8px',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#e52136', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  INSTRUCCIÓN OPERATIVA PARA ALMACÉN
                </span>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: theme.textMain, lineHeight: '1.3' }}>
                  {result.instruccion_usuario}
                </p>
              </div>

              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flexShrink: 0 }}>
                <div style={{ backgroundColor: theme.bgInner, border: `1px solid ${theme.border}`, padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <Package color="#e52136" size={18} />
                  <h4 style={{ margin: '4px 0 2px 0', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.textSub, fontWeight: '700' }}>LOTE A PEDIR (Q*)</h4>
                  <p style={{ fontSize: '20px', fontWeight: '900', color: theme.textMain, margin: 0 }}>{result.Q_opt} <span style={{ fontSize: '10px', color: theme.textSub }}>unids</span></p>
                </div>

                <div style={{ backgroundColor: theme.bgInner, border: `1px solid ${theme.border}`, padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <RefreshCw color="#d97706" size={18} />
                  <h4 style={{ margin: '4px 0 2px 0', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.textSub, fontWeight: '700' }}>PUNTO REORDEN (R*)</h4>
                  <p style={{ fontSize: '20px', fontWeight: '900', color: '#d97706', margin: 0 }}>{result.R_punto_reorden} <span style={{ fontSize: '10px', color: theme.textSub }}>unids</span></p>
                </div>

                <div style={{ backgroundColor: theme.bgInner, border: `1px solid ${theme.border}`, padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <ShieldAlert color="#16a34a" size={18} />
                  <h4 style={{ margin: '4px 0 2px 0', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.textSub, fontWeight: '700' }}>STOCK SEGURIDAD (B)</h4>
                  <p style={{ fontSize: '20px', fontWeight: '900', color: '#16a34a', margin: 0 }}>{result.B_stock_seguridad} <span style={{ fontSize: '10px', color: theme.textSub }}>unids</span></p>
                </div>
              </div>

              {/* Gráfica Ajustada */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <h3 style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: theme.textSub, margin: '0 0 8px 0', textAlign: 'center' }}>
                  DISTRIBUCIÓN NORMAL DE LA DEMANDA EN LEAD TIME
                </h3>
                <div style={{ backgroundColor: theme.bgInner, border: `1px solid ${theme.border}`, padding: '10px', borderRadius: '8px', flex: 1, width: '100%', minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="x" stroke={theme.chartLine} tick={{ fill: theme.textSub, fontSize: 9, fontWeight: 600 }} />
                      <YAxis stroke={theme.chartLine} tick={{ fill: theme.textSub, fontSize: 9, fontWeight: 600 }} />
                      <Tooltip contentStyle={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}`, color: theme.textMain, fontSize: '11px', borderRadius: '8px', boxShadow: theme.cardShadow }} />
                      <Area type="monotone" dataKey="y" stroke="#e52136" fill="#e52136" fillOpacity={0.25} strokeWidth={2} />
                      <ReferenceLine x={result.R_punto_reorden} stroke="#d97706" strokeDasharray="3 3" label={{ value: 'R*', fill: '#d97706', position: 'top', fontSize: 10, fontWeight: 'bold' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', margin: 'auto', color: theme.textSub }}>
              <Activity size={40} color={theme.textSub} style={{ marginBottom: '10px' }} />
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontWeight: '700' }}>
                PRESIONA "EJECUTAR SIMULACIÓN" PARA GENERAR LOS RESULTADOS
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Modal Guía */}
      {showGuide && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '450px',
            width: '90%',
            color: theme.textMain,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: '10px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: '#e52136' }}>
                Guía de Uso del Simulador
              </h3>
              <X size={16} style={{ cursor: 'pointer', color: theme.textSub }} onClick={() => setShowGuide(false)} />
            </div>
            
            <div style={{ fontSize: '11px', lineHeight: '1.6', color: theme.textMain }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>1. Parámetros:</strong> Modifica la demanda, tiempos y costos según la operación.</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>2. Ejecución:</strong> Presiona <code>EJECUTAR SIMULACIÓN</code>.</p>
              <p style={{ margin: 0 }}><strong>3. Resultados:</strong> La gráfica y las tarjetas mostrarán los puntos óptimos de reorden y stock de seguridad.</p>
            </div>

            <button 
              onClick={() => setShowGuide(false)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#e52136',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '10px',
                cursor: 'pointer',
                marginTop: '16px',
                textTransform: 'uppercase'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function labelStyle(theme) {
  return {
    fontSize: '9px',
    fontWeight: '800',
    color: theme.labelColor,
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '4px',
    textAlign: 'center'
  };
}

function inputStyle(theme) {
  return {
    width: '100%', 
    padding: '8px 10px', 
    borderRadius: '6px', 
    backgroundColor: theme.inputBg, 
    color: theme.textMain, 
    border: `1px solid ${theme.inputBorder}`, 
    fontSize: '12px',
    fontWeight: '700',
    textAlign: 'center',
    boxSizing: 'border-box',
    outline: 'none'
  };
}