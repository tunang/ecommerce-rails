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
    size: 60,
    enableResizing: false,
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return <span className="font-medium text-sm">{id}</span>;
    },
  },
  {
    accessorKey: "photo",
    header: "Ảnh",
    size: 80,
    enableResizing: false,
    cell: ({ row }) => {
      const photo = row.getValue("photo") as string;
      return (
        <div className="flex items-center justify-start">
          {photo ? (
            <img
              src={`http://127.0.0.1:3001/${photo}`}
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
    size: 180,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <span className="font-medium text-sm">{name}</span>;
    },
  },
  {
    accessorKey: "nationality",
    header: "Quốc tịch",
    size: 140,
    cell: ({ row }) => {
      const nationality = row.getValue("nationality") as string;
      return <span className="text-sm">{nationality || "N/A"}</span>;
    },
  },
  {
    accessorKey: "birth_date",
    header: "Ngày sinh",
    size: 120,
    cell: ({ row }) => {
      const date = row.getValue("birth_date") as string;
      return <span className="text-sm">{date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"}</span>;
    },
  },
  {
    accessorKey: "biography",
    header: "Tiểu sử",
    size: 250,
    cell: ({ row }) => {
      const biography = row.getValue("biography") as string;
      return (
        <div className="max-w-[230px]">
          <span className="line-clamp-2 text-sm">{biography}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    size: 140,
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return <span className="text-sm">{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Ngày cập nhật",
    size: 140,
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as Date;
      return <span className="text-sm">{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full">Thao tác</div>,
    size: 120,
    enableResizing: false,
    cell: ({ row }) => {
      const author = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="icon" onClick={() => onEdit(author)}>
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
  },
];
