/*
 * Renders the current filtered records as a paginated table.
 * Pagination is local because it only affects table rendering.
 */
import { useState, useEffect, useMemo } from "react";
import PaperCard from "./PaperCard";
import Pagination from "./Pagination";

const PAGE_SIZE = 50; // rows per page — easy to change in one place

export default function ResultsTable({ records }) {
  const [page, setPage] = useState(1);

  // Reset pagination whenever the filtered result set changes.
  useEffect(() => {
    setPage(1);
  }, [records]);

  // Total number of pages — recomputes only when records.length changes
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(records.length / PAGE_SIZE)),
    [records.length],
  );

  // The slice of records to render right now
  const pageRecords = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return records.slice(start, start + PAGE_SIZE);
  }, [records, page]);

  if (records.length === 0) {
    return <p className="no-results">No papers match the current filters.</p>;
  }

  return (
    <div className="results-wrapper">
      <div className="table-scroll">
        <table className="results-table">
          <thead>
            <tr>
              <th>Paper ID</th>
              <th>Date</th>
              <th>Affiliation</th>
              <th>Subjects</th>
            </tr>
          </thead>
          <tbody>
            {pageRecords.map((record) => (
              <PaperCard key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
