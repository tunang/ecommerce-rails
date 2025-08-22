import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book.type";
import { formatDate } from "@/utils/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { DeleteConfirmPopover } from "./DeleteConfirmPopover";

export const createColumns = (onEdit: (book: Book) => void): ColumnDef<Book>[] => [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "cover_image_url",
    header: "Ảnh bìa",
    size: 90,
    cell: ({ row }) => {
      const coverImageUrl = row.getValue("cover_image_url") as string;
      return (
        <div className="flex justify-start">
          {coverImageUrl ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${coverImageUrl}`}
              alt={row.getValue("title") as string}
              className="w-12 h-12 object-cover rounded border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 text-xs">N/A</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    size: 200,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-[200px] truncate">
          <span className="font-medium">{title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Giá",
    size: 80,
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      return <span className="font-medium">${price}</span>;
    },
  },
  {
    accessorKey: "stock_quantity",
    header: "Kho",
    size: 80,
    cell: ({ row }) => {
      const stock = row.getValue("stock_quantity") as number;
      return (
        <span className={`font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock}
        </span>
      );
    },
  },
  {
    accessorKey: "discount_percentage",
    header: "Giảm giá",
    size: 90,
    cell: ({ row }) => {
      const discount = row.getValue("discount_percentage") as string;
      return <span className="font-medium">{discount}%</span>;
    },
  },
  {
    accessorKey: "authors",
    header: "Tác giả",
    size: 150,
    cell: ({ row }) => {
      const authors = row.getValue("authors") as { id: number; name: string }[];
      return (
        <div className="max-w-[150px] truncate">
          <span className="text-sm">
            {authors?.map(author => author.name).join(", ") || "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "categories",
    header: "Danh mục",
    size: 150,
    cell: ({ row }) => {
      const categories = row.getValue("categories") as { id: number; name: string }[];
      return (
        <div className="max-w-[150px] truncate">
          <span className="text-sm">
            {categories?.map(category => category.name).join(", ") || "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "sample_page_urls",
    header: "Trang mẫu",
    size: 110,
    cell: ({ row }) => {
      const samplePages = row.getValue("sample_page_urls") as string[];
      return (
        <div className="flex space-x-1">
          {samplePages?.slice(0, 2).map((url, index) => (
            <img
              key={index}
              src={`${import.meta.env.VITE_API_BASE_URL}${url}`}
              alt={`Sample ${index + 1}`}
              className="w-8 h-10 object-cover rounded border"
            />
          ))}
          {samplePages?.length > 2 && (
            <div className="w-8 h-10 bg-gray-200 rounded border flex items-center justify-center">
              <span className="text-xs">+{samplePages.length - 2}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    size: 140,
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return <span className="text-sm">{formatDate(new Date(date))}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full">Thao tác</div>,
    size: 120,
    enableResizing: false,
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(book)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteConfirmPopover book={book}>
            <Button variant="destructive" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          </DeleteConfirmPopover>
        </div>
      );
    },
  }
];
