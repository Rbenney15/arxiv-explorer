/*
 * All filter controls in one panel. Receives current filter values
 * and callbacks from the parent — it owns zero state itself.
 */
export default function FilterPanel({
  filters,
  categories,
  onFilterChange,
  onClear,
  resultCount,
}) {
  return (
    <aside className="filter-panel">
      <div className="filter-header">
        <h2>Filters</h2>
        <button
          type="button"
          className="clear-btn"
          onClick={onClear}
          disabled={
            !filters.category &&
            !filters.dateFrom &&
            !filters.dateTo &&
            !filters.affiliation
          }
        >
          Clear all
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="category-select">Subject category</label>
        <select
          id="category-select"
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="date-from">Date from</label>
        <input
          id="date-from"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="date-to">Date to</label>
        <input
          id="date-to"
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange({ dateTo: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="affiliation-input">Affiliation</label>
        <input
          id="affiliation-input"
          type="search"
          placeholder="e.g. MIT, Stanford, CERN…"
          value={filters.affiliation}
          onChange={(e) => onFilterChange({ affiliation: e.target.value })}
        />
      </div>

      <p className="filter-result-hint">
        {resultCount.toLocaleString()} results
      </p>
    </aside>
  );
}
