"use client";

import { useRouter } from "next/navigation";
import { updateSearchParams } from "@/utils/utils";
import { useEffect, useState, useContext } from "react";

import { 
  AppContext, 
  setLoading 
} from "@/context/Context";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
}

const PaginationWrapper = ({
  page,
  totalPages,
  totalItems,

}: PaginationProps) => {

  const router = useRouter();
  const {dispatch} = useContext(AppContext)
  const [initPage, setInitPage ] = useState(page)

  useEffect(()=> {
    setLoading(dispatch,false)
    setInitPage(page)
  },[page])

  const handleNavigation = (event: React.ChangeEvent<unknown>, newPage: number) => {

    setLoading(dispatch,true)
    const newPathname = updateSearchParams("page", `${newPage}`);
    router.push(newPathname);
    
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePageCount = 10; // Number of visible page numbers

    // Calculate the range of visible page numbers
    let startPage = Math.max(1, initPage - Math.floor(visiblePageCount / 2));
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

    // Render initPage numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <div
          key={i}
          onClick={(e) => handleNavigation(e, i)}
          className={`relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-semibold ${
            i === page ? "bg-indigo-600 text-white" : "text-gray-900"
          } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
        >
          {i}
        </div>
      );
    }

    // Add ellipsis if necessary
    if (startPage > 1) {
      pageNumbers.unshift(
        <div
          key="start-ellipsis"
          onClick={(e) => handleNavigation(e, totalPages)}
          className="relative cursor-pointer pointer-events-auto inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300"
        >
          ...
        </div>
      );
    }
    if (endPage < totalPages) {
      pageNumbers.push(
        <div
          key="end-ellipsis"
          onClick={(e) => handleNavigation(e, 1)}
          className="relative cursor-pointer pointer-events-auto inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300"
        >
          ...
        </div>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {initPage > 1 && (
          <div
            onClick={(e) => handleNavigation(e, 1)}
            className="relative cursor-pointer inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </div>
        )}

        {renderPageNumbers()}

        {initPage < totalPages && (
          <div
            onClick={(e) => handleNavigation(e, initPage + 1)}
            className="relative ml-3 cursor-pointer inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </div>
        )}
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing Page: <span className="font-medium">{initPage}</span> to Page{" "}
            <span className="font-medium">{totalPages}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>

        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="PaginationWrapper"
          >
            {initPage > 1 && (
              <div
                onClick={(e) => handleNavigation(e, initPage - 1)}
                className="relative cursor-pointer inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
              </div>
            )}
            {renderPageNumbers()}
            {initPage < totalPages && (
              <div
                onClick={(e) => handleNavigation(e, initPage + 1)}
                className="relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Next
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
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PaginationWrapper;
