import axios from 'axios';
const baseUrl = 'http://localhost:1234/categorias';

// Función para obtener categorías de ingresos
const getIngresos = () => {
  const request = axios.get(`${baseUrl}/ingresos`);
  return request.then(response => response.data);
};

// Función para obtener categorías de gastos
const getGastos = () => {
  const request = axios.get(`${baseUrl}/gastos`);
  return request.then(response => response.data);
};

export default {
  getIngresos,
  getGastos
};