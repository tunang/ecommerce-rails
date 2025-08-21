import { useFetch } from "@/hooks/useFetch";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import type { Book } from "@/types/book.type";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Package, AlertCircle } from "lucide-react";

interface CategoryProductsResponse {
  status: {
    code: number;
    message: string;
  };
  data: Book[];
  meta: {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
  };
}

const CategoryProducts = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  const { data, loading, error, fetchData } = useFetch<CategoryProductsResponse>(
    `/categories/${id}/products?page=${currentPage}`
  );

  useEffect(() => {
    fetchData();
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="aspect-[3/4] w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-6 w-1/3 mb-3" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không có sản phẩm</h3>
            <p className="text-muted-foreground">
              Danh mục này hiện chưa có sản phẩm nào.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: books, meta } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Sản phẩm theo danh mục</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {meta.total_count} sản phẩm
            </Badge>
            <Badge variant="outline">
              Trang {meta.current_page}/{meta.total_pages}
            </Badge>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {books.map((book) => (
          <ProductCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {meta.prev_page && (
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(meta.prev_page!)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
              
              {/* First page */}
              {meta.current_page > 2 && (
                <>
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => handlePageChange(1)}
                      className="cursor-pointer"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {meta.current_page > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              
              {/* Previous page */}
              {meta.prev_page && meta.current_page > 1 && (
                <PaginationItem>
                  <PaginationLink 
                    onClick={() => handlePageChange(meta.prev_page!)}
                    className="cursor-pointer"
                  >
                    {meta.prev_page}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>
                  {meta.current_page}
                </PaginationLink>
              </PaginationItem>
              
              {/* Next page */}
              {meta.next_page && (
                <PaginationItem>
                  <PaginationLink 
                    onClick={() => handlePageChange(meta.next_page!)}
                    className="cursor-pointer"
                  >
                    {meta.next_page}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Last page */}
              {meta.current_page < meta.total_pages - 1 && (
                <>
                  {meta.current_page < meta.total_pages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => handlePageChange(meta.total_pages)}
                      className="cursor-pointer"
                    >
                      {meta.total_pages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              {meta.next_page && (
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(meta.next_page!)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;