import { Trash2 } from 'lucide-react';

const TablaTransacciones = ({ 
  datos, 
  categorias, 
  tipo, 
  onActualizar, 
  onEliminar
}) => {
  const colorFocus = tipo === 'ingreso' ? 'focus:ring-green-500' : 'focus:ring-red-500';
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-2 text-gray-700 font-semibold">Concepto</th>
            <th className="text-left py-3 px-2 text-gray-700 font-semibold">Categoría</th>
            <th className="text-left py-3 px-2 text-gray-700 font-semibold">Cantidad (€)</th>
            <th className="text-left py-3 px-2 text-gray-700 font-semibold">Fecha</th>
            <th className="text-center py-3 px-2 text-gray-700 font-semibold">Acción</th>
          </tr>
        </thead>
        <tbody>
          {datos.map(item => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-2">
                <input
                  type="text"
                  value={item.concepto}
                  onChange={(e) => onActualizar(item.id, 'concepto', e.target.value)}
                  className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 ${colorFocus}`}
                  placeholder={tipo === 'ingreso' ? 'Ej: Salario mensual' : 'Ej: Compra supermercado'}
                />
              </td>
              <td className="py-3 px-2">
                <select
                  value={item.categoria}
                  onChange={(e) => onActualizar(item.id, 'categoria', e.target.value)}
                  className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 ${colorFocus}`}
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </td>
              <td className="py-3 px-2">
                <input
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => onActualizar(item.id, 'cantidad', e.target.value)}
                  className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 ${colorFocus}`}
                  step="0.01"
                  min="0"
                />
              </td>
              <td className="py-3 px-2">
                <input
                  type="date"
                  value={item.fecha}
                  onChange={(e) => onActualizar(item.id, 'fecha', e.target.value)}
                  className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 ${colorFocus}`}
                />
              </td>
              <td className="py-3 px-2 text-center">
                <button
                  onClick={() => onEliminar(item.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaTransacciones;