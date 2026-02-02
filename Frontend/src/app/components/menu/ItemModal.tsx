export default function ItemModal({ item, onClose, onAdd }: any) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-md p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        <img
          src={item.image}
          className="w-full h-56 object-cover rounded"
        />

        <h2 className="mt-4 text-xl font-semibold">{item.name}</h2>
        <p className="text-gray-600">{item.description}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-red-500">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAdd(item)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
