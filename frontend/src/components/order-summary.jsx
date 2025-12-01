import { Link } from "react-router-dom"

export function OrderSummary({ subtotal, shipping, tax, total, showCheckoutButton = true }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between py-4 border-b border-gray-200">
        <span className="font-bold">Total</span>
        <span className="font-bold text-lg">${total.toFixed(2)}</span>
      </div>

      {/* Promo Code */}
      <div className="py-4 border-b border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#C41E3A]"
          />
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Apply
          </button>
        </div>
      </div>

      {showCheckoutButton && (
        <Link
          to="/checkout"
          className="w-full bg-[#C41E3A] hover:bg-[#a3182f] text-white font-medium py-3 px-6 rounded-lg mt-6 flex items-center justify-center transition-colors"
        >
          Proceed to Checkout
        </Link>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        <span>Secure SSL Encryption</span>
      </div>
    </div>
  )
}
