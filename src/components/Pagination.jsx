import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Max number of numbered page buttons shown at once. */
const WINDOW = 5;

/**
 * Previous / numbered / Next pagination controls.
 *
 * Page numbers are built with a plain loop (no Array.filter) around the
 * current page so large result sets stay compact.
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  let start = Math.max(1, currentPage - Math.floor(WINDOW / 2));
  const end = Math.min(totalPages, start + WINDOW - 1);
  start = Math.max(1, end - WINDOW + 1);

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const base = 'px-3 py-2 rounded transition-colors';
  const enabled = 'bg-[#e50914] hover:bg-[#b20710] text-white cursor-pointer';
  const disabled = 'bg-gray-700 text-gray-500 cursor-not-allowed';

  return (
    <nav aria-label="Pagination" className="flex flex-wrap justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 ${base} ${currentPage === 1 ? disabled : enabled}`}
      >
        <ChevronLeft className="w-5 h-5" /> Previous
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          className={`${base} cursor-pointer ${
            p === currentPage ? 'bg-white text-black font-bold' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 ${base} ${currentPage === totalPages ? disabled : enabled}`}
      >
        Next <ChevronRight className="w-5 h-5" />
      </button>

      <span className="w-full text-center text-sm text-gray-400 mt-2">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
}

export default Pagination;
