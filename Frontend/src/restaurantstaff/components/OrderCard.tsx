import React, { useEffect, useState } from 'react';
import { Order } from '../data/mockData';
import { House, Package, Clock, Flame } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange?: (orderId: string, newStatus: string) => void;
  isKitchenView?: boolean;
}

export function OrderCard({ order, onStatusChange, isKitchenView = false }: OrderCardProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    const updateElapsed = () => {
      const elapsed = Math.floor((Date.now() - order.createdAt.getTime()) / 60000);
      setElapsedMinutes(elapsed);
    };
    
    updateElapsed();
    const interval = setInterval(updateElapsed, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'dine-in' 
      ? 'bg-blue-600 text-white' 
      : 'bg-orange-500 text-white';
  };

  const getPriorityBorder = () => {
    if (elapsedMinutes < 5) return 'border-2 border-gray-200';
    if (elapsedMinutes < 10) return 'border-2 border-yellow-400';
    return 'border-2 border-red-500';
  };

  const canBump = isKitchenView && (order.status === 'new' || order.status === 'preparing');

  return (
    <div className={`bg-white rounded-lg shadow-sm ${getPriorityBorder()} overflow-hidden`}>
      {/* Header - Order Type (PROMINENT) */}
      <div className={`${getTypeColor(order.type)} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          {order.type === 'dine-in' ? (
            <>
              <House className="w-5 h-5" />
              <span className="font-bold">DINE IN</span>
              {order.tableNumber && (
                <span className="ml-2 bg-white/20 px-2 py-1 rounded text-sm">
                  Table {order.tableNumber}
                </span>
              )}
            </>
          ) : (
            <>
              <Package className="w-5 h-5" />
              <span className="font-bold">TAKE AWAY</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {elapsedMinutes >= 10 && <Flame className="w-5 h-5" />}
          <span className="text-sm">#{order.orderNumber}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Time Elapsed */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Clock className="w-4 h-4" />
          <span className={elapsedMinutes >= 10 ? 'text-red-600 font-semibold' : ''}>
            {elapsedMinutes} min ago
          </span>
        </div>

        {/* Order Items */}
        <div className="space-y-2 mb-4">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{item.quantity}x</span>
                  <span className="text-gray-700">{item.dishName}</span>
                </div>
                {item.notes && (
                  <div className="ml-8 mt-1 text-sm bg-yellow-50 text-yellow-800 px-2 py-1 rounded border border-yellow-200">
                    📝 {item.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Status Badge (non-kitchen) */}
        {!isKitchenView && (
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}>
              {order.status.toUpperCase()}
            </span>
          </div>
        )}

        {/* Actions */}
        {canBump && (
          <button
            onClick={() => onStatusChange?.(order.id, order.status === 'new' ? 'preparing' : 'ready')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            {order.status === 'new' ? 'START PREPARING' : 'MARK AS READY'}
          </button>
        )}

        {!isKitchenView && order.status !== 'completed' && (
          <div className="flex gap-2">
            {order.status === 'new' && (
              <button
                onClick={() => onStatusChange?.(order.id, 'preparing')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Start
              </button>
            )}
            {order.status === 'preparing' && (
              <button
                onClick={() => onStatusChange?.(order.id, 'ready')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Ready
              </button>
            )}
            {order.status === 'ready' && (
              <button
                onClick={() => onStatusChange?.(order.id, 'completed')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Complete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
