export default function Cart({ items, onClose }: any) {
  const total = items.reduce((s: number, i: any) => s + i.price, 0);

  return (
    <div className="fixed right-4 bottom-4 bg-white w-72 rounded-xl shadow-lg p-4 z-40">
      <h3 className="font-semibold mb-2">Your Cart</h3>

      {items.length === 0 && (
        <p className="text-gray-500 text-sm">Cart is empty</p>
      )}

      {items.map((i: any, idx: number) => (
        <div key={idx} className="flex justify-between text-sm mb-1">
          <span>{i.name}</span>
          <span>${i.price.toFixed(2)}</span>
        </div>
      ))}

      <hr className="my-2" />

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button className="w-full mt-3 bg-red-500 text-white py-2 rounded">
        Place Order
      </button>
    </div>
  );
}
