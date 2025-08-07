import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderUpdateSchema, type OrderUpdateFormValues } from "@/schemas/order.schema";
import type { Order } from "@/types/order.type";
import { ORDER_STATUSES } from "@/types/order.type";
import type { RootState } from "@/store";
import { updateOrderStatusRequest } from "@/store/slices/orderSlice";

interface OrderStatusUpdatePopoverProps {
  order: Order;
  children?: React.ReactNode;
}

export function OrderStatusUpdatePopover({ order, children }: OrderStatusUpdatePopoverProps) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.order);
  const [isOpen, setIsOpen] = useState(false);

  const getStatusValue = (status: string): number => {
    const statusMap: { [key: string]: number } = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4,
      'cancelled': 5,
      'refunded': 6,
    };
    return statusMap[status] ?? 0;
  };

  const form = useForm<OrderUpdateFormValues>({
    resolver: zodResolver(orderUpdateSchema),
    defaultValues: {
      status: getStatusValue(order.status),
    },
  });

  const onSubmit = (values: OrderUpdateFormValues) => {
    dispatch(updateOrderStatusRequest({
      id: order.id,
      orderData: {
        status: values.status,
      },
    }));
    setIsOpen(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
       
      <PopoverContent className="w-80">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Cập nhật trạng thái</h4>
              <p className="text-sm text-muted-foreground">
                Đơn hàng #{order.order_number}
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái mới</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value: string) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value.toString()}>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                              {status.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                size="sm" 
                disabled={isLoading}
              >
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}