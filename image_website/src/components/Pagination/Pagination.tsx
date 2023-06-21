"use client";


import { useRouter } from "next/navigation";
import { updateSearchParams } from "@/utils/utils";
import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  isNext: boolean;
}

const Pagination = ({
  page,
  totalPages,
  totalItems,
  perPage,
  isNext
}: PaginationProps) => {
  const router = useRouter();

  const handleNavigation = (newPage: number) => {
    const newPathname = updateSearchParams("page", `${newPage}`);
    router.push(newPathname);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePageCount = 10; // Number of visible page numbers

    // Calculate the range of visible page numbers
    let startPage = Math.max(1, page - Math.floor(visiblePageCount / 2));
    let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);

    // Adjust the range if it exceeds the total number of pages
    const maxVisiblePages = 7; // Maximum number of visible pages before showing ellipsis
    if (endPage - startPage + 1 > maxVisiblePages) {
      const overflow = endPage - startPage + 1 - maxVisiblePages;
      if (startPage === 1) {
        endPage -= overflow;
      } else if (endPage === totalPages) {
        startPage += overflow;
      } else {
        const offset = Math.floor(overflow / 2);
        startPage += offset;
        endPage -= overflow - offset;
      }
    }

    // Render page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Link
          key={i}
          href={`/?page=${i}`}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            i === page ? "bg-indigo-600 text-white" : "text-gray-900"
          } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
        >
          {i}
        </Link>
      );
    }

    // Add ellipsis if necessary
    if (startPage > 1) {
      pageNumbers.unshift(
        <span
          key="start-ellipsis"
          onClick={()=>handleNavigation(1)}
          className="relative cursor-pointer pointer-events-auto inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300"
        >
          ...
        </span>
      );
    }
    if (endPage < totalPages) {
      pageNumbers.push(
        <span
          key="end-ellipsis"
          onClick={()=>handleNavigation(totalPages)}
          className="relative cursor-pointer pointer-events-auto inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300"
        >
          ...
        </span>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        
        {page > 1 && (
          <Link
            href={`/?page=${page-1}`}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </Link>
        )}

        {renderPageNumbers()}

        {page < totalPages && (
          <Link
            href={`/?page=${page+1}`}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </Link>
        )}
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page: <span className="font-medium">{page}</span> to page{" "}
            <span className="font-medium">{totalPages}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>

        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {page > 1 && (
              <Link
                href={`/?page=${page-1}`}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor" 
                    className="w-6 h-6"
                    >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" 
                    />
                </svg>

                Previous
              </Link>
            )}
            {renderPageNumbers()}
            {page < totalPages && (
              <Link
              href={`/?page=${page + 1}`}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Next
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                className="w-6 h-6">
                <path strokeLinecap="round" 
                    strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>

              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
