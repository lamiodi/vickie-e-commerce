import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

// Main App Component
export default function GymsharkHomepage() {
  const [activeCategory, setActiveCategory] = useState('women');
  const [activeTraining, setActiveTraining] = useState('lifting');
  const [activeContentTab, setActiveContentTab] = useState('trending');

  const [stormProducts, setStormProducts] = useState([]);
  const [newInProducts, setNewInProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch "Storm" (Latest Women's/Activewear)
        const stormRes = await api.get('/products?category=Activewear&limit=6&sort=newest');
        setStormProducts(stormRes.data.products || []);

        // Fetch "New In" (General Newest)
        const newRes = await api.get('/products?limit=6&sort=newest');
        setNewInProducts(newRes.data.products || []);

        // Fetch Popular (Trending)
        const popularRes = await api.get('/products?sort=trending&limit=4');
        setPopularProducts(popularRes.data.products || []);
      } catch (error) {
        console.error('Failed to fetch products for home variant 2', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-xs">
        <p>FREE SHIPPING ON ORDERS OVER $75 | SHOP NOW →</p>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Nav */}
            <div className="flex items-center space-x-6">
              <Link to="/products" className="text-sm font-medium hover:underline">
                Women
              </Link>
              <Link to="/products" className="text-sm font-medium hover:underline">
                Men
              </Link>
              <Link to="/products" className="text-sm font-medium hover:underline">
                Accessories
              </Link>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold tracking-tight">
                SPORTZY
              </Link>
            </div>

            {/* Right Nav */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-100 rounded-full py-2 px-4 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <svg
                  className="absolute right-3 top-2.5 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
              <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <img
          src="/woman-wearing-black-seamless-leggings-athletic-wea.jpg"
          alt="Hero"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-lg">
              <p className="text-[#C41E3A] font-bold mb-2">NEW IN: SEAMLESS</p>
              <h2 className="text-5xl font-bold mb-4 leading-tight">ALICIA&apos;S SET</h2>
              <p className="text-gray-300 mb-6">
                Experience the ultimate comfort and flexibility with our new seamless collection.
                Designed for performance, built for you.
              </p>
              <Link
                to="/products"
                className="bg-white text-black px-8 py-3 font-semibold hover:bg-gray-200 transition inline-block"
              >
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New In Storm Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">#SPORTZY</p>
            <h3 className="text-2xl font-bold">LATEST ARRIVALS</h3>
          </div>
          <Link to="/products" className="text-sm font-medium underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stormProducts.length > 0 ? (
            stormProducts.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="group cursor-pointer block"
              >
                <div className="relative bg-gray-100 aspect-[3/4] mb-3 overflow-hidden">
                  <img
                    src={product.image || product.video_thumbnail_url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {product.badge && (
                    <span
                      className={`absolute top-2 left-2 text-white text-xs px-2 py-1 ${product.badge === 'SALE' ? 'bg-red-600' : 'bg-black'}`}
                    >
                      {product.badge}
                    </span>
                  )}
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
                <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                <p className="text-xs text-gray-500 mb-1">
                  {product.variants && product.variants.length > 0
                    ? `${product.variants.length} Colors`
                    : product.category}
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">
                    £{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xs text-gray-400 line-through">
                      £{Number(product.originalPrice).toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Loading products...</p>
          )}
        </div>
      </section>

      {/* New Tactical Now Live Banner */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
        <img
          src="/muscular-man-in-olive-green-tactical-gym-wear-posi.jpg"
          alt="Tactical Collection"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-lg">
              <p className="text-[#C41E3A] font-bold text-sm mb-2">NEW TACTICAL NOW</p>
              <h2 className="text-4xl font-bold mb-2">LIVE</h2>
              <p className="text-gray-300 text-sm mb-4">
                Performance at its peak. And for a fit you can count on today.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Discover everyday essential fits to help you train happy, gain every success and
                more.
              </p>
              <Link
                to="/products"
                className="bg-white text-black px-6 py-2 font-semibold text-sm hover:bg-gray-200 transition inline-block"
              >
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New In Section with Tabs */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">#FRESH</p>
            <h3 className="text-2xl font-bold">NEW IN</h3>
          </div>
          <div className="flex items-center gap-4">
            <button
              className={`text-sm px-4 py-2 ${activeCategory === 'women' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
              onClick={() => setActiveCategory('women')}
            >
              Women
            </button>
            <button
              className={`text-sm px-4 py-2 ${activeCategory === 'men' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
              onClick={() => setActiveCategory('men')}
            >
              Men
            </button>
            <Link to="/products" className="text-sm font-medium underline ml-4">
              View All
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(activeCategory === 'women' ? newInProducts : popularProducts).length > 0 ? (
            (activeCategory === 'women' ? newInProducts : popularProducts)
              .slice(0, 6)
              .map((product) => (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="group cursor-pointer block"
                >
                  <div className="relative bg-gray-100 aspect-[3/4] mb-3 overflow-hidden">
                    <img
                      src={product.image || product.video_thumbnail_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {product.badge && (
                      <span
                        className={`absolute top-2 left-2 text-white text-xs px-2 py-1 ${product.badge === 'SALE' ? 'bg-red-600' : 'bg-black'}`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">
                      £
                      {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        £{Number(product.originalPrice).toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>
              ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Loading products...</p>
          )}
        </div>
      </section>

      {/* Popular Right Now */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">POPULAR RIGHT NOW</h3>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              category: 'LATEST COLLECTION',
              desc: 'Check out our newest arrivals and latest trends.',
              image: '/woman-wearing-gray-crop-top-fitness.jpg',
            },
            {
              category: 'GYM ESSENTIALS',
              desc: 'Everything you need for your perfect workout session.',
              image: '/black-dumbbell-weight-fitness-equipment-gym.jpg',
            },
            {
              category: 'BEST SELLERS',
              desc: 'Discover what everyone is buying right now.',
              image: '/pink-peach-running-shoes-women-athletic-sneakers-m.jpg',
            },
            {
              category: 'ACCESSORIES',
              desc: 'Complete your look with our premium accessories.',
              image: '/black-sports-duffel-bag.jpg',
            },
          ].map((item, index) => (
            <Link to="/products" key={index} className="group cursor-pointer block">
              <div className="relative bg-gray-100 aspect-square mb-3 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h4 className="font-bold text-sm mb-1">{item.category}</h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How Do You Train Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">HOW DO YOU TRAIN?</h3>

        <div className="flex gap-2 mb-8">
          {['lifting', 'run'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 text-sm font-medium ${
                activeTraining === tab ? 'bg-black text-white' : 'bg-gray-100 text-black'
              }`}
              onClick={() => setActiveTraining(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'LIFTING', image: '/woman-wearing-gray-seamless-leggings-gym.jpg' },
            { name: 'RUNNING', image: '/athletic-man-running-outdoor-sports-photography-dr.jpg' },
            { name: 'PILATES', image: '/woman-doing-yoga-meditation-pose-on-mountain-top-s.jpg' },
            { name: 'HIIT', image: '/happy-child-playing-sports-outdoors-kid-running-su.jpg' },
          ].map((training, index) => (
            <div key={index} className="group cursor-pointer relative overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img
                  src={training.image}
                  alt={training.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                <div className="absolute bottom-4 left-4">
                  <h4 className="text-white font-bold text-lg">{training.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop Categories */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'SHOP WOMEN',
              image: '/woman-wearing-black-seamless-leggings-athletic-wea.jpg',
            },
            { title: 'SHOP MEN', image: '/muscular-man-wearing-black-tactical-t-shirt-gym.jpg' },
            {
              title: 'SHOP ACCESSORIES',
              image: '/black-sports-duffel-bag-gym-bag-modern-design.jpg',
            },
          ].map((category, index) => (
            <Link
              to="/products"
              key={index}
              className="group cursor-pointer relative overflow-hidden block"
            >
              <div className="aspect-[4/5] relative">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
                <div className="absolute bottom-6 left-6">
                  <h4 className="text-white font-bold text-xl">{category.title}</h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Wait There's More Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">WAIT THERE&apos;S MORE...</h3>

        <div className="flex gap-2 mb-8 flex-wrap">
          {['trending', 'swimming', 'training', 'hipps'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                activeContentTab === tab ? 'bg-black text-white' : 'bg-gray-100 text-black'
              }`}
              onClick={() => setActiveContentTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: 'WHAT LENGTH GYM SHORTS SHOULD I...',
              desc: 'For the best short length for your height, style and...',
              image: '/man-wearing-black-tactical-shorts-athletic.jpg',
            },
            {
              title: 'LEGGINGS GUIDE',
              desc: 'Stop throwing darts and find the leggings cut to best...',
              image: '/woman-wearing-gray-seamless-leggings-gym.jpg',
            },
            {
              title: 'SPORTS BRA GUIDE',
              desc: 'Find the one with high, medium and light support...',
              image: '/woman-wearing-black-sports-bra-athletic.jpg',
            },
            {
              title: "MEN'S SHORTS GUIDE",
              desc: 'A short length you need this and should fit to cut...',
              image: '/muscular-man-wearing-black-tactical-t-shirt-gym.jpg',
            },
          ].map((article, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative bg-gray-100 aspect-square mb-3 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h4 className="font-bold text-sm mb-2">{article.title}</h4>
              <p className="text-xs text-gray-500">{article.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Links */}
      <section className="py-12 px-4 max-w-7xl mx-auto border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">WOMEN&apos;S GYMWEAR</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/products" className="hover:underline">
                  Gym Leggings
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Leggings With Pockets
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  High Waisted Leggings
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Seamless Leggings
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Shorts Leggings
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Titos Leggings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">WOMEN&apos;S GYMWEAR</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/products" className="hover:underline">
                  Women&apos;s Gym Wear
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Women&apos;s Gym Wear
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Running Shorts
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  High Support Sports Bras
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Racer Back Bras
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">MEN&apos;S GYMWEAR</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/products" className="hover:underline">
                  Men&apos;s Gymwear
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Men&apos;s Gym Shorts
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Shorts with Pockets
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Gym Vests
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Sleeveless T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Gym Stringers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">ACCESSORIES</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/products" className="hover:underline">
                  Women&apos;s Gymwear
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Men&apos;s Gloves
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Workout Bags
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Gym Holds
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Caps
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Bottles
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Informational Content */}
      <section className="py-12 px-4 max-w-7xl mx-auto bg-gray-50">
        <div className="max-w-4xl">
          <h3 className="text-xl font-bold mb-4">WORKOUT CLOTHES & GYM CLOTHES</h3>
          <p className="text-sm text-gray-600 mb-6">
            Welcome to Sportzy! The worldwide leading fitness/workout clothes brand. Because
            we&apos;re not a fume of sportin; gym folks, fitness icons & aesthetics – team of gym
            workout clothes.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Practical and comfortable, our ready workout clothing just sounds it. Made %97 and
            detailed and without the normal clothes we ever to body. Because clothing and leggings
            are just some tunes we do.
          </p>

          <h4 className="font-bold mb-3">GYM CLOTHES BUILT IN THE WEIGHT ROOM</h4>
          <p className="text-sm text-gray-600 mb-6">
            The Sportzy story began at this, Ben and Looi decided setting out buying their in
            purpose understanding all the gym culture items. You&apos;ll find from leggings to gym
            clothing and accessories to supplements including more.
          </p>

          <h4 className="font-bold mb-3">ACTIVEWEAR & ATHLEISURE</h4>
          <p className="text-sm text-gray-600 mb-6">
            We aim to make that athleisure everyone wants that prevent look – no matter the sport,
            but simply ask someone to give you the support you need to perform at your best whether
            that be on the trails up a mountain or in the gym.
          </p>

          <h4 className="font-bold mb-3">MORE THAN THE BEST WORKOUT CLOTHING</h4>
          <p className="text-sm text-gray-600">
            We know that most of you aren&apos;t at the gym all the time but also in coffee&apos;s.
            So added to the other is a tribe is popular in Sportzy. It&apos;s never used but, skip
            up and Discover every way from hoodies jumpers to falling hoodies and from purpose
            specialties. We did sort of the basics. To be the best people ever team!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4 text-sm">HELP</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Delivery Information
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Returns Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Make A Return
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Submit A Fake
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">MY ACCOUNT</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/account" className="hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="hover:text-white">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">PAGES</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white">
                    Sportzy Central
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Sportzy Legacy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Student Discount
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">MORE ABOUT SPORTZY</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Investors
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Conditioning
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Training App
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Sportzy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">NEWSLETTER</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get exclusive access to new drops, events & more.
              </p>
              <div className="flex gap-2">
                <button className="bg-white text-black px-4 py-2 text-sm font-medium">
                  NO ACCOUNT
                </button>
                <button className="border border-white px-4 py-2 text-sm font-medium">
                  EMAIL SIGN UP
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400 mb-4 md:mb-0">
                © 2024 Sportzy Limited | All Rights Reserved | Site by Gym
              </p>
              <div className="flex items-center gap-4">
                <Link to="#" className="text-sm text-gray-400 hover:text-white">
                  Terms and Conditions
                </Link>
                <Link to="#" className="text-sm text-gray-400 hover:text-white">
                  Terms of Use
                </Link>
                <Link to="#" className="text-sm text-gray-400 hover:text-white">
                  Privacy Notice
                </Link>
                <Link to="#" className="text-sm text-gray-400 hover:text-white">
                  Cookie Notice
                </Link>
                <Link to="#" className="text-sm text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Link to="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
