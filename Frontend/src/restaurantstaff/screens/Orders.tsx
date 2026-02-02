import React from "react";
import { mockOrders } from "../data/mockData";
import { OrderCard } from "../components/OrderCard";

export default function Orders() {
  const orders = mockOrders;

  const activeOrders = orders.filter(
    (o) => o.status !== "completed"
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>

      {activeOrders.length === 0 ? (
        <p className="text-gray-500">No active orders</p>
      ) : (
        activeOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))
      )}
    </div>
  );
}
