import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Section from "../components/ui/Section.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { Field, TextInput, Select } from "../components/ui/Field.jsx";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cartNotification, setCartNotification] = useState(null);

  const productsPerPage = 12;
  const maxPrice = 1000;

  const categories = [
    "All Categories",
    "Waist Trainers",
    "Joggers", 
    "Gymwear",
    "Sports Bras",
    "Leggings",
    "Tops",
    "Accessories"
  ];

  const brands = ["Nike", "Adidas", "Under Armour", "Puma", "Reebok", "New Balance"];
  const colors = ["Black", "White", "Gray", "Navy", "Pink", "Purple", "Blue", "Red"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const params = useMemo(() => ({
    q: searchQuery,
    category: selectedCategory === "All Categories" ? "" : selectedCategory,
    min: priceRange[0],
    max: priceRange[1],
    sort: sortBy,
    page: currentPage,
    limit: productsPerPage,
    brands: selectedBrands.join(","),
    colors: selectedColors.join(","),
    sizes: selectedSizes.join(",")
  }), [searchQuery, selectedCategory, priceRange, sortBy, currentPage, selectedBrands, selectedColors, selectedSizes]);

  const { data: productsData, isLoading, error, refetch } = useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await api.get("/products", { params });
      return response.data;
    },
    keepPreviousData: true
  });

  const handleAddToCart = useCallback((product) => {
    setCartNotification(`${product.name} added to cart!`);
    setTimeout(() => setCartNotification(null), 3000);
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    setCurrentPage(1);
    switch (filterType) {
      case "category":
        setSelectedCategory(value);
        break;
      case "price":
        setPriceRange(value);
        break;
      case "sort":
        setSortBy(value);
        break;
      case "brand":
        setSelectedBrands(prev => 
          prev.includes(value) ? prev.filter(b => b !== value) : [...prev, value]
        );
        break;
      case "color":
        setSelectedColors(prev => 
          prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
        );
        break;
      case "size":
        setSelectedSizes(prev => 
          prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        );
        break;
    }
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setPriceRange([0, maxPrice]);
    setSortBy("newest");
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory && selectedCategory !== "All Categories") count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (selectedSizes.length > 0) count += selectedSizes.length;
    return count;
  }, [searchQuery, selectedCategory, priceRange, selectedBrands, selectedColors, selectedSizes]);

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

  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Helmet>
          <title>Products | Sporty</title>
          <meta name="description" content="Explore our comprehensive collection of fitness apparel and accessories with advanced filtering and search capabilities" />
          <meta name="keywords" content="fitness apparel, workout gear, gym clothes, sports accessories, athletic wear" />
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Helmet>
          <title>Products | Sporty</title>
          <meta name="description" content="Explore our comprehensive collection of fitness apparel and accessories with advanced filtering and search capabilities" />
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
            <p className="text-gray-600 mb-4">We're having trouble loading our products. Please try again.</p>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Products | Sporty</title>
        <meta name="description" content="Explore our comprehensive collection of fitness apparel and accessories with advanced filtering and search capabilities" />
        <meta name="keywords" content="fitness apparel, workout gear, gym clothes, sports accessories, athletic wear" />
        <meta property="og:title" content="Products | Sporty" />
        <meta property="og:description" content="Discover premium fitness apparel and accessories with our advanced filtering system" />
        <meta property="og:type" content="website" />
      </Helmet>

      {cartNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {cartNotification}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Section title="Shop Products">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Field label="Search Products" id="search">
                    <div className="relative">
                      <TextInput
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, description, or brand..."
                        className="pl-10"
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </Field>
                </div>
                <div className="flex gap-2 items-end">
                  <Button type="submit" variant="primary">Search</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="relative"
                  >
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Active Filters ({activeFiltersCount})</span>
                  <Button
                    variant="link"
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery("")} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  )}
                  {selectedCategory !== "All Categories" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory("All Categories")} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  )}
                  {selectedBrands.map(brand => (
                    <span key={brand} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Brand: {brand}
                      <button onClick={() => handleFilterChange("brand", brand)} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  ))}
                  {selectedColors.map(color => (
                    <span key={color} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Color: {color}
                      <button onClick={() => handleFilterChange("color", color)} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  ))}
                  {selectedSizes.map(size => (
                    <span key={size} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Size: {size}
                      <button onClick={() => handleFilterChange("size", size)} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Filters Panel */}
            {isFilterOpen && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[0]}
                        onChange={(e) => handleFilterChange("price", [Number(e.target.value), priceRange[1]])}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => handleFilterChange("price", [priceRange[0], Number(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brands</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {brands.map(brand => (
                        <label key={brand} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleFilterChange("brand", brand)}
                            className="mr-2"
                          />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {colors.map(color => (
                        <label key={color} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(color)}
                            onChange={() => handleFilterChange("color", color)}
                            className="mr-2"
                          />
                          <span className="text-sm">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sort and View Options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Field label="Sort by" id="sort">
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </Field>
                <span className="text-sm text-gray-600">
                  {productsData?.total || 0} products found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                  aria-label="Grid view"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                  aria-label="List view"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {(productsData?.products || []).map((product) => (
              <div key={product.id} className={viewMode === "list" ? "bg-white rounded-lg shadow-sm overflow-hidden flex" : ""}>
                <Link 
                  to={`/products/${product.id}`} 
                  className={viewMode === "list" ? "flex-shrink-0 w-48" : "block"}
                >
                  <Card className={viewMode === "list" ? "h-full border-0 shadow-none" : ""}>
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className={`${viewMode === "list" ? "w-full h-48 object-cover" : "w-full h-64 object-cover mb-4 rounded-t-lg"}`}
                      />
                    )}
                    <div className={viewMode === "list" ? "p-6 flex-1" : "p-4"}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      {product.rating && (
                        <StarRating rating={product.rating} reviews={product.reviewCount} />
                      )}
                      {viewMode === "list" && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Category:</strong> {product.category}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Brand:</strong> {product.brand}
                          </p>
                          {product.inStock ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
                {viewMode === "list" && (
                  <div className="p-6 border-l border-gray-200 flex flex-col justify-center">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="mb-2"
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button variant="secondary" size="sm">
                      Add to Wishlist
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {productsData?.products?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
              <Button onClick={clearAllFilters}>Clear All Filters</Button>
            </div>
          )}

          {/* Pagination */}
          {productsData?.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="secondary"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, productsData.totalPages) }, (_, i) => {
                    let pageNum;
                    if (productsData.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= productsData.totalPages - 2) {
                      pageNum = productsData.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        variant={currentPage === pageNum ? "primary" : "secondary"}
                        className="min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === productsData.totalPages}
                  variant="secondary"
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}