import { Trash2, Save } from 'lucide-react';

const TablaTransacciones = ({ 
  datos, 
  categorias, 
  tipo, 
  onActualizar,
  onGuardar,        // ⭐ Nueva prop
  onEliminar,
  guardandoIds      // ⭐ Nueva prop
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
            <th className="text-center py-3 px-2 text-gray-700 font-semibold">Estado</th>
            <th className="text-center py-3 px-2 text-gray-700 font-semibold">Acción</th>
          </tr>
        </thead>
        <tbody>
          {datos.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 text-center text-gray-500">
                No hay {tipo === 'ingreso' ? 'ingresos' : 'gastos'} registrados
              </td>
            </tr>
          ) : (
            datos.map(item => {
              const estaGuardando = guardandoIds?.has(item.id);
              const esNuevo = item.isNew;

              return (
                <tr 
                  key={item.id} 
                  className={`
                    border-b border-gray-100 hover:bg-gray-50 transition-colors
                    ${esNuevo ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''}
                    ${estaGuardando ? 'opacity-60' : ''}
                  `}
                >
                  {/* Concepto */}
                  <td className="py-3 px-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={item.concepto}
                        onChange={(e) => onActualizar(item.id, 'concepto', e.target.value)}
                        onBlur={() => onGuardar(item.id)}  // ⭐ Guarda al salir del campo
                        className={`
                          w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${colorFocus}
                          ${esNuevo ? 'border-yellow-400' : 'border-gray-300'}
                          ${estaGuardando ? 'bg-gray-100 cursor-wait' : ''}
                        `}
                        placeholder={tipo === 'ingreso' ? 'Ej: Salario mensual' : 'Ej: Compra supermercado'}
                        disabled={estaGuardando}
                      />
                      {estaGuardando && (
                        <div className="absolute right-2 top-2.5">
                          <Save className="text-gray-400 animate-pulse" size={18} />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="py-3 px-2">
                    <select
                      value={item.categoria}
                      onChange={(e) => {
                        onActualizar(item.id, 'categoria', e.target.value);
                        // ⭐ Para selects, guardamos inmediatamente después del cambio
                        setTimeout(() => onGuardar(item.id), 0);
                      }}
                      className={`
                        w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${colorFocus}
                        ${esNuevo ? 'border-yellow-400' : 'border-gray-300'}
                        ${estaGuardando ? 'bg-gray-100 cursor-wait' : ''}
                      `}
                      disabled={estaGuardando}
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>

                  {/* Cantidad */}
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={item.cantidad || ''}
                      onChange={(e) => onActualizar(item.id, 'cantidad', e.target.value)}
                      onBlur={() => onGuardar(item.id)}  // ⭐ Guarda al salir del campo
                      className={`
                        w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${colorFocus}
                        ${esNuevo ? 'border-yellow-400' : 'border-gray-300'}
                        ${estaGuardando ? 'bg-gray-100 cursor-wait' : ''}
                      `}
                      step="0.01"
                      min="0"
                      disabled={estaGuardando}
                    />
                  </td>

                  {/* Fecha */}
                  <td className="py-3 px-2">
                    <input
                      type="date"
                      value={item.fecha}
                      onChange={(e) => {
                        // quiero guardar cuando se termine de seleccionar la fecha y se haga onblur
                        onActualizar(item.id, 'fecha', e.target.value);
                      }}
                      onBlur={() => setTimeout(() => onGuardar(item.id), 0)}  // ⭐ Guarda al salir del campo
                      className={`
                        w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${colorFocus}
                        ${esNuevo ? 'border-yellow-400' : 'border-gray-300'}
                        ${estaGuardando ? 'bg-gray-100 cursor-wait' : ''}
                      `}
                      disabled={estaGuardando}
                    />
                  </td>

                  {/* Estado */}
                  <td className="py-3 px-2 text-center">
                    {estaGuardando ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        <Save size={12} className="animate-pulse" />
                        Guardando
                      </span>
                    ) : esNuevo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                        ⚠️ Sin guardar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        ✓ Guardado
                      </span>
                    )}
                  </td>

                  {/* Acción */}
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => onEliminar(item.id)}
                      disabled={estaGuardando}
                      className={`
                        text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50
                        ${estaGuardando ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaTransacciones;