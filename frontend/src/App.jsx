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
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  // Estados
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  console.log("Estos son los gastos:", gastos[gastos.length - 1]);
  const [guardandoIngresos, setGuardandoIngresos] = useState(new Set());
  const [guardandoGastos, setGuardandoGastos] = useState(new Set());
  
  // ✅ Estados para categorías
  const [categoriasIngresos, setCategoriasIngresos] = useState(['Trabajo', 'Inversiones', 'Alquiler', 'Bizum', 'Otros']);
  const [categoriasGastos, setCategoriasGastos] = useState(['Vivienda', 'Alimentación', 'Transporte', 'Ocio', 'Salud', 'Educación', 'Servicios', 'bizum', 'Otros']);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [initialIngresos, initialGastos, catIngresos, catGastos] = await Promise.all([
          ingresosData.getAll(),
          gastosData.getAll(),
          categoriasService.getIngresos(),
          categoriasService.getGastos()
        ]);

        // ✅ Validar que sean arrays antes de setear
        setIngresos(Array.isArray(initialIngresos) ? initialIngresos : []);
        setGastos(Array.isArray(initialGastos) ? initialGastos : []);
        setCategoriasIngresos(Array.isArray(catIngresos) ? catIngresos : categoriasIngresos);
        setCategoriasGastos(Array.isArray(catGastos) ? catGastos : categoriasGastos);
        setCargandoCategorias(false);

        console.log('✅ Categorías cargadas:', { catIngresos, catGastos });
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        // ✅ En caso de error, mantener arrays vacíos
        setIngresos([]);
        setGastos([]);
        setCargandoCategorias(false);
      }
    };

    cargarDatos();
  }, []);

  // ========== FUNCIONES PARA GESTIONAR INGRESOS ==========

  const agregarIngreso = () => {
    // ✅ Genera un ID único CADA VEZ que se llama la función
    const nuevoId = uuidv4();
    
    // ✅ Usa prev para acceder al estado actual
    setIngresos(prev => [...prev, {
      id: nuevoId,
      concepto: '',
      cantidad: 0,
      categoria: 'Trabajo',
      fecha: '',
      isNew: true
    }]);
  };

  // ⭐ Solo actualiza el estado local (onChange)
  const actualizarIngreso = (id, campo, valor) => {
    console.log(`Este es el id creado: ${id}`);
    // ✅ Usa prev
    setIngresos(prev => prev.map(i =>
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
      return;
    }

    // Evitar guardar si ya está guardando
    if (guardandoIngresos.has(id)) return;

    setGuardandoIngresos(prev => new Set(prev).add(id));

    try {
      const { isNew, ...ingresoParaGuardar } = ingreso;

      if (isNew) {
        console.log(`isNew: ${isNew}`);
        console.log('Ingreso a guardar:', ingresoParaGuardar);
        const savedIngreso = await ingresosData.create(ingresoParaGuardar);
        console.log("✅ Ingreso guardado en backend:", savedIngreso);
        
        // ✅ CORRECCIÓN: Añadir return explícito
        setIngresos(prev => prev.map(i => 
          i.id === id ? { ...i, isNew: false } : i
        ));
        
        console.log("✅ Estado actualizado: isNew = false");
      } else {
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

    // ✅ Usa prev
    setIngresos(prev => prev.filter(i => i.id !== id));
  };

  // ========== FUNCIONES PARA GESTIONAR GASTOS ==========
  // ✅ COPIADAS EXACTAMENTE DE INGRESOS

  const agregarGasto = () => {
    // ✅ Genera un ID único CADA VEZ que se llama la función
    const nuevoId = uuidv4();
    
    // ✅ Usa prev para acceder al estado actual
    setGastos(prev => [...prev, {
      id: nuevoId,
      concepto: '',
      cantidad: 0,
      categoria: 'Otros',
      fecha: '',
      isNew: true
    }]);
  };

  // ⭐ Solo actualiza el estado local (onChange)
  const actualizarGasto = (id, campo, valor) => {
    console.log(`Este es el id creado: ${id}`);
    // ✅ Usa prev
    setGastos(prev => prev.map(g =>
      g.id === id
        ? { ...g, [campo]: campo === 'cantidad' ? parseFloat(valor) || 0 : valor }
        : g
    ));
  };

  // ⭐ Guarda en backend al salir del campo (onBlur)
  const guardarGasto = async (id) => {
    const gasto = gastos.find(g => g.id === id);
    console.log("guardarGasto llamado para id:", id, gasto);
    if (!gasto) return;

    // ⭐ Validar que los campos obligatorios estén completos
    const estaCompleto =
      gasto.concepto.trim() !== '' &&
      gasto.cantidad > 0 &&
      gasto.fecha !== '';

    if (!estaCompleto) {
      return;
    }

    // Evitar guardar si ya está guardando
    if (guardandoGastos.has(id)) return;

    setGuardandoGastos(prev => new Set(prev).add(id));

    try {
      const { isNew, ...gastoParaGuardar } = gasto;
      console.log("Gasto para guardar:", gastoParaGuardar);

      if (isNew) {
        console.log(`isNew: ${isNew}`);
        console.log('Gasto a guardar:', gastoParaGuardar);
        const savedGasto = await gastosData.create(gastoParaGuardar);
        console.log("✅ Gasto guardado en backend:", savedGasto);
        
        // ✅ CORRECCIÓN: Añadir return explícito
        setGastos(prev => prev.map(g => 
          g.id === id ? { ...g, isNew: false } : g
        ));
        
        console.log("✅ Estado actualizado: isNew = false");
      } else {
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

    // ✅ Usa prev
    setGastos(prev => prev.filter(g => g.id !== id));
  };

  // Cálculos financieros
  const totalIngresos = ingresos.reduce((sum, i) => sum + (i.cantidad || 0), 0);
  const totalGastos = gastos.reduce((sum, g) => sum + (g.cantidad || 0), 0);
  const balance = totalIngresos - totalGastos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header DollarSign={DollarSign} />

        <SearchBar onSearch={(mes, anyo) => {
          ingresosData.findByMonthYear(mes, anyo).then(filtradosIngresos => {
            // ✅ Valida antes de setear
            setIngresos(Array.isArray(filtradosIngresos) ? filtradosIngresos : []);
          });
          gastosData.findByMonthYear(mes, anyo).then(filtradosGastos => {
            // ✅ Valida antes de setear
            setGastos(Array.isArray(filtradosGastos) ? filtradosGastos : []);
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
          onGuardar={guardarIngreso}
          onEliminar={eliminarIngreso}
          total={totalIngresos}
          guardandoIds={guardandoIngresos}
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
          onGuardar={guardarGasto}
          onEliminar={eliminarGasto}
          total={totalGastos}
          guardandoIds={guardandoGastos}
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