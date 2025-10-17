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
      <input
        type="text"
        placeholder="Mes"
        value={mes}
        onChange={(e) => setMes(e.target.value)}
        className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <input
        type="text"
        placeholder="Año"
        value={anyo}
        onChange={(e) => setAnyo(e.target.value)}
        className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'

      />
      <button className="bg-blue-500 text-white rounded-lg px-4 py-2" onClick={handleSearch}>Buscar</button>
    </div>
  );
};

export default SearchBar;