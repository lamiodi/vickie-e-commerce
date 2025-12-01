import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import Section from "../components/ui/Section.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Hero banners matching Figma design
  const heroBanners = [
    {
      title: "DISCOVER YOUR SPORTY EDGE",
      subtitle: "Unleash your potential with premium athletic wear",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Athletic sneaker on light gray abstract background, modern sportswear photography, professional lighting, clean minimalist style&image_size=landscape_16_9",
      cta: "SHOP NOW"
    },
    {
      title: "UNLOCK YOUR BEST SELF",
      subtitle: "Push your limits with performance-driven gear",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Runner in motion on light background, athletic silhouette, dynamic sport photography, energy and movement&image_size=landscape_16_9",
      cta: "EXPLORE COLLECTION"
    }
  ];

  // Category icons matching Figma design
  const categories = [
    { name: "SPORTS", icon: "🏃", image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Sports equipment collage, basketball, soccer ball, tennis racket, clean white background, professional sports photography&image_size=square" },
    { name: "MEN", icon: "👨", image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Male athlete portrait, confident pose, sportswear fashion, clean background, professional photography&image_size=square" },
    { name: "WOMEN", icon: "👩", image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Female athlete portrait, strong confident pose, sportswear fashion, clean background, professional photography&image_size=square" },
    { name: "ACCESSORIES", icon: "🎒", image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Sports accessories collection, gym bag, water bottle, fitness tracker, clean white background, product photography&image_size=square" },
    { name: "OUTDOOR", icon: "🏔️", image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Outdoor adventure gear, hiking equipment, mountain backdrop, adventure photography, clean composition&image_size=square" }
  ];

  // Featured products matching Figma design
  const featuredProducts = [
    {
      id: 1,
      name: "LAKERS JERSEY",
      price: 89.99,
      originalPrice: 119.99,
      category: "BASKETBALL",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Purple and gold Lakers basketball jersey, number 6, professional sports photography, clean white background, high quality&image_size=portrait_4_3",
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "ULTRA BOOST",
      price: 179.99,
      category: "SNEAKERS",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=White running shoes, Adidas Ultra Boost style, clean white background, professional product photography, sportswear&image_size=portrait_4_3",
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: "PERFORMANCE PANTS",
      price: 69.99,
      category: "ACTIVEWEAR",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Black athletic pants, performance sportswear, clean white background, professional photography, fitness apparel&image_size=portrait_4_3",
      rating: 4.6,
      reviews: 67
    },
    {
      id: 4,
      name: "SPORT DUFFLE",
      price: 129.99,
      category: "BAGS",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Black sport duffle bag, athletic gym bag, clean white background, professional product photography, premium quality&image_size=portrait_4_3",
      rating: 4.7,
      reviews: 45
    }
  ];

  // Best sellers matching Figma design
  const bestSellers = [
    {
      id: 5,
      name: "STORM JACKET",
      price: 199.99,
      category: "OUTERWEAR",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Gray and black athletic jacket, weather resistant, clean white background, professional sportswear photography&image_size=portrait_4_3",
      rating: 4.8,
      reviews: 156
    },
    {
      id: 6,
      name: "VELOCITY RUNNER",
      price: 159.99,
      category: "SNEAKERS",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Red running shoes, athletic footwear, clean white background, professional product photography, sportswear&image_size=portrait_4_3",
      rating: 4.7,
      reviews: 203
    },
    {
      id: 7,
      name: "ENDURANCE DUFFLE",
      price: 89.99,
      category: "BAGS",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Green athletic duffle bag, gym bag, clean white background, professional photography, sport accessories&image_size=portrait_4_3",
      rating: 4.5,
      reviews: 78
    },
    {
      id: 8,
      name: "FLEX TOP",
      price: 49.99,
      category: "TOPS",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Light purple athletic top, short sleeve, performance fabric, clean white background, professional photography&image_size=portrait_4_3",
      rating: 4.6,
      reviews: 92
    },
    {
      id: 9,
      name: "SPRINT SNEAKER",
      price: 139.99,
      category: "SNEAKERS",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Black athletic sneakers, running shoes, clean white background, professional product photography, sport footwear&image_size=portrait_4_3",
      rating: 4.8,
      reviews: 134
    },
    {
      id: 10,
      name: "COZY HOODIE",
      price: 79.99,
      category: "HOODIES",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Pink athletic hoodie, comfortable sportswear, clean white background, professional photography, casual fitness&image_size=portrait_4_3",
      rating: 4.9,
      reviews: 167
    },
    {
      id: 11,
      name: "YOGA MAT PRO",
      price: 69.99,
      category: "YOGA",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Purple yoga mat, professional quality, clean white background, fitness equipment photography&image_size=portrait_4_3",
      rating: 4.7,
      reviews: 88
    },
    {
      id: 12,
      name: "TEAM CAP",
      price: 34.99,
      category: "CAPS",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Red baseball cap, team sports cap, clean white background, professional product photography, athletic accessories&image_size=portrait_4_3",
      rating: 4.4,
      reviews: 56
    }
  ];

  // FAQ data matching Figma design
  const faqs = [
    {
      question: "How do I choose the right shoe for my workout?",
      answer: "Consider your workout type, foot shape, and support needs. Running shoes offer cushioning for forward motion, while training shoes provide lateral stability for gym workouts. Visit our sizing guide for personalized recommendations."
    },
    {
      question: "How long does shipping take on orders?",
      answer: "Standard shipping takes 5-7 business days, while express shipping delivers in 2-3 business days. Orders over $50 qualify for free standard shipping. You'll receive tracking information once your order ships."
    },
    {
      question: "Can I return items I don't like or don't fit?",
      answer: "Yes! We offer a 30-day return policy for unused items in original packaging. Simply initiate a return through your account, and we'll provide a prepaid shipping label for domestic orders."
    },
    {
      question: "What are the benefits of strength training?",
      answer: "Strength training builds muscle, increases bone density, boosts metabolism, and improves overall functional fitness. Our performance apparel is designed to support your strength training journey with comfort and durability."
    }
  ];

  // Blog posts matching Figma design
  const blogPosts = [
    {
      title: "New Class Offer: Master The Single Handstand",
      excerpt: "Learn the fundamentals of handstand training with our expert instructors. Build strength, balance, and confidence.",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Athlete performing handstand, gymnastics training, clean white background, professional fitness photography, strength and balance&image_size=landscape_16_9",
      date: "March 15, 2024",
      author: "Coach Sarah"
    },
    {
      title: "Healthy Choices: Herb Chicken & Avocado Salad",
      excerpt: "Fuel your workouts with this protein-packed, nutrient-rich salad that's both delicious and energizing.",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Healthy herb chicken avocado salad, fresh ingredients, vibrant colors, professional food photography, fitness nutrition&image_size=landscape_16_9",
      date: "March 12, 2024",
      author: "Nutritionist Mike"
    },
    {
      title: "Beginner's Guide: Tips for Running on the Sand",
      excerpt: "Discover how beach running can improve your strength and stability while providing a challenging cardio workout.",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Runner on beach sand, ocean background, sunrise fitness, professional running photography, beach workout&image_size=landscape_16_9",
      date: "March 10, 2024",
      author: "Running Expert Jen"
    }
  ];

  // Auto-rotate hero banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const handleNewsletterSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setNewsletterStatus("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setNewsletterStatus("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      setNewsletterStatus("Thank you for subscribing! Check your email for confirmation.");
      setEmail("");
    } catch (error) {
      setNewsletterStatus("Subscription failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const StarRating = ({ rating, reviews }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {reviews > 0 && <span className="text-sm text-gray-600 ml-1">({reviews})</span>}
    </div>
  );

  const ProductCard = ({ product, showAddToCart = true }) => (
    <div className="group cursor-pointer transition-transform hover:scale-105">
      <Card className="h-full overflow-hidden">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-2 left-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold uppercase">
              {product.category}
            </span>
          </div>
          {product.originalPrice && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wide">{product.name}</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            {product.rating && (
              <StarRating rating={product.rating} reviews={product.reviews} />
            )}
          </div>
          {showAddToCart && (
            <Button className="w-full uppercase font-bold">
              Add to Cart
            </Button>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>SPORTLY - Discover Your Sporty Edge</title>
        <meta name="description" content="Premium athletic wear and sports equipment. Discover your sporty edge with our performance-driven collection." />
        <meta name="keywords" content="sportswear, athletic wear, fitness apparel, sports equipment, workout gear" />
      </Helmet>

      {/* Top Announcement Bar */}
      <div className="bg-red-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <span>FREE SHIPPING ON ORDERS OVER $50</span>
          <div className="flex gap-4">
            <span>📞 1-800-SPORTLY</span>
            <span>📧 HELP@SPORTLY.COM</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-black text-black uppercase tracking-wider">
                SPORT<span className="text-red-600">L</span>Y
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-black hover:text-red-600 px-3 py-2 text-sm font-bold uppercase tracking-wide">Home</Link>
              <Link to="/products" className="text-black hover:text-red-600 px-3 py-2 text-sm font-bold uppercase tracking-wide">Shop</Link>
              <Link to="/sports" className="text-black hover:text-red-600 px-3 py-2 text-sm font-bold uppercase tracking-wide">Sports</Link>
              <Link to="/men" className="text-black hover:text-red-600 px-3 py-2 text-sm font-bold uppercase tracking-wide">Men</Link>
              <Link to="/women" className="text-black hover:text-red-600 px-3 py-2 text-sm font-bold uppercase tracking-wide">Women</Link>
              <Link to="/blog" className="text-black hover:text-red-600 px-3 py-2 text-sm font-bold uppercase tracking-wide">Blog</Link>
              <Link to="/contact" className="text-black hover:text-red-600 px-3 py-2 text-sm font-bold uppercase tracking-wide">Contact</Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button className="text-black hover:text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-black hover:text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="text-black hover:text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="text-black hover:text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-100 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-black text-black uppercase leading-tight tracking-tight">
                {heroBanners[currentHeroIndex].title}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                {heroBanners[currentHeroIndex].subtitle}
              </p>
              <Button className="bg-red-600 text-white px-8 py-4 text-lg font-bold uppercase tracking-wide hover:bg-red-700 transition-colors">
                {heroBanners[currentHeroIndex].cta}
              </Button>
            </div>
            <div className="relative">
              <img
                src={heroBanners[currentHeroIndex].image}
                alt="Athletic gear"
                className="w-full h-96 object-cover rounded-lg shadow-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        
        {/* Hero Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentHeroIndex ? 'bg-red-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Icons */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-black uppercase tracking-wide">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Tiles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-black text-black uppercase mb-4">UNLEASH YOUR POTENTIAL</h2>
              <p className="text-gray-700 mb-6">Discover performance gear designed to help you reach new heights in your fitness journey.</p>
              <Button className="bg-red-600 text-white px-6 py-3 font-bold uppercase tracking-wide hover:bg-red-700 transition-colors">
                Shop Now
              </Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-black text-black uppercase mb-4">STAY AHEAD OF THE GAME</h2>
              <p className="text-gray-700 mb-6">Get the latest in sports technology and innovation to maintain your competitive edge.</p>
              <Button className="bg-red-600 text-white px-6 py-3 font-bold uppercase tracking-wide hover:bg-red-700 transition-colors">
                Explore More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-black uppercase tracking-wide mb-4">Featured</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-black text-black uppercase tracking-wide">Best Seller</h2>
            <button className="text-red-600 hover:text-red-700 font-bold uppercase tracking-wide text-sm">
              See All Products
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} showAddToCart={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Full Width Banner */}
      <section className="py-16 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-black text-white uppercase leading-tight">
                UNLOCK YOUR BEST SELF
              </h2>
              <p className="text-red-100 text-lg">
                Transform your fitness journey with premium athletic wear designed for peak performance.
              </p>
              <Button className="bg-white text-red-600 px-8 py-4 text-lg font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors">
                Shop Collection
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Athlete running in motion, dynamic sports photography, red accent lighting, professional fitness shot, energy and determination&image_size=landscape_16_9"
                alt="Athlete in motion"
                className="w-full h-80 object-cover rounded-lg shadow-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-black text-black uppercase tracking-wide mb-8">Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-bold text-black mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Fitness trainer helping athlete with proper form, professional gym setting, clean white background, sports instruction&image_size=landscape_16_9"
                alt="Fitness instruction"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-2">Worldwide Shipping</h3>
              <p className="text-gray-600">Fast and reliable delivery to over 100 countries worldwide.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-2">Free Returns</h3>
              <p className="text-gray-600">30-day return policy with free shipping on returns.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-2">Secure Transactions</h3>
              <p className="text-gray-600">Shop with confidence using our encrypted payment system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-black text-black uppercase tracking-wide">Latest Updates</h2>
            <button className="text-red-600 hover:text-red-700 font-bold uppercase tracking-wide text-sm">
              See All Articles
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div key={index} className="group cursor-pointer">
                <Card className="h-full overflow-hidden group-hover:shadow-lg transition-shadow">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <div className="text-xs text-gray-500 mb-2">
                      {post.date} • By {post.author}
                    </div>
                    <h3 className="text-lg font-bold text-black mb-3 group-hover:text-red-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 text-sm">{post.excerpt}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white uppercase tracking-wide mb-4">
            JOIN THE SPORTLY COMMUNITY
          </h2>
          <p className="text-red-100 text-lg mb-8">
            Get exclusive offers, training tips, and early access to new collections.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white text-red-600 px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
              </Button>
            </div>
          </form>
          {newsletterStatus && (
            <p className={`mt-4 text-sm ${newsletterStatus.includes("Thank you") ? "text-green-300" : "text-red-200"}`}>
              {newsletterStatus}
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-black uppercase tracking-wider mb-4">
                SPORT<span className="text-red-600">L</span>Y
              </div>
              <p className="text-gray-400 mb-4">
                Discover your sporty edge with premium athletic wear and equipment.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/press" className="hover:text-white">Press</Link></li>
                <li><Link to="/affiliates" className="hover:text-white">Affiliates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/account" className="hover:text-white">My Account</Link></li>
                <li><Link to="/orders" className="hover:text-white">Order Tracking</Link></li>
                <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
                <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
                <li><Link to="/shipping" className="hover:text-white">Shipping & Returns</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SPORTLY. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}