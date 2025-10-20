import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import SeccionTransacciones from './components/SeccionTransacciones';
import AnalisisFinanciero from './components/AnalisisFinanciero';
import Header from './components/Header';
import PanelResumen from './components/PanelResumen';
import ingresosData from './services/ingresos.js';
import gastosData from './services/gastos.js';
import SearchBar from './components/SearchBar.jsx';
import categoriasService from './services/categorias.js';

// Componente Principal: APP
const App = () => {
  // Estados
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [guardandoIngresos, setGuardandoIngresos] = useState(new Set());
  const [guardandoGastos, setGuardandoGastos] = useState(new Set());

useEffect(() => {
  const cargarDatos = async () => {
    try {
      const [initialIngresos, initialGastos, catIngresos, catGastos] = await Promise.all([
        ingresosData.getAll(),
        gastosData.getAll(),
        categoriasService.getIngresos(),  // ⭐ Usa el servicio
        categoriasService.getGastos()     // ⭐ Usa el servicio
      ]);

      setIngresos(initialIngresos);
      setGastos(initialGastos);
      setCategoriasIngresos(catIngresos);
      setCategoriasGastos(catGastos);
      setCargandoCategorias(false);

      console.log('✅ Categorías cargadas:', { catIngresos, catGastos });
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      setCargandoCategorias(false);
    }
  };

  cargarDatos();
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

  // ⭐ Solo actualiza el estado local (onChange)
  const actualizarIngreso = (id, campo, valor) => {
    setIngresos(ingresos.map(i => 
      i.id === id 
        ? { ...i, [campo]: campo === 'cantidad' ? parseFloat(valor) || 0 : valor }
        : i
    ));
  };

  // ⭐ Guarda en backend al salir del campo (onBlur)
  const guardarIngreso = async (id) => {
    const ingreso = ingresos.find(i => i.id === id);
    console.log("guardarIngreso llamado para id:", id, ingreso);
    if (!ingreso) return;

    // ⭐ Validar que los campos obligatorios estén completos
    const estaCompleto = 
      ingreso.concepto.trim() !== '' && 
      ingreso.cantidad > 0 && 
      ingreso.fecha !== '';
    
    if (!estaCompleto) {
      return; // No guarda si está incompleto
    }

    // Evitar guardar si ya está guardando
    if (guardandoIngresos.has(id)) return;

    setGuardandoIngresos(prev => new Set(prev).add(id));

    try {
      const { isNew, ...ingresoParaGuardar } = ingreso;
      
      if (isNew) {
        // ⭐ Crear nuevo ingreso en backend
        const savedIngreso = await ingresosData.create(ingresoParaGuardar);
        console.log('✅ Ingreso guardado:', savedIngreso);
        
        // Actualizar estado para quitar el flag isNew
        setIngresos(prev => prev.map(i => 
          i.id === id ? { ...i, isNew: false } : i
        ));
      } else {
        // ⭐ Actualizar ingreso existente
        await ingresosData.update(id, ingresoParaGuardar);
        console.log('🔄 Ingreso actualizado:', ingresoParaGuardar);
      }
    } catch (error) {
      console.error('❌ Error al guardar ingreso:', error);
      alert('Error al guardar el ingreso. Intenta de nuevo.');
    } finally {
      setGuardandoIngresos(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const eliminarIngreso = async (id) => {
    const ingreso = ingresos.find(i => i.id === id);
    
    // ⭐ Solo eliminar del backend si NO es nuevo (ya fue guardado)
    if (ingreso && !ingreso.isNew) {
      try {
        await ingresosData.Delete(id);
        console.log('🗑️ Ingreso eliminado del backend');
      } catch (error) {
        console.error('❌ Error al eliminar ingreso:', error);
        alert('Error al eliminar el ingreso');
        return;
      }
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

  // ⭐ Solo actualiza el estado local (onChange)
  const actualizarGasto = (id, campo, valor) => {
    setGastos(gastos.map(g => 
      g.id === id 
        ? { ...g, [campo]: campo === 'cantidad' ? parseFloat(valor) || 0 : valor }
        : g
    ));
  };

  // ⭐ Guarda en backend al salir del campo (onBlur)
  const guardarGasto = async (id) => {
    const gasto = gastos.find(g => g.id === id);
    if (!gasto) return;

    // ⭐ Validar que los campos obligatorios estén completos
    const estaCompleto = 
      gasto.concepto.trim() !== '' && 
      gasto.cantidad > 0 && 
      gasto.fecha !== '';
    
    if (!estaCompleto) {
      return; // No guarda si está incompleto
    }

    // Evitar guardar si ya está guardando
    if (guardandoGastos.has(id)) return;

    setGuardandoGastos(prev => new Set(prev).add(id));

    try {
      const { isNew, ...gastoParaGuardar } = gasto;
      
      if (isNew) {
        // ⭐ Crear nuevo gasto en backend
        const savedGasto = await gastosData.create(gastoParaGuardar);
        console.log('✅ Gasto guardado:', savedGasto);
        
        // Actualizar estado para quitar el flag isNew
        setGastos(prev => prev.map(g => 
          g.id === id ? { ...g, isNew: false } : g
        ));
      } else {
        // ⭐ Actualizar gasto existente
        await gastosData.update(id, gastoParaGuardar);
        console.log('🔄 Gasto actualizado:', gastoParaGuardar);
      }
    } catch (error) {
      console.error('❌ Error al guardar gasto:', error);
      alert('Error al guardar el gasto. Intenta de nuevo.');
    } finally {
      setGuardandoGastos(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const eliminarGasto = async (id) => {
    const gasto = gastos.find(g => g.id === id);
    
    // ⭐ Solo eliminar del backend si NO es nuevo (ya fue guardado)
    if (gasto && !gasto.isNew) {
      try {
        await gastosData.Delete(id);
        console.log('🗑️ Gasto eliminado del backend');
      } catch (error) {
        console.error('❌ Error al eliminar gasto:', error);
        alert('Error al eliminar el gasto');
        return;
      }
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
          onGuardar={guardarIngreso}  // ⭐ Nueva prop
          onEliminar={eliminarIngreso}
          total={totalIngresos}
          guardandoIds={guardandoIngresos}  // ⭐ Nueva prop
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
          onGuardar={guardarGasto}  // ⭐ Nueva prop
          onEliminar={eliminarGasto}
          total={totalGastos}
          guardandoIds={guardandoGastos}  // ⭐ Nueva prop
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