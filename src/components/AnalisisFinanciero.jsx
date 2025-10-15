// Componente: Análisis Financiero


const AnalisisFinanciero = ({ totalIngresos, totalGastos, balance }) => {
  const tasaAhorro = totalIngresos > 0 ? ((balance / totalIngresos) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Análisis Financiero</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-medium">Tasa de ahorro</span>
          <span className="text-xl font-bold text-blue-600">{tasaAhorro}%</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-700 font-medium">Capacidad de ahorro mensual</span>
          <span className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            €{balance.toFixed(2)}
          </span>
        </div>
        {balance < 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 font-medium">⚠️ Advertencia: Tus gastos superan tus ingresos</p>
            <p className="text-orange-700 text-sm mt-1">Considera revisar tus gastos o aumentar tus ingresos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalisisFinanciero;