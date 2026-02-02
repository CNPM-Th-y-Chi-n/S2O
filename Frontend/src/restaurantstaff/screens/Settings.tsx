import React, { useState } from 'react';
import { Save, Clock, DollarSign, Printer } from 'lucide-react';

export function Settings() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Phở Ông Hùng',
    address: '45 Võ Văn Tần, Quận 3, TP.HCM',
    phone: '0123456789',
    email: 'info@phoonghung.com',
  });

  const [hours, setHours] = useState({
    monday: { open: '09:00', close: '22:00', closed: false },
    tuesday: { open: '09:00', close: '22:00', closed: false },
    wednesday: { open: '09:00', close: '22:00', closed: false },
    thursday: { open: '09:00', close: '22:00', closed: false },
    friday: { open: '09:00', close: '23:00', closed: false },
    saturday: { open: '09:00', close: '23:00', closed: false },
    sunday: { open: '10:00', close: '21:00', closed: false },
  });

  const [fees, setFees] = useState({
    taxRate: '8.5',
    serviceFee: '10.0',
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Restaurant Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Restaurant Name</label>
            <input
              type="text"
              value={restaurantInfo.name}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={restaurantInfo.phone}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={restaurantInfo.email}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={restaurantInfo.address}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Opening Hours</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(hours).map(([day, times]) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-28">
                <span className="text-sm text-gray-700 capitalize font-medium">{day}</span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={times.closed}
                  onChange={(e) => setHours({
                    ...hours,
                    [day]: { ...times, closed: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Closed</span>
              </label>
              {!times.closed && (
                <>
                  <input
                    type="time"
                    value={times.open}
                    onChange={(e) => setHours({
                      ...hours,
                      [day]: { ...times, open: e.target.value }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={times.close}
                    onChange={(e) => setHours({
                      ...hours,
                      [day]: { ...times, close: e.target.value }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Taxes & Fees */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Taxes & Fees</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={fees.taxRate}
              onChange={(e) => setFees({ ...fees, taxRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Service Fee (%)</label>
            <input
              type="number"
              step="0.1"
              value={fees.serviceFee}
              onChange={(e) => setFees({ ...fees, serviceFee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Printer / KDS Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Printer className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Printer & KDS Settings</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto-print receipts</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Send orders to Kitchen Display</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Print kitchen tickets</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
