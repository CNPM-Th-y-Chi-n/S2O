import React from 'react';
import { Table } from '../data/mockData';
import { Users, CheckCircle, Circle, Clock } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onClick?: () => void;
}

export function TableCard({ table, onClick }: TableCardProps) {
  const getStatusColor = () => {
    switch (table.status) {
      case 'available': return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'occupied': return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'reserved': return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (table.status) {
      case 'available': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'occupied': return <Circle className="w-5 h-5 text-red-600 fill-red-600" />;
      case 'reserved': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${getStatusColor()} border-2 rounded-xl p-6 transition-all hover:shadow-md w-full`}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Table Number */}
        <div className="text-3xl font-bold text-gray-900">
          {table.number}
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{table.capacity} seats</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize text-gray-700">
            {table.status}
          </span>
        </div>
      </div>
    </button>
  );
}
