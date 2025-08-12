import { useEffect, useState } from "react";
import { createColumns } from "./columns";
import type { Book } from "@/types/book.type";
import { DataTable } from "@/components/ui/table/DataTable";
import { BookModal } from "./BookModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchBooksRequest } from "@/store/slices/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";

function BooksPage() {
  const dispatch = useDispatch();
  const { books, pageSize, currentPage } = useSelector((state: RootState) => state.book);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    dispatch(fetchBooksRequest({ page: currentPage, per_page: pageSize, search: "" }));
  }, [currentPage, pageSize, dispatch]);

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedBook(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const columns = createColumns(handleEdit);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-2xl font-bold">Quản lý sách</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm sách
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={books} />
      </div>
      
      <BookModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        book={selectedBook}
        mode={modalMode}
      />
    </div>
  );
}

export default BooksPage;