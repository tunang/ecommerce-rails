import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import type { Author } from "@/types/author.type";
import type { RootState } from "@/store";
import { deleteAuthorRequest } from "@/store/slices/authorSlice";

interface DeleteConfirmPopoverProps {
  author: Author;
  children?: React.ReactNode;
}

export function DeleteConfirmPopover({ author, children }: DeleteConfirmPopoverProps) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.author);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    dispatch(deleteAuthorRequest({ authorId: author.id }));
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
              Bạn có chắc chắn muốn xóa tác giả "{author.name}"? Hành động này không thể hoàn tác.
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