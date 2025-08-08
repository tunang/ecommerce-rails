import { useEffect, useState } from "react";
import { createColumns } from "./Columns";
import type { Author } from "@/types/author.type";
import { AuthorModal } from "./AuthorModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchAuthorsRequest } from "@/store/slices/authorSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { DataTable } from "@/components/ui/table/DataTable";

function AuthorsPage() {
  const dispatch = useDispatch();
  const { authors, pageSize, currentPage } = useSelector((state: RootState) => state.author);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    dispatch(fetchAuthorsRequest({ page: currentPage, per_page: pageSize, search: "" }));
  }, [currentPage, pageSize, dispatch]);

  const handleEdit = (author: Author) => {
    setSelectedAuthor(author);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAuthor(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAuthor(null);
  };

  const columns = createColumns(handleEdit);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-2xl font-bold">Quản lý tác giả</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm tác giả
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={authors} />
      </div>
      
      <AuthorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        author={selectedAuthor}
        mode={modalMode}
      />
    </div>
  );
}

export default AuthorsPage;