import { Button } from "@/components/ui/button";
import type { Author } from "@/types/author.type";
import { formatDate } from "@/utils/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { DeleteConfirmPopover } from "./DeleteConfirmPopover";

export const createColumns = (onEdit: (author: Author) => void): ColumnDef<Author>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableResizing: false,
    size: 20,
  },
  {
    accessorKey: "photo",
    header: "Ảnh",
    cell: ({ row }) => {
      const photo = row.getValue("photo") as string;
      return (
        <div className="flex items-center">
          {photo ? (
            <img
              src={"http://127.0.0.1:3001/" + photo}
              alt={row.getValue("name") as string}
              className="w-12 h-12 object-cover rounded-full border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xs">N/A</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên tác giả",
  },
  {
    accessorKey: "nationality",
    header: "Quốc tịch",
  },
  {
    accessorKey: "birth_date",
    header: "Ngày sinh",
    cell: ({ row }) => {
      const date = row.getValue("birth_date") as string;
      return <span className="font-medium">{date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}</span>;
    },
  },
  {
    accessorKey: "biography",
    header: "Tiểu sử",
    cell: ({ row }) => {
      const biography = row.getValue("biography") as string;
      return (
        <div className="max-w-[200px]">
          <span className="line-clamp-2 text-sm">{biography}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return <span className="font-medium">{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Ngày cập nhật",
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as Date;
      return <span className="font-medium">{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full">Hành động</div>,

    cell: ({ row }) => {
      const author = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(author)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteConfirmPopover author={author}>
            <Button variant="destructive" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          </DeleteConfirmPopover>
        </div>
      );
    },
  }
];