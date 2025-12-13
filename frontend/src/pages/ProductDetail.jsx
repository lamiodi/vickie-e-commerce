import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';
import { BrandLogos } from '@/components/BrandLogos';
import { ProductGallery } from '@/components/ProductGallery';
import { QuantitySelector } from '@/components/QuantitySelector';
import { ProductTabs } from '@/components/ProductTabs';
import { ProductCard } from '@/components/ProductCard';
import { HomeIcon, ChevronRightIcon } from '@/components/AppIcons';
import { useCart } from '@/lib/cart';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { getColorHex } from '@/lib/colors';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [productData, setProductData] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedProducts] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const product = response.data;
        setProductData(product);

        // Fetch media for this product
        const mediaResponse = await api.get(`/media/products/${id}/media`);
        setMedia(mediaResponse.data.media || []);

        // Process Variants to determine available colors and sizes
        // We assume backend returns variants array in product object or we fetch it?
        // Let's assume response.data includes `variants` based on seed structure.
        const variants = product.variants || [];

        // Extract unique colors
        const colors = [
          ...new Set(variants.map((v) => v.color).filter((c) => c && c !== 'Default')),
        ];

        // If colors exist, select first one
        if (colors.length > 0) {
          setSelectedColor(colors[0]);
        } else {
          setSelectedColor('Default');
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        toast.error('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // Update available sizes when color changes
  useEffect(() => {
    if (productData && productData.variants) {
      const variantsForColor = productData.variants.filter(
        (v) => v.color === selectedColor || selectedColor === 'Default'
      );
      const sizes = [...new Set(variantsForColor.map((v) => v.size).filter((s) => s))];
      setAvailableSizes(sizes);

      // Auto-select size if only one available or reset
      if (sizes.length > 0 && !sizes.includes(selectedSize)) {
        setSelectedSize(sizes[0]);
      } else if (sizes.length === 0) {
        setSelectedSize(null); // No size required/available
      }
    }
  }, [selectedColor, productData, selectedSize]);

  // Process media: prefer rich media from API, fallback to legacy images from product data
  const rawMedia =
    media.length > 0
      ? media
      : (productData?.images || []).map((url, index) => ({
          id: `legacy-${index}`,
          filePath: url,
          mediaType: 'image',
          // Try to find which color this image belongs to from variants
          variantColor:
            productData.variants?.find((v) => v.images?.includes(url))?.color || 'Default',
        }));

  // Filter media based on selected color if applicable
  // We prioritize media that matches the selected color (variantColor).
  // If no media matches the color, we show all media (fallback).
  const filteredMedia =
    rawMedia.length > 0
      ? rawMedia.filter(
          (m) => !selectedColor || selectedColor === 'Default' || m.variantColor === selectedColor
        )
      : [];

  // If filtering results in empty, and we have media, it means no media is tagged with this color.
  // In that case, we might want to show all media, OR just show nothing specific?
  // User requirement: "For each color variant, include: High-quality product images... Product videos..."
  // This implies we should show media specific to that color.
  // If none exists, showing nothing or a placeholder is correct behavior for "missing data",
  // but for UX, maybe show all?
  // Let's stick to showing only matching media if matches exist, otherwise all.
  const displayMedia = filteredMedia.length > 0 ? filteredMedia : rawMedia;

  const handleAddToCart = () => {
    if (!productData) return;

    // Validation
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addItem({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image:
        displayMedia.length > 0
          ? displayMedia[0].filePath
          : productData.video_thumbnail_url || '/placeholder.jpg',
      size: selectedSize,
      color: selectedColor === 'Default' ? null : selectedColor,
      category: productData.category,
      qty: quantity,
    });
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p>Product not found.</p>
        <Link to="/products" className="text-[#C41E3A] hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <TopBar />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-500 hover:text-[#C41E3A] transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              Home
            </Link>
            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-[#C41E3A] transition-colors">
              Products
            </Link>
            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
            <span className="font-medium truncate max-w-[200px]">{productData.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Gallery */}
          <ProductGallery media={displayMedia} productName={productData.name} />

          {/* Right Column: Product Info */}
          <div className="space-y-8">
            <div>
              {productData.badge && (
                <span
                  className={`inline-block mb-4 px-3 py-1 text-xs font-bold text-white uppercase tracking-wide ${
                    productData.badge === 'SALE' ? 'bg-red-600' : 'bg-black'
                  }`}
                >
                  {productData.badge}
                </span>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {productData.name}
              </h1>

              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(productData.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    {productData.rating || 0} ({productData.reviewsCount || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-4">
                <p className="text-2xl font-bold tracking-tight text-gray-900">
                  £{productData.price}
                </p>
                {productData.originalPrice && (
                  <p className="text-lg text-gray-400 line-through">£{productData.originalPrice}</p>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {productData.variants &&
              productData.variants.some((v) => v.color && v.color !== 'Default') && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Color: {selectedColor}</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      ...new Set(
                        productData.variants.map((v) => v.color).filter((c) => c && c !== 'Default')
                      ),
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedColor === color
                            ? 'border-black ring-2 ring-offset-2 ring-black'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: getColorHex(color) }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <button className="text-sm font-medium text-[#C41E3A] hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                                    flex items-center justify-center rounded-md border py-3 text-sm font-medium sm:flex-1
                                    ${
                                      selectedSize === size
                                        ? 'border-transparent bg-[#C41E3A] text-white hover:bg-[#A01830]'
                                        : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                                    }
                                `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <div className="w-32">
                <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#C41E3A] text-white px-8 py-3 rounded-full font-bold hover:bg-[#A01830] transition-colors flex items-center justify-center gap-2"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <ProductTabs
            description={productData.description}
            specifications={productData.specifications || []}
            reviews={productData.reviews || []}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <BrandLogos />
      <Footer />
    </main>
  );
}
