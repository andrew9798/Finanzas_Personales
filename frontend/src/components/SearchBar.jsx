import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [mes, setMes] = useState('');
  const [anyo, setAnyo] = useState('');

  // ⭐ Mapeo de números a nombres de meses
  const meses = {
    '01': 'Enero',
    '02': 'Febrero',
    '03': 'Marzo',
    '04': 'Abril',
    '05': 'Mayo',
    '06': 'Junio',
    '07': 'Julio',
    '08': 'Agosto',
    '09': 'Septiembre',
    '10': 'Octubre',
    '11': 'Noviembre',
    '12': 'Diciembre'
  };

  const handleSearch = () => {
    onSearch(mes, anyo);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-blue-500 mb-6">
      {/* 📱 Contenedor principal - Columna en móvil, fila en desktop */}
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
        
        {/* 🔍 Selectores y botón */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto'>
          {/* Selector de Mes */}
          <select 
            className='px-4 py-2 bg-blue-100 border border-gray-300 rounded-xl w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:outline-none' 
            name="mes" 
            id="mes" 
            value={mes} 
            onChange={e => setMes(e.target.value)}
          >
            <option value="" disabled>Mes</option>
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

          {/* Selector de Año */}
          <select 
            className='px-4 py-2 bg-blue-100 border border-gray-300 rounded-xl w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:outline-none' 
            name="anio" 
            id="anio" 
            value={anyo} 
            onChange={e => setAnyo(e.target.value)}
          >
            <option value="" disabled>Año</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option> 
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
          </select>

          {/* Botón de búsqueda */}
          <button 
            className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 active:bg-blue-700 transition duration-200 w-full sm:w-auto font-medium shadow-sm hover:shadow-md" 
            onClick={handleSearch}
          >
            Buscar
          </button>
        </div>

        {/* 📊 Resultados */}
        {mes && anyo && (
          <div className='bg-blue-300 p-3 md:p-4 rounded-lg text-white w-full md:w-auto'>
            <h3 className='text-sm md:text-base text-center md:text-left'>
              Resultados del mes <strong>{meses[mes]}</strong> del año <strong>{anyo}</strong>
            </h3>
          </div>
        )}

        {/* Mensaje por defecto */}
        {!mes || !anyo ? (
          <div className='bg-orange-300 p-3 md:p-4 rounded-lg text-white w-full md:w-auto'>
            <p className='text-sm md:text-base text-center md:text-left'>
              Selecciona un <strong>mes</strong> y <strong>año</strong> para buscar
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;