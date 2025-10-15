// Componente: Header de la Aplicación
import { DollarSign } from 'lucide-react';

const Header = ( ) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
    <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
      <DollarSign className="text-indigo-600" size={40} />
      Gestor de Finanzas Personales
    </h1>
    <p className="text-gray-600">Controla tus ingresos, gastos y ahorra mejor</p>
  </div>
);

export default Header;