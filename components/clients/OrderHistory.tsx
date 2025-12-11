'use client';

interface OrderHistoryProps {
  clientId: string;
}

// Mock data - TODO: Replace with real data from database
const MOCK_ORDERS = [
  {
    id: '1',
    title: 'Robe Bazin',
    date: '12 Nov',
    price: '25.000 F',
    status: 'Livré',
    image: null,
  },
  {
    id: '2',
    title: 'Pantalon Classique',
    date: '5 Nov',
    price: '18.000 F',
    status: 'En cours',
    image: null,
  },
  {
    id: '3',
    title: 'Chemise sur mesure',
    date: '28 Oct',
    price: '15.000 F',
    status: 'Livré',
    image: null,
  },
];

export default function OrderHistory({ clientId }: OrderHistoryProps) {
  const orders = MOCK_ORDERS; // TODO: Fetch from database

  return (
    <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10 h-full flex flex-col">
      {/* Titre */}
      <h3 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-4">
        Historique ({orders.length})
      </h3>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {/* Image miniature */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {order.image ? (
                <img src={order.image} alt={order.title} className="w-full h-full object-cover rounded-full" />
              ) : (
                '📦'
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <h4 className="font-title text-xs font-bold text-[#11142D] dark:text-gray-100 truncate">
                {order.title}
              </h4>
              <p className="text-[10px] text-[#808191] dark:text-gray-400">
                {order.date} • {order.price}
              </p>
            </div>

            {/* Badge Statut */}
            <span
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex-shrink-0 ${
                order.status === 'Livré'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
              }`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

