import express, { json } from 'express';
import cors from 'cors';
const app = express()
import { randomUUID } from 'crypto';

// ⭐ ACTUALIZAR IMPORTS - Importar las funciones y categorías correctas
import { validateIngreso, validateGasto, categoriasIngresos, categoriasGastos } from "./schemas/movimientos.js";

// Deshabilitar la cabecera 'X-Powered-By' por seguridad
app.disable('x-powered-by');

// ⭐ MIDDLEWARES - EN ESTE ORDEN
app.use(json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// ⭐ LLAMADA A LOS JSON (IMPORTACIÓN DIRECTA)
import ingresosJsonData from "./ingresos.json" assert { type: 'json' };
import gastosJsonData from './gastos.json' assert { type: 'json' };

// ⭐ DECLARAR VARIABLES MUTABLES A PARTIR DE LOS DATOS DEL JSON
let ingresos = [...ingresosJsonData];
let gastos = [...gastosJsonData];

console.log(`Datos de ingresos iniciales cargados: ${ingresos.length} registros.`);
console.log(`Datos de gastos iniciales cargados: ${gastos.length} registros.`);


// ⭐ ENDPOINTS PARA OBTENER CATEGORÍAS
app.get('/categorias/ingresos', (req, res) => {
  res.status(200).json(categoriasIngresos);
});

app.get('/categorias/gastos', (req, res) => {
  res.status(200).json(categoriasGastos);
});

// ========== ENDPOINTS DE INGRESOS ==========

// Endpoint para obtener todos los ingresos
app.get('/ingresos', (req, res) => {
  res.status(200).json(ingresos);
});

// Endpoint para obtener ingresos filtrados por mes y año
app.get('/ingresos/:anyo/:mes', (req, res) => {
  const { anyo, mes } = req.params;
  if (mes && anyo) {
    const ingresosFiltrados = ingresos.filter(ingreso => {
      const fecha = new Date(ingreso.fecha);
      if (isNaN(fecha.getTime())) return false;
      return fecha.getMonth() + 1 === parseInt(mes) && fecha.getFullYear() === parseInt(anyo);
    });
    res.status(200).json(ingresosFiltrados);
  } else {
    res.status(404).json({ error: 'Parámetros mes y año no han sido encontrados' });
  }
});

// Endpoint para crear un nuevo ingreso
app.post('/ingresos', (req, res) => {
  const result = validateIngreso(req.body);
  console.log('📥 Validación ingreso:', result);

  if (result.error) {
    console.log("❌ Error de validación:", result.error);
    return res.status(400).json({ errors: result.error.errors });
  }

  const ingreso = result.data;
  const id = randomUUID();
  const nuevoIngreso = { ...ingreso, id };
  ingresos.push(nuevoIngreso);
  
  console.log('✅ Ingreso creado:', nuevoIngreso);
  res.status(201).json(nuevoIngreso);
});

// Endpoint actualizar un ingreso
app.put('/ingresos/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📝 Actualizando ingreso con id: ${id}`);

  const ingresoIndex = ingresos.findIndex(i => String(i.id) === id);

  if (ingresoIndex !== -1) {
    const result = validateIngreso(req.body);
    
    if (result.error) {
      console.log("❌ Error de validación:", result.error);
      return res.status(400).json({ errors: result.error.errors });
    }

    const updatedIngreso = { ...ingresos[ingresoIndex], ...result.data };
    ingresos[ingresoIndex] = updatedIngreso;
    
    console.log('✅ Ingreso actualizado:', updatedIngreso);
    res.status(200).json(updatedIngreso);
  } else {
    console.log('❌ Ingreso no encontrado');
    res.status(404).json({ error: 'Ingreso no encontrado' });
  }
});

// Endpoint eliminar un ingreso
app.delete('/ingresos/:id', (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Eliminando ingreso con id: ${id}`);
  
  const ingresoIndex = ingresos.findIndex(i => String(i.id) === id);
  
  if (ingresoIndex !== -1) {
    ingresos.splice(ingresoIndex, 1);
    console.log('✅ Ingreso eliminado');
    res.status(204).send();
  } else {
    console.log('❌ Ingreso no encontrado');
    res.status(404).json({ error: 'Ingreso no encontrado' });
  }
});

// ========== ENDPOINTS DE GASTOS ==========
// ✅ COPIADOS EXACTAMENTE DE INGRESOS

// Endpoint para obtener todos los gastos
app.get('/gastos', (req, res) => {
  res.status(200).json(gastos);
});

// Endpoint para obtener gastos filtrados por mes y año
app.get('/gastos/:anyo/:mes', (req, res) => {
  const { anyo, mes } = req.params;
  if (mes && anyo) {
    const gastosFiltrados = gastos.filter(gasto => {
      const fecha = new Date(gasto.fecha);
      if (isNaN(fecha.getTime())) return false;
      return fecha.getMonth() + 1 === parseInt(mes) && fecha.getFullYear() === parseInt(anyo);
    });
    res.status(200).json(gastosFiltrados);
  } else {
    res.status(404).json({ error: 'Parámetros mes y año no han sido encontrados' });
  }
}); 

// Endpoint para crear un nuevo gasto
app.post('/gastos', (req, res) => {
  const result = validateGasto(req.body);
  console.log('📥 Validación gasto:', result);

  if (result.error) {
    console.log("❌ Error de validación:", result.error);
    return res.status(400).json({ errors: result.error.errors });
  }

  const gasto = result.data;
  const id = randomUUID();
  const nuevoGasto = { ...gasto, id };
  gastos.push(nuevoGasto);
  
  console.log('✅ Gasto creado:', nuevoGasto);
  res.status(201).json(nuevoGasto);
}); 

// Endpoint actualizar un gasto
app.put('/gastos/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📝 Actualizando gasto con id: ${id}`);

  const gastoIndex = gastos.findIndex(g => String(g.id) === id);

  if (gastoIndex !== -1) {
    const result = validateGasto(req.body);
    
    if (result.error) {
      console.log("❌ Error de validación:", result.error);
      return res.status(400).json({ errors: result.error.errors });
    }

    const updatedGasto = { ...gastos[gastoIndex], ...result.data };
    gastos[gastoIndex] = updatedGasto;
    
    console.log('✅ Gasto actualizado:', updatedGasto);
    res.status(200).json(updatedGasto);
  } else {
    console.log('❌ Gasto no encontrado');
    res.status(404).json({ error: 'Gasto no encontrado' });
  }
});

// Endpoint eliminar un gasto
app.delete('/gastos/:id', (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Eliminando gasto con id: ${id}`);
  
  const gastoIndex = gastos.findIndex(g => String(g.id) === id);
  
  if (gastoIndex !== -1) {
    gastos.splice(gastoIndex, 1);
    console.log('✅ Gasto eliminado');
    res.status(204).send();
  } else {
    console.log('❌ Gasto no encontrado');
    res.status(404).json({ error: 'Gasto no encontrado' });
  }
});

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
});