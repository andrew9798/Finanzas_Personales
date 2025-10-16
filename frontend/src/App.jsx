import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import SeccionTransacciones from './components/SeccionTransacciones';
import AnalisisFinanciero from './components/AnalisisFinanciero';
import Header from './components/Header';
import PanelResumen from './components/PanelResumen';
import ingresosData from './services/ingresos.js';
import gastosData from './services/gastos.js';
import { use } from 'react';
import { useEffect } from 'react';
  

// Componente Principal: APP
const App = () => {
  // Estados
  const [ingresos, setIngresos] = useState([
    { id: 1, concepto: 'Salario', cantidad: 0, categoria: 'Trabajo', fecha: '' }
  ]);
  
  const [gastos, setGastos] = useState([
    { id: 1, concepto: 'Alquiler', cantidad: 0, categoria: 'Vivienda', fecha: '' }
  ]);


  useEffect(() => { 

    ingresosData.getAll().then(initialIngresos => {
      setIngresos(initialIngresos)
    })

    gastosData.getAll().then(initialGastos => {
      setGastos(initialGastos)
    })

  }, []);

  // Categorías
  const categoriasIngresos = ['Trabajo', 'Inversiones', 'Alquiler', 'Otros'];
  const categoriasGastos = ['Vivienda', 'Alimentación', 'Transporte', 'Ocio', 'Salud', 'Educación', 'Servicios', 'Otros'];

  // Funciones para gestionar Ingresos
  const agregarIngreso = () => {
    const nuevoId = ingresos.length > 0 ? Math.max(...ingresos.map(i => i.id)) + 1 : 1;
    setIngresos([...ingresos, { id: nuevoId, concepto: '', cantidad: 0, categoria: 'Trabajo', fecha: '' }]);
  };

  const actualizarIngreso = (id, campo, valor) => {
    setIngresos(ingresos.map(i => 
      i.id === id ? { ...i, [campo]: campo === 'cantidad' ? parseFloat(valor) || 0 : valor } : i
    ));
  };

  const eliminarIngreso = (id) => {
    setIngresos(ingresos.filter(i => i.id !== id));
  };

  // Funciones para gestionar Gastos
  const agregarGasto = () => {
    const nuevoId = gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 1;
    setGastos([...gastos, { id: nuevoId, concepto: '', cantidad: 0, categoria: 'Otros', fecha: '' }]);
  };

  const actualizarGasto = (id, campo, valor) => {
    setGastos(gastos.map(g => 
      g.id === id ? { ...g, [campo]: campo === 'cantidad' ? parseFloat(valor) || 0 : valor } : g
    ));
  };

  const eliminarGasto = (id) => {
    setGastos(gastos.filter(g => g.id !== id));
  };

  // Cálculos financieros
  const totalIngresos = ingresos.reduce((sum, i) => sum + i.cantidad, 0);
  const totalGastos = gastos.reduce((sum, g) => sum + g.cantidad, 0);
  const balance = totalIngresos - totalGastos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header DollarSign={DollarSign} />

        {/* Panel de Resumen */}
        <PanelResumen 
          totalIngresos={totalIngresos}
          totalGastos={totalGastos}
          balance={balance}
        />

        {/* Sección de Ingresos */}
        <SeccionTransacciones
          titulo="Ingresos"
          icono={TrendingUp}
          datos={ingresos}
          categorias={categoriasIngresos}
          tipo="ingreso"
          onAgregar={agregarIngreso}
          onActualizar={actualizarIngreso}
          onEliminar={eliminarIngreso}
          total={totalIngresos}
        />

        {/* Sección de Gastos */}
        <SeccionTransacciones
          titulo="Gastos"
          icono={TrendingDown}
          datos={gastos}
          categorias={categoriasGastos}
          tipo="gasto"
          onAgregar={agregarGasto}
          onActualizar={actualizarGasto}
          onEliminar={eliminarGasto}
          total={totalGastos}
        />

        {/* Análisis Financiero */}
        <AnalisisFinanciero
          totalIngresos={totalIngresos}
          totalGastos={totalGastos}
          balance={balance}
        />
      </div>
    </div>
  );
};

export default App;