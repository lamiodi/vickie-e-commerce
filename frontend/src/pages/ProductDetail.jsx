import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BrandLogos } from '@/components/BrandLogos';
import { ProductGallery } from '@/components/ProductGallery';
import { QuantitySelector } from '@/components/QuantitySelector';
import { SizeSelector } from '@/components/SizeSelector';
import { ColorSelector } from '@/components/ColorSelector';
import { ProductTabs } from '@/components/ProductTabs';
import { ProductCard } from '@/components/ProductCard';
import {
  HomeIcon,
  ChevronRightIcon,
  HeartIcon,
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  GlobeIcon,
} from '@/components/Icons';
import { useCart } from '@/lib/cart';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        // Adjust endpoint as needed
        const response = await api.get(`/products/${id}`);
        setProductData(response.data);

        // Set default selections if available
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
        if (response.data.colors && response.data.colors.length > 0) {
          setSelectedColor(response.data.colors[0].name);
        }

        // Fetch related products (optional, could be part of product response or separate)
        // const relatedResponse = await api.get(`/products/${id}/related`)
        // setRelatedProducts(relatedResponse.data)
        // For now, leaving related products empty or mock if API not ready
        setRelatedProducts([]);
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

  const handleAddToCart = () => {
    if (!productData) return;

    addItem({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.images ? productData.images[0] : '/placeholder.svg',
      size: selectedSize,
      color: selectedColor,
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
          <ProductGallery images={productData.images || []} productName={productData.name} />

          {/* Right Column: Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(productData.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({productData.reviewCount || 0} reviews)
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-green-600 font-medium">
                  {productData.availability || 'In Stock'}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-[#C41E3A]">
                  $
                  {typeof productData.price === 'number'
                    ? productData.price.toFixed(2)
                    : productData.price}
                </span>
                {productData.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    $
                    {typeof productData.originalPrice === 'number'
                      ? productData.originalPrice.toFixed(2)
                      : productData.originalPrice}
                  </span>
                )}
                {productData.discount && (
                  <span className="bg-red-100 text-[#C41E3A] text-xs font-bold px-2 py-1 rounded">
                    {productData.discount}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">{productData.description}</p>

              {/* Selectors */}
              <div className="space-y-6 mb-8">
                {productData.sizes && productData.sizes.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Size: {selectedSize}</span>
                      <button className="text-sm text-[#C41E3A] underline">Size Guide</button>
                    </div>
                    <SizeSelector
                      sizes={productData.sizes}
                      selectedSize={selectedSize}
                      onSizeChange={setSelectedSize}
                    />
                  </div>
                )}

                {productData.colors && productData.colors.length > 0 && (
                  <div>
                    <span className="font-medium block mb-2">Color: {selectedColor}</span>
                    <ColorSelector
                      colors={productData.colors}
                      selectedColor={selectedColor}
                      onColorChange={setSelectedColor}
                    />
                  </div>
                )}

                <div>
                  <span className="font-medium block mb-2">Quantity</span>
                  <div className="flex items-center gap-4">
                    <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
                    <span className="text-sm text-gray-500">{productData.sku}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#C41E3A] hover:bg-[#a3182f] text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  ADD TO CART
                </button>
                <button className="w-14 h-14 border border-gray-300 rounded-lg flex items-center justify-center hover:border-[#C41E3A] hover:text-[#C41E3A] transition-colors">
                  <HeartIcon className="w-6 h-6" />
                </button>
                <button className="w-14 h-14 border border-gray-300 rounded-lg flex items-center justify-center hover:border-[#C41E3A] hover:text-[#C41E3A] transition-colors">
                  <ShareIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TruckIcon className="w-5 h-5 text-[#C41E3A]" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-[#C41E3A]" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GlobeIcon className="w-5 h-5 text-[#C41E3A]" />
                  <span>Worldwide Delivery</span>
                </div>
              </div>
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
