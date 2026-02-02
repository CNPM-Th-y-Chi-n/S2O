import React, { useState } from "react";
import { mockTables, mockOrders } from "../data/mockData";
import { TableCard } from "../components/TableCard";

export default function Tables() {
  const tables = mockTables;
  const orders = mockOrders;

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const selectedTable = tables.find(t => t.id === selectedTableId);
  const activeOrder = orders.find(o => o.id === selectedTable?.activeOrderId);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Tables</h1>

      {/* Table grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tables.map(table => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => setSelectedTableId(table.id)}
          />
        ))}
      </div>

      {/* Table detail */}
      {selectedTable && (
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-2">
            Table {selectedTable.number}
          </h2>

          <p className="text-sm text-gray-600">
            Status: <span className="capitalize">{selectedTable.status}</span>
          </p>

          {activeOrder && (
            <div className="mt-3">
              <p className="font-medium">Active Order</p>
              <ul className="text-sm text-gray-600 list-disc pl-4">
                {activeOrder.items.map(item => (
                  <li key={item.id}>
                    {item.quantity}x {item.dishName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
