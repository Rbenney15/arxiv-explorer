/**
 * Pagination.jsx
 * Controls for navigating through paged results.
 *
 * WHY pagination?
 * Rendering 358k rows into the DOM would freeze the browser.
 * We slice the filteredRecords array and only render one page at a time.
 * The data is all in memory — pagination is purely a rendering concern.
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // nothing to paginate

  return (
    <nav className="pagination" aria-label="Results pagination">
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        aria-label="First page"
      >
        «
      </button>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      <span className="pagination-info">
        Page {page} of {totalPages.toLocaleString()}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        aria-label="Last page"
      >
        »
      </button>
    </nav>
  );
}
