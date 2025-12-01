import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

import { ProtectedRoute } from "./components/ProtectedRoute";

const Products = lazy(() => import("./pages/Products.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
// Keeping these as they were, though not part of the redesign request
const Success = lazy(() => import("./pages/Success.jsx"));
const Failure = lazy(() => import("./pages/Failure.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));

export default function App() {
  return (
    <div>
      {/* The new pages include their own Header and Footer components, 
          so we remove the global Header here to avoid duplication */}
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
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
