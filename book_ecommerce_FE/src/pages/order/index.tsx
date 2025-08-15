import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  MapPin, 
  User, 
  Phone, 
  Calendar,
  DollarSign,
  Truck,
  FileText
} from "lucide-react";
import type { RootState } from "@/store";
import { fetchUserOrdersRequest } from "@/store/slices/orderSlice";
import type { Order } from "@/types/order.type";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(fetchUserOrdersRequest({}));
  }, [dispatch]);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numPrice);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xử lý';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đã gửi hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
        <div className="text-center py-8">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      
      <div className="space-y-6">
        {orders.map((order: Order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-lg">
                      Đơn hàng #{order.order_number}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Tổng tiền</div>
                    <div className="text-lg font-bold text-primary">
                      {formatPrice(order.total_amount)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Thông tin giao hàng */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ giao hàng
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {order.shipping_address.first_name} {order.shipping_address.last_name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{order.shipping_address.phone}</span>
                      </div>
                      <div className="ml-6">
                        {order.shipping_address.address_line_1}
                        {order.shipping_address.address_line_2 && 
                          `, ${order.shipping_address.address_line_2}`
                        }
                      </div>
                      <div className="ml-6">
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                      </div>
                      <div className="ml-6">{order.shipping_address.country}</div>
                    </div>
                  </div>
                </div>

                {/* Chi tiết giá */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Chi tiết thanh toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phí vận chuyển:</span>
                        <span>{formatPrice(order.shipping_cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thuế:</span>
                        <span>{formatPrice(order.tax_amount)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-base">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin bổ sung */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>Dự kiến giao hàng: 2-3 ngày</span>
                  </div>
                  {order.status === 'delivered' && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Đã giao thành công</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;