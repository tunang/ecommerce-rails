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
import { categoryFormSchema, type CategoryFormValues } from "@/schemas/category.schema";
import type { Category } from "@/types/category.type";
import type { RootState } from "@/store";
import {
  createCategoryRequest,
  updateCategoryRequest,
  clearError,
} from "@/store/slices/categorySlice";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  mode: "create" | "edit";
}

export function CategoryModal({ isOpen, onClose, category, mode }: CategoryModalProps) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.category);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      parent_id: undefined,
      active: true,
    },
  });

  // Reset form khi modal mở/đóng hoặc mode/category thay đổi
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && category) {
        form.reset({
          name: category.name || "",
          description: category.description || "",
          parent_id: category.parent_id ? category.parent_id : undefined,
          active: category.active ?? true,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          parent_id: undefined,
          active: true,
        });
      }
    }
  }, [isOpen, mode, category, form]);

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
  }, [isLoading, error, form.formState.isSubmitSuccessful, onClose, dispatch]);

  const onSubmit = (values: CategoryFormValues) => {
    const transformedValues = {
      name: values.name,
      description: values.description || undefined,
      parent_id: values.parent_id || undefined,
      active: values.active,
    };

    if (mode === "create") {
      dispatch(createCategoryRequest(transformedValues));
    } else if (mode === "edit" && category) {
      dispatch(updateCategoryRequest({
        id: category.id,
        category: transformedValues,
      }));
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên danh mục" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mô tả danh mục" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID danh mục cha</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Nhập ID danh mục cha (để trống nếu là danh mục gốc)"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <FormLabel className="space-y-0">Kích hoạt</FormLabel>
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isLoading || form.formState.isSubmitting}
                className="w-full sm:w-auto"
              >
                {isLoading || form.formState.isSubmitting 
                  ? "Đang xử lý..." 
                  : mode === "create" 
                    ? "Thêm" 
                    : "Cập nhật"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}