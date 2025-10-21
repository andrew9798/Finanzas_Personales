// resumen de categorias de ingresos y gastos

const ResumenCategorias = ({ datos, categorias, total, tipo }) => {
  const datosPorCategoria = categorias.map(cat => ({
    categoria: cat,
    total: datos.filter(item => item.categoria === cat).reduce((sum, item) => sum + item.cantidad, 0)
  })).filter(c => c.total > 0);

  if (datosPorCategoria.length === 0){
    return null;
  }
  // Definir colores según el tipo
  const colorFondo = tipo === 'ingreso' ? 'bg-green-50' : 'bg-red-50';
  const colorBorde = tipo === 'ingreso' ? 'border-green-200' : 'border-red-200';
  const colorTexto = tipo === 'ingreso' ? 'text-green-700' : 'text-red-700';

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        {tipo === 'ingreso' ? 'Ingresos' : 'Gastos'} por Categoría
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {datosPorCategoria.map(cat => (
          <div key={cat.categoria} className={`${colorFondo} rounded-lg p-3 border ${colorBorde}`}>
            <p className="text-sm text-gray-600">{cat.categoria}</p>
            <p className={`text-xl font-bold ${colorTexto}`}>€{cat.total.toFixed(2)}</p>
            {/* Aqui es donde creamos el porcentaje en la tarjeta */}
            {tipo === 'gasto' && total > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {((cat.total / total) * 100).toFixed(1)}%
              </p>
            )}
            {tipo === 'ingreso' && total > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {((cat.total / total) * 100).toFixed(1)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumenCategorias;