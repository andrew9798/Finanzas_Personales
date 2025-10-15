// Componente: Sección de Transacciones (Ingresos o Gastos)

import { PlusCircle } from 'lucide-react';
import TablaTransacciones from './TablaTransacciones';
import ResumenCategorias from './ResumenCategorias';


const SeccionTransacciones = ({ 
  titulo, 
  icono: Icono, 
  datos, 
  categorias, 
  tipo,
  onAgregar, 
  onActualizar, 
  onEliminar,
  total
}) => {
  const colorBoton = tipo === 'ingreso' 
    ? 'bg-green-600 hover:bg-green-700' 
    : 'bg-red-600 hover:bg-red-700';
  
  const colorIcono = tipo === 'ingreso' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icono className={colorIcono} size={28} />
          {titulo}
        </h2>
        <button
          onClick={onAgregar}
          className={`flex items-center gap-2 ${colorBoton} text-white px-4 py-2 rounded-lg transition`}
        >
          <PlusCircle size={20} />
          Agregar {tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
        </button>
      </div>

      <TablaTransacciones
        datos={datos}
        categorias={categorias}
        tipo={tipo}
        onActualizar={onActualizar}
        onEliminar={onEliminar}
      />

      <ResumenCategorias
        datos={datos}
        categorias={categorias}
        total={total}
        tipo={tipo}
      />
    </div>
  );
};

export default SeccionTransacciones;