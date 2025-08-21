import { useEffect, useState } from "react";
import { createColumns } from "./Columns";
import type { Category } from "@/types/category.type";
import { DataTable } from "@/components/ui/table/DataTable";
import { CategoryModal } from "./CategoryModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchCategoriesRequest } from "@/store/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";

function DemoPage() {
  const dispatch = useDispatch();
  const { categories, pageSize, currentPage, isLoading, pagination } = useSelector((state: RootState) => state.category);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    dispatch(fetchCategoriesRequest({ page: currentPage, per_page: pageSize, search: "" }));
  }, [currentPage, pageSize, dispatch]);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchCategoriesRequest({ page, per_page: pageSize, search: "" }));
  };

  const columns = createColumns(handleEdit);

  return (
    <div className="w-h-full flex flex-col p-4 ">
      <div className="flex justify-between items-center py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>
      
      <div className="flex-1">
        <DataTable 
          columns={columns} 
          data={categories} 
          loading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
      
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        mode={modalMode}
      />
    </div>
  );
}

export default DemoPage;
