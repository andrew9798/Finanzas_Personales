import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import SeccionTransacciones from './components/SeccionTransacciones';
import AnalisisFinanciero from './components/AnalisisFinanciero';
import Header from './components/Header';
import PanelResumen from './components/PanelResumen';
import ingresosData from './services/ingresos.js';
import gastosData from './services/gastos.js';
import SearchBar from './components/SearchBar.jsx';

// Componente Principal: APP
const App = () => {
  // Estados
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    ingresosData.getAll().then(initialIngresos => {
      setIngresos(initialIngresos);
    });

    gastosData.getAll().then(initialGastos => {
      setGastos(initialGastos);
    });
  }, []);

  // Categorías
  const categoriasIngresos = ['Trabajo', 'Inversiones', 'Alquiler', 'Bizum', 'Otros'];
  const categoriasGastos = ['Vivienda', 'Alimentación', 'Transporte', 'Ocio', 'Salud', 'Educación', 'Servicios', 'bizum', 'Otros'];

  // ========== FUNCIONES PARA GESTIONAR INGRESOS ==========
  
  const agregarIngreso = () => {
    const nuevoId = ingresos.length > 0 ? Math.max(...ingresos.map(i => i.id)) + 1 : 1;
    // ⭐ Solo agregamos al estado local, NO guardamos en el backend aún
    setIngresos([...ingresos, { 
      id: nuevoId, 
      concepto: '', 
      cantidad: 0, 
      categoria: 'Trabajo', 
      fecha: '',
      isNew: true  // ⭐ Marca como nuevo (no guardado)
    }]);
  };

  const actualizarIngreso = (id, campo, valor) => {
    setIngresos(ingresos.map(i => {
      if (i.id === id) {
        const updatedIngreso = { 
          ...i, 
          [campo]: campo === 'cantidad' ? parseFloat(valor) || 0 : valor 
        };
        
        // ⭐ Validar si todos los campos obligatorios están completos
        const estaCompleto = 
          updatedIngreso.concepto.trim() !== '' && 
          updatedIngreso.cantidad > 0 && 
          updatedIngreso.fecha !== '';
        
        // ⭐ Si es nuevo Y está completo, guardarlo en el backend
        if (updatedIngreso.isNew && estaCompleto) {
          const { isNew, ...ingresoParaGuardar } = updatedIngreso; // Remover el flag isNew
          ingresosData.create(ingresoParaGuardar).then(savedIngreso => {
            console.log('✅ Ingreso guardado:', savedIngreso);
          });
          delete updatedIngreso.isNew; // Marcar como guardado
        } 
        // ⭐ Si NO es nuevo (ya existe en backend), actualizarlo
        else if (!updatedIngreso.isNew) {
          const { isNew, ...ingresoParaActualizar } = updatedIngreso;
          ingresosData.update(id, ingresoParaActualizar);
        }
        
        return updatedIngreso;
      }
      return i;
    }));
  };

  const eliminarIngreso = (id) => {
    const ingreso = ingresos.find(i => i.id === id);
    
    // ⭐ Solo eliminar del backend si NO es nuevo (ya fue guardado)
    if (ingreso && !ingreso.isNew) {
      ingresosData.Delete(id);
    }
    
    setIngresos(ingresos.filter(i => i.id !== id));
  };

  // ========== FUNCIONES PARA GESTIONAR GASTOS ==========
  
  const agregarGasto = () => {
    const nuevoId = gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 1;
    // ⭐ Solo agregamos al estado local, NO guardamos en el backend aún
    setGastos([...gastos, { 
      id: nuevoId, 
      concepto: '', 
      cantidad: 0, 
      categoria: 'Otros', 
      fecha: '',
      isNew: true  // ⭐ Marca como nuevo (no guardado)
    }]);
  };

  const actualizarGasto = (id, campo, valor) => {
    setGastos(gastos.map(g => {
      if (g.id === id) {
        const updatedGasto = { 
          ...g, 
          [campo]: campo === 'cantidad' ? parseFloat(valor) || 0 : valor 
        };
        
        // ⭐ Validar si todos los campos obligatorios están completos
        const estaCompleto = 
          updatedGasto.concepto.trim() !== '' && 
          updatedGasto.cantidad > 0 && 
          updatedGasto.fecha !== '';
        
        // ⭐ Si es nuevo Y está completo, guardarlo en el backend
        if (updatedGasto.isNew && estaCompleto) {
          const { isNew, ...gastoParaGuardar } = updatedGasto; // Remover el flag isNew
          gastosData.create(gastoParaGuardar).then(savedGasto => {
            console.log('✅ Gasto guardado:', savedGasto);
          });
          delete updatedGasto.isNew; // Marcar como guardado
        } 
        // ⭐ Si NO es nuevo (ya existe en backend), actualizarlo
        else if (!updatedGasto.isNew) {
          const { isNew, ...gastoParaActualizar } = updatedGasto;
          gastosData.update(id, gastoParaActualizar);
        }
        
        return updatedGasto;
      }
      return g;
    }));
  };

  const eliminarGasto = (id) => {
    const gasto = gastos.find(g => g.id === id);
    
    // ⭐ Solo eliminar del backend si NO es nuevo (ya fue guardado)
    if (gasto && !gasto.isNew) {
      gastosData.Delete(id);
    }
    
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

        <SearchBar onSearch={(mes, anyo) => {
          ingresosData.findByMonthYear(mes, anyo).then(filtradosIngresos => {
            setIngresos(filtradosIngresos);
          });
          gastosData.findByMonthYear(mes, anyo).then(filtradosGastos => {
            setGastos(filtradosGastos);
          });
        }} />

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