import { useEffect, useState } from "react";
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
import { bookFormSchema, type BookFormValues } from "@/schemas/book.schema";
import type { Book } from "@/types/book.type";
import type { RootState } from "@/store";
import {
  createBookRequest,
  updateBookRequest,
  clearError,
} from "@/store/slices/bookSlice";
import { fetchAuthorsRequest } from "@/store/slices/authorSlice";
import { fetchCategoriesRequest } from "@/store/slices/categorySlice";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null;
  mode: "create" | "edit";
}

export function BookModal({ isOpen, onClose, book, mode }: BookModalProps) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.book);
  // Uncomment when needed for dropdowns
  // const { authors } = useSelector((state: RootState) => state.author);
  // const { categories } = useSelector((state: RootState) => state.category);

  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [selectedSamplePages, setSelectedSamplePages] = useState<FileList | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [samplePagesPreview, setSamplePagesPreview] = useState<string[]>([]);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      discount_percentage: "0",
      stock_quantity: "",
      cover_image: undefined,
      sample_pages: undefined,
      author_ids: "",
      category_ids: "",
      featured: false,
      active: true,
      sold_count: "0",
      cost_price: "",
    },
  });

  // Fetch authors and categories when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAuthorsRequest({ page: 1, per_page: 100, search: "" }));
      dispatch(fetchCategoriesRequest({ page: 1, per_page: 100, search: "" }));
    }
  }, [isOpen, dispatch]);

  // Reset form khi modal mở/đóng hoặc mode/book thay đổi
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && book) {
        form.reset({
          title: book.title || "",
          description: book.description || "",
          price: book.price || "",
          discount_percentage: book.discount_percentage || "0",
          stock_quantity: book.stock_quantity?.toString() || "",
          cover_image: undefined,
          sample_pages: undefined,
          author_ids: book.authors?.map(a => a.id).join(",") || "",
          category_ids: book.categories?.map(c => c.id).join(",") || "",
          featured: false, // Assume default
          active: true, // Assume default
          sold_count: "0", // Assume default
          cost_price: "", // Assume default
        });
        setCoverImagePreview(book.cover_image_url ? `http://127.0.0.1:3001${book.cover_image_url}` : "");
        setSamplePagesPreview(book.sample_page_urls?.map(url => `http://127.0.0.1:3001${url}`) || []);
      } else {
        form.reset({
          title: "",
          description: "",
          price: "",
          discount_percentage: "0",
          stock_quantity: "",
          cover_image: undefined,
          sample_pages: undefined,
          author_ids: "",
          category_ids: "",
          featured: false,
          active: true,
          sold_count: "0",
          cost_price: "",
        });
        setCoverImagePreview("");
        setSamplePagesPreview([]);
      }
      setSelectedCoverImage(null);
      setSelectedSamplePages(null);
    }
  }, [isOpen, mode, book, form]);

  // Clear error sau 5 giây
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Auto close modal khi success
  useEffect(() => {
    if (!isLoading && !error && form.formState.isSubmitSuccessful) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, form.formState.isSubmitSuccessful, onClose]);

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedCoverImage(file);
      const url = URL.createObjectURL(file);
      setCoverImagePreview(url);
    }
  };

  const handleSamplePagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedSamplePages(files);
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setSamplePagesPreview(urls);
    }
  };

  const onSubmit = (values: BookFormValues) => {
    const transformedValues = {
      title: values.title,
      description: values.description,
      price: parseFloat(values.price),
      discount_percentage: parseFloat(values.discount_percentage || "0"),
      stock_quantity: parseInt(values.stock_quantity),
      cover_image: selectedCoverImage || undefined,
      sample_pages: selectedSamplePages || undefined,
      author_ids: values.author_ids?.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id)) || [],
      category_ids: values.category_ids?.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id)) || [],
      featured: values.featured || false,
      active: values.active ?? true,
      sold_count: parseInt(values.sold_count || "0"),
      cost_price: parseFloat(values.cost_price || "0"),
    };

    if (mode === "create") {
      dispatch(createBookRequest(transformedValues));
    } else if (mode === "edit" && book) {
      dispatch(updateBookRequest({
        id: book.id,
        book: transformedValues,
      }));
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    form.reset();
    setSelectedCoverImage(null);
    setSelectedSamplePages(null);
    setCoverImagePreview("");
    setSamplePagesPreview([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm sách mới" : "Chỉnh sửa sách"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề sách *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề sách" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Nhập giá" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả *</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Nhập mô tả sách"
                      className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng kho *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Số lượng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>% Giảm giá</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá gốc</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Giá gốc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="author_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Tác giả</FormLabel>
                    <FormControl>
                      <Input placeholder="1,2,3 (phân cách bằng dấu phẩy)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="1,2,3 (phân cách bằng dấu phẩy)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cover_image"
              render={() => (
                <FormItem>
                  <FormLabel>Ảnh bìa</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                      />
                      {coverImagePreview && (
                        <div className="flex justify-center">
                          <img
                            src={coverImagePreview}
                            alt="Cover Preview"
                            className="max-w-48 max-h-48 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sample_pages"
              render={() => (
                <FormItem>
                  <FormLabel>Trang mẫu</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSamplePagesChange}
                      />
                      {samplePagesPreview.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {samplePagesPreview.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Sample Page ${index + 1}`}
                              className="w-full h-32 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="space-y-0">Nổi bật</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
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
            </div>

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