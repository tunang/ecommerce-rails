import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types/order.type";
import type { RootState } from "@/store";
import { fetchOrderByIdRequest, clearError } from "@/store/slices/orderSlice";
import { formatDate } from "@/utils/utils";
import { ORDER_STATUSES } from "@/types/order.type";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: number | null;
}

export function OrderDetailModal({ isOpen, onClose, orderId }: OrderDetailModalProps) {
  const dispatch = useDispatch();
  const { currentOrder, isLoading, error } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (isOpen && orderId) {
      dispatch(fetchOrderByIdRequest(orderId));
    }
  }, [isOpen, orderId, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: number } = {
      'pending': 0,
      'confirmed': 1,
      'shipping': 2,
      'delivered': 3,
      'cancelled': 4,
    };
    const statusValue = statusMap[status] ?? 0;
    return ORDER_STATUSES.find(s => s.value === statusValue) || ORDER_STATUSES[0];
  };

  const formatAddress = (address: Order['shipping_address']) => {
    return `${address.first_name} ${address.last_name}, ${address.address_line_1}${address.address_line_2 ? ', ' + address.address_line_2 : ''}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Đang tải thông tin đơn hàng...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentOrder) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">Không tìm thấy thông tin đơn hàng</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const statusInfo = getStatusInfo(currentOrder.status);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết đơn hàng #{currentOrder.order_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Trạng thái đơn hàng</h3>
              <p className="text-sm text-gray-500">Cập nhật lần cuối: {formatDate(new Date(currentOrder.updated_at))}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Tên khách hàng</p>
                <p className="font-medium">{currentOrder.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentOrder.user.email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Địa chỉ giao hàng</h3>
            <div className="p-4 border rounded-lg">
              <p className="font-medium">{formatAddress(currentOrder.shipping_address)}</p>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tóm tắt đơn hàng</h3>
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">${currentOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thuế:</span>
                <span className="font-medium">${currentOrder.tax_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">${currentOrder.shipping_cost}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">${currentOrder.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Thời gian</h3>
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày tạo:</span>
                <span className="font-medium">{formatDate(new Date(currentOrder.created_at))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cập nhật cuối:</span>
                <span className="font-medium">{formatDate(new Date(currentOrder.updated_at))}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}