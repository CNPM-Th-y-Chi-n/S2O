interface CategoryTabsProps {
  categories?: string[];
  activeCategory?: string;
  onSelect?: (category: string) => void;
}

export default function CategoryTabs({
  categories = [],
  activeCategory = "",
  onSelect,
}: CategoryTabsProps) {
  if (categories.length === 0) {
    return null; // không render nếu chưa có data
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect?.(category)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
            ${
              activeCategory === category
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
