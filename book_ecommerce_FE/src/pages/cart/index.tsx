import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useEffect } from "react";
import { fetchCartItemsRequest, removeFromCartRequest, updateCartItemRequest } from "@/store/slices/cartSlice";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, error, totalPrice, totalItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCartItemsRequest());
  }, [dispatch]);






  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="flex items-center justify-center min-h-[400px]">
  //         <div className="flex items-center space-x-2">
  //           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  //           <span className="text-muted-foreground">Đang tải giỏ hàng...</span>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => dispatch(fetchCartItemsRequest())}>
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Giỏ hàng trống</h3>
              <p className="text-muted-foreground mb-4">
                Bạn chưa có sản phẩm nào trong giỏ hàng
              </p>
              <Button onClick={() => navigate("/")}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {totalItems} sản phẩm
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.book.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Book Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={"http://localhost:3001" + item.book.cover_image_url || "/placeholder-book.jpg"}
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-book.jpg";
                        }}
                      />
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {item.book.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(removeFromCartRequest({book_id: item.book.id}))}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {item.book.description}
                    </p>

                    {/* Authors and Categories */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.book.authors?.map((author) => (
                        <Badge key={author.id} variant="outline" className="text-xs">
                          {author.name}
                        </Badge>
                      ))}
                      {item.book.categories?.map((category) => (
                        <Badge key={category.id} variant="secondary" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice((item.book.price))}
                        </span>
                        {item.book.discount_percentage && (item.book.discount_percentage) > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            -{item.book.discount_percentage}%
                          </Badge>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => dispatch(updateCartItemRequest({book_id: item.book.id, quantity: -1}))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => dispatch(updateCartItemRequest({book_id: item.book.id, quantity: 1}))}
                          disabled={item.quantity >= item.book.stock_quantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right mt-2">
                      <span className="text-sm text-muted-foreground">Tổng: </span>
                      <span className="font-semibold">
                        {formatPrice((item.book.price) * item.quantity)}
                      </span>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.book.stock_quantity && (
                      <p className="text-xs text-amber-600 mt-1">
                        Chỉ còn {item.book.stock_quantity} sản phẩm trong kho
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Tóm tắt đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Tạm tính ({items.length} sản phẩm)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
                <div className="flex justify-between">
                  <span>Thuế</span>
                  <span className="text-green-600">{formatPrice(totalPrice * 0.1)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600">{formatPrice(5)}</span>
                </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatPrice(totalPrice + totalPrice * 0.1 + 5)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/checkout")}
                disabled={items.length === 0}
              >
                Tiến hành thanh toán
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                Tiếp tục mua sắm
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;