import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Section from "../components/ui/Section.jsx";
import Button from "../components/ui/Button.jsx";
export default function Home() {
  return (
    <div className="p-6">
      <Helmet>
        <title>Sporty | Fitness Apparel</title>
        <meta name="description" content="Shop waist trainers, joggers, and gymwear" />
      </Helmet>
      <Section title="Premium Fitness Apparel" subtitle="Elevate your training with waist trainers, joggers, and gymwear designed for performance and comfort.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <p className="text-gray-700 max-w-[60ch] leading-6">Discover quality pieces built to move with you. Shop our latest arrivals and bestsellers.</p>
            <Button as={Link} to="/products" className="mt-4">Shop Now</Button>
          </div>
          <div>
            <img src="https://via.placeholder.com/600x400?text=Sporty" alt="Sporty Collection" className="w-full rounded-lg shadow-md" loading="lazy" decoding="async" />
          </div>
        </div>
      </Section>
    </div>
  );
}