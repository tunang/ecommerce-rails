import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category.type";
import { formatDate } from "@/utils/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { DeleteConfirmPopover } from "./DeleteConfirmPopover";

export const createColumns = (onEdit: (category: Category) => void): ColumnDef<Category>[] => [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
    minSize: 50,
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return <span className="font-medium text-sm">{id}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Tên danh mục",
    size: 150,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <span className="font-medium text-sm">{name}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    size: 300,
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[280px]">
          <span className="text-sm line-clamp-2">{description || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "parent_id",
    header: "Danh mục cha",
    size: 100,
    cell: ({ row }) => {
      const parentId = row.getValue("parent_id") as number;
      return <span className="text-sm">{parentId || "N/A"}</span>;
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    size: 150,
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return <span className="text-sm">{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Ngày cập nhật",
    size: 150,
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
      const category = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <DeleteConfirmPopover category={category}>
            <Button variant="destructive" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          </DeleteConfirmPopover>
        </div>
      );
    },
  }
];
