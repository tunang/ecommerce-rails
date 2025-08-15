export type Order = {
  id: number;
  order_number: string;
  status: string;
  subtotal: string;
  tax_amount: string;
  shipping_cost: string;
  total_amount: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  shipping_address: {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

export type OrderUpdateData = {
  status: number;
};

export type OrderStatus = {
  value: number;
  label: string;
  color: string;
};

export const ORDER_STATUSES = [
  { value: 0, key: "pending", label: "Chờ xử lý", color: "text-yellow-600 bg-yellow-50" },
  { value: 1, key: "confirmed", label: "Đã xác nhận", color: "text-blue-600 bg-blue-50" },
  { value: 2, key: "processing", label: "Đang xử lý", color: "text-orange-600 bg-orange-50" },
  { value: 3, key: "shipped", label: "Đang giao hàng", color: "text-purple-600 bg-purple-50" },
  { value: 4, key: "delivered", label: "Đã giao hàng", color: "text-green-600 bg-green-50" },
  { value: 5, key: "cancelled", label: "Đã hủy", color: "text-red-600 bg-red-50" },
  { value: 6, key: "refunded", label: "Đã hoàn tiền", color: "text-gray-600 bg-gray-100" }
];
