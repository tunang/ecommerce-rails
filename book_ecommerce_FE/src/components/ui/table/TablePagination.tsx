import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  totalCount,
  onPageChange,
}: TablePaginationProps) {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Số trang hiển thị xung quanh trang hiện tại

    // Luôn hiển thị trang 1
    if (totalPages > 0) {
      pages.push(1);
    }

    // Tính toán phạm vi trang cần hiển thị
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Thêm ellipsis nếu cần
    if (start > 2) {
      pages.push("...");
    }

    // Thêm các trang trong phạm vi
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Thêm ellipsis nếu cần
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Luôn hiển thị trang cuối (nếu có hơn 1 trang)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Không hiển thị pagination nếu chỉ có 1 trang và không có dữ liệu
  if (totalPages <= 1 && totalCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Tổng {totalCount} mục
      </div>
      
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => prevPage && onPageChange(prevPage)}
              className={
                !prevPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {generatePageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => nextPage && onPageChange(nextPage)}
              className={
                !nextPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}