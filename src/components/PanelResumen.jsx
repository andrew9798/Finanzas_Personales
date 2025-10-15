// Componente: Panel de Resumen
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import ResumenCard from './ResumeCard'; 

const PanelResumen = ({ totalIngresos, totalGastos, balance }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <ResumenCard
      titulo="Total Ingresos"
      cantidad={totalIngresos}
      icono={TrendingUp}
      colorBorde="border-green-500"
      colorTexto="text-green-600"
      colorIcono="text-green-500"
    />
    <ResumenCard
      titulo="Total Gastos"
      cantidad={totalGastos}
      icono={TrendingDown}
      colorBorde="border-red-500"
      colorTexto="text-red-600"
      colorIcono="text-red-500"
    />
    <ResumenCard
      titulo="Balance"
      cantidad={balance}
      icono={PieChart}
      colorBorde={balance >= 0 ? 'border-blue-500' : 'border-orange-500'}
      colorTexto={balance >= 0 ? 'text-blue-600' : 'text-orange-600'}
      colorIcono={balance >= 0 ? 'text-blue-500' : 'text-orange-500'}
    />
  </div>
);

export default PanelResumen;