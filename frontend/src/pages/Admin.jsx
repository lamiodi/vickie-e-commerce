import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/UiInput';
import { Label } from '@/components/ui/UiLabel';
import { Package, ShoppingCart, DollarSign, Plus, Upload, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { COMMON_COLORS } from '@/lib/colors';

const Admin = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    productsChange: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  // Variant Configuration State
  // Structure: [{ id: Date.now(), color: 'Black', sizes: ['S', 'M'], stock: 10, media: [] }]
  const [variantGroups, setVariantGroups] = useState([]);

  // Categories
  const CATEGORIES = ['Activewear', 'Bags', 'Waist Trainers', 'Gym Socks', 'Accessories'];

  const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders'),
      ]);
      setDashboardStats(statsRes.data);
      setRecentOrders(ordersRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      // Loading state removed
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper to determine if category needs sizes
  const requiresSize = (category) => {
    return ['Activewear', 'Waist Trainers', 'Gym Socks'].includes(category);
  };

  const addVariantGroup = () => {
    setVariantGroups([
      ...variantGroups,
      {
        id: Date.now(),
        color: '',
        sizes: [],
        stock: '',
        media: [],
      },
    ]);
  };

  const removeVariantGroup = (id) => {
    setVariantGroups(variantGroups.filter((v) => v.id !== id));
  };

  const updateVariantGroup = (id, field, value) => {
    setVariantGroups(variantGroups.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleMediaSelect = (id, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setVariantGroups(
        variantGroups.map((v) => (v.id === id ? { ...v, media: [...v.media, ...files] } : v))
      );
    }
  };

  const removeMedia = (groupId, fileIndex) => {
    setVariantGroups(
      variantGroups.map((v) => {
        if (v.id === groupId) {
          const newMedia = [...v.media];
          newMedia.splice(fileIndex, 1);
          return { ...v, media: newMedia };
        }
        return v;
      })
    );
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (variantGroups.length === 0) {
      toast.error('Please add at least one variant configuration');
      return;
    }

    // Validate variants
    for (const group of variantGroups) {
      if (!group.color) {
        toast.error('All variants must have a color selected');
        return;
      }
      if (requiresSize(newProduct.category) && group.sizes.length === 0) {
        toast.error(`Please select sizes for ${group.color} variant`);
        return;
      }
      if (!group.stock) {
        toast.error(`Please set stock for ${group.color} variant`);
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // 1. Create Product
      const productRes = await api.post('/admin/products', {
        ...newProduct,
        attributes: {},
      });
      const productId = productRes.data.id;

      // 2. Process Variants
      for (const group of variantGroups) {
        const sizesToCreate = requiresSize(newProduct.category) ? group.sizes : [null];
        let firstVariantId = null;

        for (const size of sizesToCreate) {
          const variantRes = await api.post(`/admin/products/${productId}/variants`, {
            size: size,
            color: group.color,
            stock: parseInt(group.stock),
            images: [], // Legacy field, empty
          });

          if (!firstVariantId) {
            firstVariantId = variantRes.data.id;
          }
        }

        // 3. Upload Media (Associated with the first variant of this color)
        if (group.media.length > 0 && firstVariantId) {
          const formData = new FormData();
          group.media.forEach((file) => {
            formData.append('media', file);
          });
          formData.append('variantId', firstVariantId);
          formData.append('altText', `${newProduct.name} - ${group.color}`);

          await api.post(`/media/products/${productId}/media`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      toast.success('Product created successfully!');

      // Reset Form
      setNewProduct({ name: '', description: '', price: '', category: '' });
      setVariantGroups([]);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard | aswbyvickie</title>
      </Helmet>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  £{dashboardStats.totalRevenue?.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
                <Package className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Product Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          required
                          placeholder="e.g. Alicia Set"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={newProduct.category}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, category: e.target.value })
                          }
                          required
                        >
                          <option value="">Select Category</option>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, description: e.target.value })
                        }
                        placeholder="Product description..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (£)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                        className="max-w-[200px]"
                      />
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Variants & Media</h3>
                        <Button type="button" onClick={addVariantGroup} variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Variant Group
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {variantGroups.map((group) => (
                          <div key={group.id} className="bg-gray-50 p-4 rounded-lg border relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                              onClick={() => removeVariantGroup(group.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Color</Label>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-2"
                                  value={group.color}
                                  onChange={(e) =>
                                    updateVariantGroup(group.id, 'color', e.target.value)
                                  }
                                >
                                  <option value="">Select Color</option>
                                  {Object.keys(COMMON_COLORS).map((color) => (
                                    <option key={color} value={color}>
                                      {color}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <Label>Stock (per size)</Label>
                                <Input
                                  type="number"
                                  className="mt-2"
                                  value={group.stock}
                                  onChange={(e) =>
                                    updateVariantGroup(group.id, 'stock', e.target.value)
                                  }
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            {requiresSize(newProduct.category) && (
                              <div className="mb-4">
                                <Label>Available Sizes</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {SIZE_OPTIONS.map((size) => (
                                    <button
                                      key={size}
                                      type="button"
                                      className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                                        group.sizes.includes(size)
                                          ? 'bg-black text-white border-black'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                      }`}
                                      onClick={() => {
                                        const newSizes = group.sizes.includes(size)
                                          ? group.sizes.filter((s) => s !== size)
                                          : [...group.sizes, size];
                                        updateVariantGroup(group.id, 'sizes', newSizes);
                                      }}
                                    >
                                      {size}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <Label>Media (Images & Videos)</Label>
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-4 mb-2">
                                  {group.media.map((file, i) => (
                                    <div
                                      key={i}
                                      className="relative group w-20 h-20 bg-gray-200 rounded-md overflow-hidden"
                                    >
                                      {file.type.startsWith('image/') ? (
                                        <img
                                          src={URL.createObjectURL(file)}
                                          alt="Preview"
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                          Video
                                        </div>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => removeMedia(group.id, i)}
                                        className="absolute top-0 right-0 p-1 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                    <Upload className="w-6 h-6 text-gray-400" />
                                    <span className="text-[10px] text-gray-500 mt-1">Add</span>
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*,video/*"
                                      className="hidden"
                                      onChange={(e) => handleMediaSelect(group.id, e)}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating Product...' : 'Create Product'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.length === 0 ? (
                      <p className="text-sm text-gray-500">No orders found.</p>
                    ) : (
                      recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex justify-between items-center border-b pb-3 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-gray-500">{order.customer?.firstName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">£{order.total}</p>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full ${
                                order.status === 'Delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'Processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
