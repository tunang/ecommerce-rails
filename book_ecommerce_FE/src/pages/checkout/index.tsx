import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,

  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  ShoppingBag, 
  ArrowLeft,
  User,
  Phone
} from "lucide-react";
import type { RootState } from "@/store";
import type { Address } from "@/types/address.type";
import { checkoutSchema, type CheckoutFormData } from "@/schemas/checkout.schema";
import { fetchAddressesRequest } from "@/store/slices/addressSlice";
import { clearError } from "@/store/slices/orderSlice";
import { clearCart } from "@/store/slices/cartSlice";

// Mock payment methods - có thể được load từ API
const paymentMethods: any = [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
    enabled: true,
  },
  {
    id: "stripe_payment",
    name: "Stripe",
    description: "Thanh toán qua ví điện tử Stripe",
    enabled: true,
  },
 
];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { addresses, isLoading: addressLoading } = useSelector((state: RootState) => state.address);
  const { isLoading: orderLoading, error: orderError } = useSelector((state: RootState) => state.order);
  
  const [, setSelectedAddress] = useState<Address | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      address_id: 0,
      payment_method: "",
      note: "",
    },
  });

  // Load addresses khi component mount
  useEffect(() => {
    dispatch(fetchAddressesRequest());
  }, [dispatch]);

  // Set default address nếu có
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find(addr => addr.is_default) || addresses[0];
      setSelectedAddress(defaultAddr);
      form.setValue("address_id", defaultAddr.id);
    }
  }, [addresses, form]);

  // Redirect nếu cart trống
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // Tính toán giá
  const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.book.price * item.quantity, 0);
  const shipping = 5; 
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    form.setValue("address_id", address.id);
  };

  const onSubmit = (data: CheckoutFormData) => {
    // dispatch(createOrderRequest(data));
    console.log(data);
  };

  // Handle order creation success
  useEffect(() => {
    if (!orderLoading && !orderError && form.formState.isSubmitSuccessful) {
      // Clear cart và redirect
      dispatch(clearCart());
      navigate("/orders");
    }
  }, [orderLoading, orderError, form.formState.isSubmitSuccessful, dispatch, navigate]);

  // Clear order error sau 5 giây
  useEffect(() => {
    if (orderError) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [orderError, dispatch]);

  if (cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/cart")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại giỏ hàng
        </Button>
        <h1 className="text-2xl font-bold">Thanh toán</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderError && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {orderError}
                  </div>
                )}
                {addressLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <Skeleton key={index} className="h-20 w-full" />
                    ))}
                  </div>
                ) : addresses.length > 0 ? (
                  <FormField
                    control={form.control}
                    name="address_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            value={field.value.toString()}
                            onValueChange={(value: string) => {
                              const addressId = parseInt(value);
                              field.onChange(addressId);
                              const address = addresses.find(addr => addr.id === addressId);
                              if (address) handleAddressSelect(address);
                            }}
                            className="space-y-3"
                          >
                            {addresses.map((address) => (
                              <div key={address.id} className="flex items-start space-x-3 space-y-0">
                                <RadioGroupItem 
                                  value={address.id.toString()} 
                                  id={`address-${address.id}`}
                                  className="mt-1"
                                />
                                <label 
                                  htmlFor={`address-${address.id}`}
                                  className="flex-1 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <span className="font-medium">
                                        {address.first_name} {address.last_name}
                                      </span>
                                      {address.is_default && (
                                        <Badge className="bg-green-100 text-green-800 text-xs">
                                          Mặc định
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      <span>
                                        {address.address_line_1}
                                        {address.address_line_2 && `, ${address.address_line_2}`}
                                      </span>
                                    </div>
                                    <div className="ml-6">
                                      {address.city}, {address.state} {address.postal_code}
                                    </div>
                                    <div className="ml-6">{address.country}</div>
                                    <div className="flex items-center gap-2 ml-6">
                                      <Phone className="h-4 w-4" />
                                      <span>{address.phone}</span>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ giao hàng</p>
                    <Button onClick={() => navigate("/address")}>
                      Thêm địa chỉ
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="space-y-3"
                        >
                          {paymentMethods.filter((method: any) => method.enabled).map((method: any) => (
                            <div key={method.id} className="flex items-start space-x-3 space-y-0">
                              <RadioGroupItem 
                                value={method.id} 
                                id={`payment-${method.id}`}
                                className="mt-1"
                              />
                              <label 
                                htmlFor={`payment-${method.id}`}
                                className="flex-1 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="font-medium mb-1">{method.name}</div>
                                <div className="text-sm text-gray-600">{method.description}</div>
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Order Note */}
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú đơn hàng (tùy chọn)</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Ghi chú cho người bán..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Đơn hàng của bạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <img 
                        src={item.book.image || "/placeholder-book.jpg"} 
                        alt={item.book.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm line-clamp-2">{item.book.title}</div>
                        <div className="text-xs text-gray-500">SL: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatPrice(item.book.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (10%):</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">Thông tin giao hàng</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Dự kiến giao hàng trong 2-3 ngày làm việc
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={orderLoading || addresses.length === 0}
                >
                  {orderLoading ? "Đang xử lý..." : "Đặt hàng"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutPage;