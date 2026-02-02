interface MenuItemProps {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dietary?: string[];
  onClick?: () => void;
}

export default function MenuItem(props: MenuItemProps) {
  return (
    <div
      onClick={props.onClick}
      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border"
    >
      <img
        src={props.image}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <div className="flex justify-between">
          <h3>{props.name}</h3>
          <span className="text-blue-600">
            ${props.price.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-600">
          {props.description}
        </p>
      </div>
    </div>
  );
}
