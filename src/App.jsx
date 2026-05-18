import { useArxivData } from './hooks/useArxivData'
import { useFilters }   from './hooks/useFilters'
import FilterPanel      from './components/FilterPanel'
import ResultsTable     from './components/ResultsTable'
import StatsBar         from './components/StatsBar'
import './App.css'

export default function App() {
  const { records, loading, error } = useArxivData()

  const {
    filters,
    filteredRecords,
    categories,
    updateFilter,
    clearFilters,
  } = useFilters(records)

  if (loading)
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>Loading arXiv dataset…</p>
      </div>
    );

  if (error) return (
    <div className="error-screen">
      <p>Failed to load data: {error}</p>
    </div>
  )

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>arXiv Research Explorer</h1>
        <StatsBar
          total={records.length}
          filtered={filteredRecords.length}
        />
      </header>

      <div className="app-body">
        <FilterPanel
          filters={filters}
          categories={categories}
          onFilterChange={updateFilter}
          onClear={clearFilters}
          resultCount={filteredRecords.length}
        />
        <main className="results-area">
          <ResultsTable records={filteredRecords} />
        </main>
      </div>
    </div>
  )
}