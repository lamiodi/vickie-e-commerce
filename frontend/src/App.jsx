import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Preloader from './components/ui/Preloader';

const Home = lazy(() => import('./pages/Home.jsx'));
const HomeVariant3 = lazy(() => import('./pages/HomeVariant3.jsx'));
const HomeVariant4 = lazy(() => import('./pages/HomeVariant4.jsx'));

import { ProtectedRoute } from './components/ProtectedRoute';

const Products = lazy(() => import('./pages/Products.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
// Keeping these as they were, though not part of the redesign request
const Success = lazy(() => import('./pages/Success.jsx'));
const Failure = lazy(() => import('./pages/Failure.jsx'));
const Account = lazy(() => import('./pages/Account.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const FooterLinks = lazy(() => import('./pages/FooterLinks.jsx'));
const Testimonials = lazy(() => import('./pages/Testimonials.jsx'));
const Tips = lazy(() => import('./pages/Tips.jsx'));
const Returns = lazy(() => import('./pages/Returns.jsx'));

import { VariantSwitcher } from './components/VariantSwitcher';
import { WhatsAppButton } from './components/WhatsAppButton';

export default function App() {
  return (
    <div>
      {/* The new pages include their own Header and Footer components, 
          so we remove the global Header here to avoid duplication */}
      <VariantSwitcher />
      <WhatsAppButton />
      <main id="main">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/v3" element={<HomeVariant3 />} />
            <Route path="/v4" element={<HomeVariant4 />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failure />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/links" element={<FooterLinks />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/returns" element={<Returns />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
