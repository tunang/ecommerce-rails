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
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "parent_id",
    header: "Parent ID",
  },
  {
    accessorKey: "active",
    header: "Status",
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
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return <span className="font-medium">{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as Date;
      return <span className="font-medium">{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full">Actions</div>,

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