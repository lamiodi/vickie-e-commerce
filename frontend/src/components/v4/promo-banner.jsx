import { ChevronDown } from 'lucide-react';

export function PromoBanner() {
  return (
    <div className="bg-black text-white text-center py-2 px-4 text-xs">
      <span>Get 10% off your first order when you sign up to emails.</span>
      <button className="ml-2 inline-flex items-center underline">
        Join now
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>
    </div>
  );
}
