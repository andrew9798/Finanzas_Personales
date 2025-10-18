//voy a hacer un buscador en el cual introduciendo el mes y el año me devuelva los gastos e ingresos de ese mes y año

import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [mes, setMes] = useState('');
  const [anyo, setAnyo] = useState('');

  const handleSearch = () => {
    onSearch(mes, anyo);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 flex items-center space-x-4 mb-6">
      {/* Selector de Mes y Año */}
      <select className='p-4 bg-blue-100 border border-gray-300 rounded-xl'  name="mes" id="mes" value={mes} onChange={e => setMes(e.target.value)}> {/*agregado id y name*/}
        <option value="" disabled selected>Mes</option>
        <option value="01">Enero</option>
        <option value="02">Febrero</option> 
        <option value="03">Marzo</option>
        <option value="04">Abril</option>
        <option value="05">Mayo</option>
        <option value="06">Junio</option>
        <option value="07">Julio</option>
        <option value="08">Agosto</option>
        <option value="09">Septiembre</option>
        <option value="10">Octubre</option>
        <option value="11">Noviembre</option>
        <option value="12">Diciembre</option>
      </select>
      <select className='p-4 bg-blue-100 border border-gray-300 rounded-xl' name="anio" id="anio" value={anyo} onChange={e => setAnyo(e.target.value)}>
        <option value="" disabled selected>Año</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option> 
        <option value="2028">2028</option>
        <option value="2029">2029</option>
        <option value="2030">2030</option>
      </select>
      <button className="bg-blue-500 text-white rounded-lg px-4 py-2" onClick={handleSearch}>Buscar</button>
    </div>
  );
};

export default SearchBar;