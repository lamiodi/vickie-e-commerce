import { ChevronDownIcon, GridIcon, ListIcon } from "./icons"

export function ProductsFilterBar({ totalResults, currentPage, pageSize }) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalResults)

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-gray-200">
      {/* Left: Filters */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-500">Sort by</span>
        <span className="text-gray-300">|</span>

        <button className="flex items-center gap-1 px-2 py-1 hover:text-[#C41E3A] transition-colors">
          All Categories
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        <span className="text-gray-300">|</span>

        <button className="flex items-center gap-1 px-2 py-1 hover:text-[#C41E3A] transition-colors">
          All Brands
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        <span className="text-gray-300">|</span>

        <button className="flex items-center gap-1 px-2 py-1 hover:text-[#C41E3A] transition-colors">
          All Sizes
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        <span className="text-gray-300">|</span>

        <button className="flex items-center gap-1 px-2 py-1 text-[#C41E3A] font-medium">
          $100 - $1000
          <ChevronDownIcon className="w-4 h-4" />
        </button>

        <span className="text-gray-400 ml-2">
          Showing {startItem} - {endItem} of {totalResults} results.
        </span>
      </div>

      {/* Right: View Toggle */}
      <div className="flex items-center gap-1">
        <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
          <GridIcon className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
          <ListIcon className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}
