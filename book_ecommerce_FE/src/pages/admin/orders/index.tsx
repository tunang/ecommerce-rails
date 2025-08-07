import { useEffect, useState } from "react";
import { createColumns } from "./columns";
import type { Order } from "@/types/order.type";
import { DataTable } from "./DataTable";
import { OrderDetailModal } from "./OrderDetailModal";
import { fetchOrdersRequest } from "@/store/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";

function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, pageSize, currentPage, isLoading } = useSelector((state: RootState) => state.order);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchOrdersRequest({ page: currentPage, per_page: pageSize, search: "" }));
  }, [currentPage, pageSize, dispatch]);

  const handleViewDetail = (order: Order) => {
    setSelectedOrderId(order.id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrderId(null);
  };

  const columns = createColumns(handleViewDetail);

  if (isLoading && orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-sm text-muted-foreground">
            Xem chi tiết và cập nhật trạng thái đơn hàng
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Tổng: {orders.length} đơn hàng
          </span>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={orders} />
      </div>
      
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        orderId={selectedOrderId}
      />
    </div>
  );
}

export default OrdersPage;