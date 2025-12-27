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
import { HomeIcon, ChevronRightIcon, HeartIcon, ShoppingCartIcon, ShareIcon, TruckIcon, ShieldCheckIcon, GlobeIcon } from '@/components/AppIcons';
import { useCart } from '@/lib/cart';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { getColorHex } from '@/lib/colors';
import Preloader from '@/components/ui/Preloader';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [productData, setProductData] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

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

        // Fetch Related Products (Recommended)
        // We can fetch from /products/recommended endpoint
        const relatedRes = await api.get('/products/recommended');
        // Filter out current product
        setRelatedProducts(relatedRes.data.filter(p => p.id !== product.id).slice(0, 4));

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
        } else if (product.color && product.color !== 'Default') {
            setSelectedColor(product.color);
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
  // We strictly use `media` from the new `product_media` table now.
  const rawMedia = media;

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

    const parsePrice = (price) => {
      if (typeof price === 'number') return price;
      if (typeof price === 'string') {
        // Remove currency symbols ($, £) and commas, then parse
        return parseFloat(price.replace(/[^\d.-]/g, ''));
      }
      return 0;
    };

    addItem({
      id: productData.id,
      name: productData.name,
      price: parsePrice(productData.price),
      image:
        displayMedia.length > 0
          ? displayMedia[0].filePath
          : productData.image || '/placeholder.jpg',
      size: selectedSize,
      color: selectedColor === 'Default' ? null : selectedColor,
      category: productData.category,
      qty: quantity,
    });
    toast.success('Added to cart');
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${productData?.name} on Vickie Ecom!`;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}&media=${encodeURIComponent(displayMedia[0]?.filePath || '')}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) return <Preloader />;

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
    <div className="min-h-screen bg-white">
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
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex-1 mr-4">
                  {productData.name}
                </h1>
                <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:border-[#C41E3A] hover:text-[#C41E3A] transition-colors flex-shrink-0">
                  <HeartIcon className="w-5 h-5" />
                </button>
              </div>

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
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Color: {selectedColor}</h3>
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
                  <h3 className="text-sm font-semibold text-gray-900">Size</h3>
                  <button 
                    className="text-sm font-medium text-[#C41E3A] hover:underline"
                    onClick={() => setIsSizeGuideOpen(true)}
                  >
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
                <ShoppingCartIcon className="w-5 h-5" />
                ADD TO CART
              </button>
            </div>

            {/* Buy Now */}
            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-full mb-6 transition-colors">
              Buy Now
            </button>

            {/* Share */}
            <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
              <span className="text-sm text-gray-500">Share:</span>
              <div className="flex gap-2">
                {/* Facebook */}
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#C41E3A] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </button>
                {/* Twitter */}
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#C41E3A] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.19 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </button>
                {/* Pinterest */}
                <button
                  onClick={() => handleShare('pinterest')}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#C41E3A] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 2.535c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <TruckIcon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <ShieldCheckIcon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
              <div className="text-center">
                <GlobeIcon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Worldwide Delivery</p>
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

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsSizeGuideOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Size Guide</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Size</th>
                    <th className="px-6 py-3">Chest (in)</th>
                    <th className="px-6 py-3">Waist (in)</th>
                    <th className="px-6 py-3">Hips (in)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">XS</td>
                    <td className="px-6 py-4">31-33</td>
                    <td className="px-6 py-4">23-25</td>
                    <td className="px-6 py-4">33-35</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">S</td>
                    <td className="px-6 py-4">34-36</td>
                    <td className="px-6 py-4">26-28</td>
                    <td className="px-6 py-4">36-38</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">M</td>
                    <td className="px-6 py-4">37-39</td>
                    <td className="px-6 py-4">29-31</td>
                    <td className="px-6 py-4">39-41</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">L</td>
                    <td className="px-6 py-4">40-42</td>
                    <td className="px-6 py-4">32-34</td>
                    <td className="px-6 py-4">42-44</td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">XL</td>
                    <td className="px-6 py-4">43-45</td>
                    <td className="px-6 py-4">35-37</td>
                    <td className="px-6 py-4">45-47</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-xs text-gray-500 text-center">
              Measurements are in inches. Use a tape measure for accurate sizing.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
