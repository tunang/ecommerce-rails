import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addressSchema, type AddressFormData } from "@/schemas/address.schema";
import type { Address } from "@/types/address.type";
import type { RootState } from "@/store";
import {
  createAddressRequest,
  updateAddressRequest,
  clearError,
} from "@/store/slices/addressSlice";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null;
  mode: "create" | "edit";
}

export function AddressModal({ isOpen, onClose, address, mode }: AddressModalProps) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.address);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone: "",
      is_default: false,
    },
  });

  // Reset form khi modal mở/đóng hoặc mode/address thay đổi
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && address) {
        form.reset({
          first_name: address.first_name || "",
          last_name: address.last_name || "",
          address_line_1: address.address_line_1 || "",
          address_line_2: address.address_line_2 || "",
          city: address.city || "",
          state: address.state || "",
          postal_code: address.postal_code || "",
          country: address.country || "",
          phone: address.phone || "",
          is_default: address.is_default || false,
        });
      } else {
        form.reset({
          first_name: "",
          last_name: "",
          address_line_1: "",
          address_line_2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
          phone: "",
          is_default: false,
        });
      }
    }
  }, [isOpen, mode, address, form]);

  // Clear error sau 5 giây
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Auto close modal và reload khi success
  useEffect(() => {
    if (!isLoading && !error && form.formState.isSubmitSuccessful) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, form.formState.isSubmitSuccessful, onClose]);

  const handleClose = () => {
    form.reset();
    dispatch(clearError());
    onClose();
  };

  const onSubmit = (data: AddressFormData) => {
    if (mode === "create") {
      dispatch(createAddressRequest(data));
    } else if (mode === "edit" && address) {
      dispatch(updateAddressRequest({ id: address.id, address: data }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm địa chỉ mới" : "Chỉnh sửa địa chỉ"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ dòng 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ dòng 2 (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ bổ sung..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thành phố</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập thành phố..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Bang</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tỉnh/bang..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã bưu điện</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã bưu điện..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quốc gia</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập quốc gia..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_default"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Đặt làm địa chỉ mặc định
                  </FormLabel>
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : mode === "create" ? "Thêm" : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}