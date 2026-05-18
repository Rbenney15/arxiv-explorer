/*
 * Displays a summary of the current filtered result set.
 * Strictly "display" component — receives props, renders nothing else.
 * No state, no side effects. Easy to test.
 */
export default function StatsBar({ total, filtered }) {
  const isFiltered = filtered !== total;

  return (
    <div className="stats-bar">
      <span className="stats-count">
        {/* toLocaleString adds the comma separators: 358490 → 358,490 */}
        <strong>{filtered.toLocaleString()}</strong> papers
        {isFiltered && (
          <span className="stats-of"> of {total.toLocaleString()} total</span>
        )}
      </span>
      {isFiltered && <span className="stats-badge">Filtered</span>}
    </div>
  );
}
