import { useEffect, useState } from "react";
import { createColumns } from "./columns";
import type { Order } from "@/types/order.type";
import { DataTable } from "@/components/ui/table/DataTable";
import { OrderDetailModal } from "./OrderDetailModal";
import { fetchOrdersRequest } from "@/store/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { subscribeAdminOrdersChannel } from "@/services/admin/orders/cables";

function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, pageSize, currentPage, isLoading, pagination } = useSelector((state: RootState) => state.order);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchOrdersRequest({ page: currentPage, per_page: pageSize, search: "" }));
  }, [currentPage, pageSize, dispatch]);



  useEffect(() => {
    const channel = subscribeAdminOrdersChannel(dispatch);
    return () => {
      channel.unsubscribe();
    };
  }, [currentPage, pageSize, dispatch]);

  const handleViewDetail = (order: Order) => {
    setSelectedOrderId(order.id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrderId(null);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchOrdersRequest({ page, per_page: pageSize, search: "" }));
  };

  const columns = createColumns(handleViewDetail);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          {/* <p className="text-sm text-muted-foreground">
            Xem chi tiết và cập nhật trạng thái đơn hàng
          </p> */}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Tổng: {pagination?.total_count || orders.length} đơn hàng
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={orders} 
          loading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
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