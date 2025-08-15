import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order.type";
import { formatDate } from "@/utils/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import { OrderStatusUpdatePopover } from "./OrderStatusUpdatePopover";
import { ORDER_STATUSES } from "@/types/order.type";

export const createColumns = (
  onViewDetail: (order: Order) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "ID",
    size: 20,
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return <span className="font-medium text-sm">{id}</span>;
    },
  },
  {
    accessorKey: "order_number",
    header: "Mã đơn hàng",
    size: 140,
    cell: ({ row }) => {
      const orderNumber = row.getValue("order_number") as string;
      return (
        <div className="truncate max-w-[120px]">
          <span className="font-medium text-sm">{orderNumber}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Khách hàng",
    size: 150,
    cell: ({ row }) => {
      const user = row.getValue("user") as Order['user'];
      return (
        <div className="truncate max-w-[160px]">
          <div className="font-medium text-sm">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    size: 120,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusInfo = (status: string) => {
        const statusMap: { [key: string]: number } = {
          pending: 0,
          confirmed: 1,
          processing: 2,
          shipped: 3,
          delivered: 4,
          cancelled: 5,
          refunded: 6,
        };
        const statusValue = statusMap[status] ?? 0;
        return ORDER_STATUSES.find(s => s.value === statusValue) || ORDER_STATUSES[0];
      };
      const statusInfo = getStatusInfo(status);
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Tổng tiền",
    size: 110,
    cell: ({ row }) => {
      const totalAmount = row.getValue("total_amount") as string;
      return <span className="font-semibold text-green-600">${totalAmount}</span>;
    },
  },
  {
    accessorKey: "subtotal",
    header: "Tạm tính",
    size: 100,
    cell: ({ row }) => {
      const subtotal = row.getValue("subtotal") as string;
      return <span className="font-medium">${subtotal}</span>;
    },
  },
  {
    accessorKey: "shipping_cost",
    header: "Phí ship",
    size: 90,
    cell: ({ row }) => {
      const shippingCost = row.getValue("shipping_cost") as string;
      return <span className="text-sm">${shippingCost}</span>;
    },
  },
  {
    accessorKey: "tax_amount",
    header: "Thuế",
    size: 90,
    cell: ({ row }) => {
      const taxAmount = row.getValue("tax_amount") as string;
      return <span className="text-sm">${taxAmount}</span>;
    },
  },
  {
    accessorKey: "shipping_address",
    header: "Địa chỉ giao hàng",
    size: 220,
    cell: ({ row }) => {
      const address = row.getValue("shipping_address") as Order['shipping_address'];
      return (
        <div className="text-sm">
          <div className="font-medium">
            {address.first_name} {address.last_name}
          </div>
          <div className="text-xs text-gray-500">
            {address.address_line_1}, {address.city}
          </div>
          <div className="text-xs text-gray-500">
            {address.state}, {address.country}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    size: 125,
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return (
        <div className="text-sm">
          <div className="font-medium">{formatDate(new Date(date))}</div>
          <div className="text-gray-500">
            {new Date(date).toLocaleTimeString('vi-VN', {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Cập nhật cuối",
    size: 125,
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as string;
      return (
        <div className="text-sm">
          <div className="font-medium">{formatDate(new Date(date))}</div>
          <div className="text-gray-500">
            {new Date(date).toLocaleTimeString('vi-VN', {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full">Thao tác</div>,
    size: 120,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onViewDetail(order)}
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <OrderStatusUpdatePopover order={order}>
            <Button variant="outline" size="icon" title="Cập nhật trạng thái">
              <Edit className="h-4 w-4" />
            </Button>
          </OrderStatusUpdatePopover>
        </div>
      );
    },
  },
];
