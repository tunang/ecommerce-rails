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
import { authorFormSchema, type AuthorFormValues } from "@/schemas/author.schema";
import type { Author } from "@/types/author.type";
import type { RootState } from "@/store";
import {
  createAuthorRequest,
  updateAuthorRequest,
  clearError,
} from "@/store/slices/authorSlice";

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  author?: Author | null;
  mode: "create" | "edit";
}

export function AuthorModal({ isOpen, onClose, author, mode }: AuthorModalProps) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.author);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: "",
      biography: "",
      nationality: "",
      birth_date: "",
      photo: undefined,
    },
  });

  // Reset form khi modal mở/đóng hoặc mode/author thay đổi
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && author) {
        form.reset({
          name: author.name || "",
          biography: author.biography || "",
          nationality: author.nationality || "",
          birth_date: author.birth_date ? author.birth_date.split('T')[0] : "",
          photo: undefined,
        });
        setPreviewUrl(author.photo || "");
      } else {
        form.reset({
          name: "",
          biography: "",
          nationality: "",
          birth_date: "",
          photo: undefined,
        });
        setPreviewUrl("");
      }
      setSelectedFile(null);
    }
  }, [isOpen, mode, author, form]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = (values: AuthorFormValues) => {
    const transformedValues = {
      name: values.name,
      biography: values.biography,
      nationality: values.nationality,
      birth_date: values.birth_date,
      photo: selectedFile || undefined,
    };

    if (mode === "create") {
      dispatch(createAuthorRequest(transformedValues));
    } else if (mode === "edit" && author) {
      dispatch(updateAuthorRequest({
        id: author.id,
        author: transformedValues,
      }));
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    form.reset();
    setSelectedFile(null);
    setPreviewUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm tác giả mới" : "Chỉnh sửa tác giả"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tác giả *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên tác giả" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiểu sử *</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Nhập tiểu sử tác giả"
                      className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quốc tịch *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập quốc tịch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={() => (
                <FormItem>
                  <FormLabel>Ảnh tác giả</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {previewUrl && (
                        <div className="flex justify-center">
                          <img
                            src={previewUrl}
                            alt="Preview"
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