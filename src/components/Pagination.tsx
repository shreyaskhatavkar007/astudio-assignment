import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

interface PaginationProps {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const visiblePages = 5;

  const getPageNumbers = () => {
    let start = Math.max(1, page - Math.floor(visiblePages / 2));
    let end = Math.min(totalPages, start + visiblePages - 1);

    if (end - start < visiblePages - 1) {
      start = Math.max(1, end - visiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="disabled:text-grey"
      >
        <FaLongArrowAltLeft />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-3 py-2 ${page === pageNumber ? "-translate-y-2" : ""}`}
        >
          {pageNumber}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="disabled:text-grey"
      >
        <FaLongArrowAltRight />
      </button>
    </div>
  );
}
