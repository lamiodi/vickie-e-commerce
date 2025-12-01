import React, { Suspense, lazy } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { login, refresh } from "./lib/auth.js";
import { useCart } from "./lib/cart.js";
import Home from "./pages/Home.jsx";
const Products = lazy(() => import("./pages/Products.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Success = lazy(() => import("./pages/Success.jsx"));
const Failure = lazy(() => import("./pages/Failure.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
function Header() {
  const navigate = useNavigate();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  return (
    <header className="flex items-center justify-between p-4 border-b" role="banner">
      <Link to="/" className="font-bold">Sporty</Link>
      <nav aria-label="Primary" className="flex gap-4 items-center">
        <Link to="/products" className="hover:underline focus:underline">Products</Link>
        <Link to="/cart" className="relative" aria-label={`Cart with ${cartCount} items`}>
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1" aria-live="polite">{cartCount}</span>
          )}
        </Link>
        <button onClick={async () => { await refresh(); navigate("/account"); }} className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-brand.accent">Account</button>
      </nav>
    </header>
  );
}
export default function App() {
  return (
    <div>
      <Header />
      <main id="main">
        <Suspense fallback={<div className="p-6" role="status" aria-live="polite">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failure />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}