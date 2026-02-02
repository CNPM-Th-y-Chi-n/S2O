import React, { useState } from "react";
import { mockMenuItems } from "../data/mockData";

export default function Menu() {
  const [search, setSearch] = useState("");

  const filteredMenu = mockMenuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Menu</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 border rounded-lg"
      />

      {/* Menu list */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2 text-sm">Name</th>
              <th className="text-left px-4 py-2 text-sm">Category</th>
              <th className="text-left px-4 py-2 text-sm">Price</th>
              <th className="text-left px-4 py-2 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenu.map(item => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2 text-gray-600">{item.category}</td>
                <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMenu.length === 0 && (
          <p className="p-4 text-gray-500 text-sm">
            No menu items found
          </p>
        )}
      </div>
    </div>
  );
}
