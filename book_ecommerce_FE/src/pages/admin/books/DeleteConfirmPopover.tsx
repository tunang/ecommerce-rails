import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import type { Book } from "@/types/book.type";
import type { RootState } from "@/store";
import { deleteBookRequest } from "@/store/slices/bookSlice";

interface DeleteConfirmPopoverProps {
  book: Book;
  children?: React.ReactNode;
}

export function DeleteConfirmPopover({ book, children }: DeleteConfirmPopoverProps) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.book);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    dispatch(deleteBookRequest({ bookId: book.id }));
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="destructive" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
       
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Xác nhận xóa</h4>
            <p className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa sách "{book.title}"? Hành động này không thể hoàn tác.
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}