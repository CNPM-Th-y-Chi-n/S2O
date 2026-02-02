import { mockOrders } from "../data/mockData";
import { OrderCard } from "../components/OrderCard";

export function Kitchen() {
  return (
    <div>
      <h2 className="mb-4 font-bold">Kitchen Orders</h2>

      {mockOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
