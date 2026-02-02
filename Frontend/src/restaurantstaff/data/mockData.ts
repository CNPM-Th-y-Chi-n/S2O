export type OrderType = 'dine-in' | 'take-away';
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';
export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface OrderItem {
  id: string;
  dishId: string;
  dishName: string;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  type: OrderType;
  status: OrderStatus;
  tableNumber?: number;
  items: OrderItem[];
  notes?: string;
  createdAt: Date;
  totalAmount?: number;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  activeOrderId?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  tags?: string[];
}

export interface Staff {
  id: string;
  name: string;
  role: 'manager' | 'staff' | 'kitchen';
  email: string;
  phone: string;
  active: boolean;
}

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 1234,
    type: 'dine-in',
    status: 'new',
    tableNumber: 5,
    items: [
      { id: 'i1', dishId: 'm1', dishName: 'Margherita Pizza', quantity: 2, notes: 'Extra cheese' },
      { id: 'i2', dishId: 'm2', dishName: 'Caesar Salad', quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 3 * 60000), // 3 minutes ago
    totalAmount: 45.50,
  },
  {
    id: 'ord-002',
    orderNumber: 1235,
    type: 'take-away',
    status: 'new',
    items: [
      { id: 'i3', dishId: 'm3', dishName: 'Beef Burger', quantity: 1, notes: 'No onions' },
      { id: 'i4', dishId: 'm4', dishName: 'French Fries', quantity: 2 },
    ],
    createdAt: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    totalAmount: 28.00,
  },
  {
    id: 'ord-003',
    orderNumber: 1236,
    type: 'dine-in',
    status: 'preparing',
    tableNumber: 3,
    items: [
      { id: 'i5', dishId: 'm5', dishName: 'Grilled Salmon', quantity: 1 },
      { id: 'i6', dishId: 'm6', dishName: 'Pasta Carbonara', quantity: 1, notes: 'Mild spice' },
    ],
    createdAt: new Date(Date.now() - 8 * 60000), // 8 minutes ago
    totalAmount: 52.00,
  },
  {
    id: 'ord-004',
    orderNumber: 1237,
    type: 'take-away',
    status: 'preparing',
    items: [
      { id: 'i7', dishId: 'm7', dishName: 'Chicken Tacos', quantity: 3 },
    ],
    createdAt: new Date(Date.now() - 6 * 60000), // 6 minutes ago
    totalAmount: 21.00,
  },
  {
    id: 'ord-005',
    orderNumber: 1238,
    type: 'dine-in',
    status: 'ready',
    tableNumber: 7,
    items: [
      { id: 'i8', dishId: 'm8', dishName: 'Lobster Thermidor', quantity: 1 },
      { id: 'i9', dishId: 'm9', dishName: 'Garlic Bread', quantity: 2 },
    ],
    createdAt: new Date(Date.now() - 12 * 60000), // 12 minutes ago
    totalAmount: 85.00,
  },
  {
    id: 'ord-006',
    orderNumber: 1239,
    type: 'dine-in',
    status: 'completed',
    tableNumber: 2,
    items: [
      { id: 'i10', dishId: 'm10', dishName: 'Club Sandwich', quantity: 2 },
    ],
    createdAt: new Date(Date.now() - 25 * 60000), // 25 minutes ago
    totalAmount: 32.00,
  },
];

// Mock Tables Data
export const mockTables: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: 'available' },
  { id: 't2', number: 2, capacity: 4, status: 'available' },
  { id: 't3', number: 3, capacity: 4, status: 'occupied', activeOrderId: 'ord-003' },
  { id: 't4', number: 4, capacity: 6, status: 'available' },
  { id: 't5', number: 5, capacity: 4, status: 'occupied', activeOrderId: 'ord-001' },
  { id: 't6', number: 6, capacity: 2, status: 'reserved' },
  { id: 't7', number: 7, capacity: 4, status: 'occupied', activeOrderId: 'ord-005' },
  { id: 't8', number: 8, capacity: 6, status: 'available' },
  { id: 't9', number: 9, capacity: 8, status: 'available' },
  { id: 't10', number: 10, capacity: 4, status: 'available' },
];

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: 'm1',
    name: 'Margherita Pizza',
    category: 'Main Course',
    price: 18.50,
    available: true,
    tags: ['vegetarian'],
  },
  {
    id: 'm2',
    name: 'Caesar Salad',
    category: 'Appetizer',
    price: 12.00,
    available: true,
  },
  {
    id: 'm3',
    name: 'Beef Burger',
    category: 'Main Course',
    price: 16.00,
    available: true,
  },
  {
    id: 'm4',
    name: 'French Fries',
    category: 'Side',
    price: 6.00,
    available: true,
    tags: ['vegan'],
  },
  {
    id: 'm5',
    name: 'Grilled Salmon',
    category: 'Main Course',
    price: 28.00,
    available: true,
  },
  {
    id: 'm6',
    name: 'Pasta Carbonara',
    category: 'Main Course',
    price: 24.00,
    available: true,
  },
  {
    id: 'm7',
    name: 'Chicken Tacos',
    category: 'Main Course',
    price: 7.00,
    available: true,
    tags: ['spicy'],
  },
  {
    id: 'm8',
    name: 'Lobster Thermidor',
    category: 'Main Course',
    price: 65.00,
    available: true,
  },
  {
    id: 'm9',
    name: 'Garlic Bread',
    category: 'Side',
    price: 5.00,
    available: true,
  },
  {
    id: 'm10',
    name: 'Club Sandwich',
    category: 'Main Course',
    price: 16.00,
    available: true,
  },
  {
    id: 'm11',
    name: 'Tiramisu',
    category: 'Dessert',
    price: 9.00,
    available: true,
  },
  {
    id: 'm12',
    name: 'Chocolate Lava Cake',
    category: 'Dessert',
    price: 10.00,
    available: false,
  },
];

// Mock Staff Data
export const mockStaff: Staff[] = [
  {
    id: 's1',
    name: 'John Manager',
    role: 'manager',
    email: 'john@restaurant.com',
    phone: '+1234567890',
    active: true,
  },
  {
    id: 's2',
    name: 'Sarah Williams',
    role: 'staff',
    email: 'sarah@restaurant.com',
    phone: '+1234567891',
    active: true,
  },
  {
    id: 's3',
    name: 'Mike Johnson',
    role: 'staff',
    email: 'mike@restaurant.com',
    phone: '+1234567892',
    active: true,
  },
  {
    id: 's4',
    name: 'Chef Marco',
    role: 'kitchen',
    email: 'marco@restaurant.com',
    phone: '+1234567893',
    active: true,
  },
  {
    id: 's5',
    name: 'Chef Lisa',
    role: 'kitchen',
    email: 'lisa@restaurant.com',
    phone: '+1234567894',
    active: true,
  },
];

// Dashboard Analytics Data
export const getDashboardStats = (orders: Order[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(o => o.createdAt >= today);
  const activeOrders = orders.filter(o => ['new', 'preparing'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'completed');

  return {
    todayOrders: todayOrders.length,
    activeOrders: activeOrders.length,
    completedOrders: completedOrders.length,
    totalRevenue: completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  };
};
