// Componente: Tarjeta de Resumen

const ResumenCard = ({ titulo, cantidad, icono: Icono, colorBorde, colorTexto, colorIcono }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${colorBorde}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{titulo}</p>
        <p className={`text-3xl font-bold ${colorTexto}`}>€{cantidad.toFixed(2)}</p>
      </div>
      <Icono className={colorIcono} size={40} />
    </div>
  </div>
);


export default ResumenCard;