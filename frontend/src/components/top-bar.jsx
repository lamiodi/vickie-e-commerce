import { MapPinIcon, ChevronDownIcon } from "./icons"

export function TopBar() {
  return (
    <div className="bg-[#1a1a1a] text-white text-xs py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MapPinIcon className="w-3.5 h-3.5" />
          <span>123 Main Street Chicago, IL 60614 United States</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1 hover:text-gray-300">
            <span>USD</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 hover:text-gray-300">
            <span>EN</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          <span className="text-[#C41E3A]">•</span>
          <a href="#" className="hover:text-gray-300">
            Track Your Order
          </a>
        </div>
      </div>
    </div>
  )
}
