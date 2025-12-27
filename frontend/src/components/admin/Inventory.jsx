import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/UiInput';
import { Label } from '@/components/ui/UiLabel';
import { Plus, Upload, X, Trash2, Edit, Package, Info } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { COMMON_COLORS } from '@/lib/colors';
import ColorSelect from './ColorSelect';
import FilePreview from './FilePreview';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editingVariants, setEditingVariants] = useState({});
  const [variantEditForms, setVariantEditForms] = useState({});

  // Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    gender: 'Unisex',
  });

  const [variantGroups, setVariantGroups] = useState([]);
  const CATEGORIES = ['Activewear', 'Bags', 'Waist Trainers', 'Gym Socks', 'Accessories'];
  const GENDERS = ['Men', 'Women', 'Unisex'];
  const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products?limit=100');
      const productsWithStock = (res.data.products || []).map((p) => ({
        ...p,
        total_stock: p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0,
      }));
      setProducts(productsWithStock);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductVariants = async (productId) => {
    try {
      const res = await api.get(`/admin/products/${productId}/variants`);
      return res.data.variants || [];
    } catch (err) {
      console.error(err);
      toast.error('Failed to load variants');
      return [];
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure? This will delete the product and all its variants.')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      gender: product.gender || 'Unisex',
      description: product.description || '',
    });
  };

  const handleSaveEdit = async (productId) => {
    try {
      await api.put(`/api/admin/products/${productId}`, editForm);
      toast.success('Product updated successfully');
      setProducts(products.map((p) => (p.id === productId ? { ...p, ...editForm } : p)));
      setEditingProduct(null);
      setEditForm({});
    } catch (err) {
      toast.error('Failed to update product');
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditVariants = async (product) => {
    const variants = await fetchProductVariants(product.id);
    setEditingVariants((prev) => ({ ...prev, [product.id]: true }));
    setVariantEditForms((prev) => ({ ...prev, [product.id]: variants }));
  };

  const handleEditMediaSelect = (productId, variantId, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setVariantEditForms((prev) => ({
        ...prev,
        [productId]: prev[productId].map((v) =>
          v.id === variantId ? { ...v, newMedia: [...(v.newMedia || []), ...files] } : v
        ),
      }));
    }
  };

  const removeEditMedia = (productId, variantId, fileIndex) => {
    setVariantEditForms((prev) => ({
      ...prev,
      [productId]: prev[productId].map((v) => {
        if (v.id === variantId && v.newMedia) {
          const newMedia = [...v.newMedia];
          newMedia.splice(fileIndex, 1);
          return { ...v, newMedia };
        }
        return v;
      }),
    }));
  };

  const removeExistingMedia = (productId, variantId, imageIndex) => {
    setVariantEditForms((prev) => ({
      ...prev,
      [productId]: prev[productId].map((v) => {
        if (v.id === variantId && v.images) {
          const updatedImages = [...v.images];
          updatedImages.splice(imageIndex, 1);
          return { ...v, images: updatedImages };
        }
        return v;
      }),
    }));
  };

  const handleSaveVariants = async (productId) => {
    try {
      const variants = variantEditForms[productId] || [];
      const product = products.find((p) => p.id === productId);

      await Promise.all(
        variants.map(async (variant) => {
          await api.put(`/api/admin/products/${productId}/variants/${variant.id}`, {
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
            images: variant.images,
          });

          // Upload new media
          if (variant.newMedia && variant.newMedia.length > 0) {
            const formData = new FormData();
            variant.newMedia.forEach((file) => {
              formData.append('media', file);
            });
            formData.append('variantId', variant.id);
            formData.append('altText', `${product?.name || 'Product'} - ${variant.color}`);

            await api.post(`/api/media/products/${productId}/media`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          }
        })
      );

      toast.success('Variants updated successfully');
      setEditingVariants((prev) => ({ ...prev, [productId]: false }));
      setVariantEditForms((prev) => ({ ...prev, [productId]: [] }));
      fetchProducts(); // Refresh to show new images
    } catch (err) {
      toast.error('Failed to update variants');
      console.error(err);
    }
  };

  const handleCancelVariantEdit = (productId) => {
    setEditingVariants((prev) => ({ ...prev, [productId]: false }));
    setVariantEditForms((prev) => ({ ...prev, [productId]: [] }));
  };

  const updateVariantForm = (productId, variantId, field, value) => {
    setVariantEditForms((prev) => ({
      ...prev,
      [productId]:
        prev[productId]?.map((variant) =>
          variant.id === variantId ? { ...variant, [field]: value } : variant
        ) || [],
    }));
  };

  const requiresSize = (category) => {
    return ['Activewear', 'Waist Trainers'].includes(category);
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

      const productRes = await api.post('/api/admin/products', {
        ...newProduct,
        attributes: {},
      });
      const productId = productRes.data.id;

      for (const group of variantGroups) {
        const sizesToCreate = requiresSize(newProduct.category) ? group.sizes : [null];
        let firstVariantId = null;

        for (const size of sizesToCreate) {
          const variantRes = await api.post(`/api/admin/products/${productId}/variants`, {
            size: size,
            color: group.color,
            stock: parseInt(group.stock),
            images: [],
          });

          if (!firstVariantId) {
            firstVariantId = variantRes.data.id;
          }
        }

        if (group.media.length > 0 && firstVariantId) {
          const formData = new FormData();
          group.media.forEach((file) => {
            formData.append('media', file);
          });
          formData.append('variantId', firstVariantId);
          formData.append('altText', `${newProduct.name} - ${group.color}`);

          await api.post(`/api/media/products/${productId}/media`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      toast.success('Product created successfully!');
      setNewProduct({ name: '', description: '', price: '', category: '' });
      setVariantGroups([]);
      fetchProducts();
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Product List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <p className="text-sm text-gray-500">Manage your existing products.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500 italic">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    {editingProduct === product.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`edit-name-${product.id}`}>Product Name</Label>
                            <Input
                              id={`edit-name-${product.id}`}
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-price-${product.id}`}>Price (£)</Label>
                            <Input
                              id={`edit-price-${product.id}`}
                              type="number"
                              step="0.01"
                              value={editForm.price}
                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-category-${product.id}`}>Category</Label>
                            <select
                              id={`edit-category-${product.id}`}
                              value={editForm.category}
                              onChange={(e) =>
                                setEditForm({ ...editForm, category: e.target.value })
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor={`edit-gender-${product.id}`}>Gender</Label>
                            <select
                              id={`edit-gender-${product.id}`}
                              value={editForm.gender}
                              onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                            >
                              {GENDERS.map((g) => (
                                <option key={g} value={g}>
                                  {g}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`edit-description-${product.id}`}>Description</Label>
                          <textarea
                            id={`edit-description-${product.id}`}
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({ ...editForm, description: e.target.value })
                            }
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaveEdit(product.id)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Save
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                        <div className="mt-4">
                          <Button
                            onClick={() => handleEditVariants(product)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Manage Variants & Images
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-md">
                            <Package className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-500">
                              {product.category} • £{product.price} • {product.gender || 'Unisex'}
                            </p>
                            {product.description && (
                              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                            )}
                            <p className="text-sm text-blue-600 mt-1 font-medium">
                              Total Stock: {product.total_stock || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditVariants(product)}
                            className="text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                            title="Manage Variants & Images"
                          >
                            <Package className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Variant Editing Modal */}
            {Object.keys(editingVariants).map(
              (productId) =>
                editingVariants[productId] && (
                  <div
                    key={productId}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  >
                    <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto m-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Edit Variants</h3>
                        <Button
                          onClick={() => handleCancelVariantEdit(productId)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {variantEditForms[productId]?.map((variant, index) => (
                          <div key={variant.id} className="border rounded-lg p-4 bg-gray-50">
                            <h4 className="font-medium mb-3">Variant {index + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label>Color</Label>
                                <Input
                                  value={variant.color}
                                  onChange={(e) =>
                                    updateVariantForm(
                                      productId,
                                      variant.id,
                                      'color',
                                      e.target.value
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Size</Label>
                                <Input
                                  value={variant.size || ''}
                                  onChange={(e) =>
                                    updateVariantForm(productId, variant.id, 'size', e.target.value)
                                  }
                                  className="mt-1"
                                  placeholder="No size"
                                />
                              </div>
                              <div>
                                <Label>Stock Quantity</Label>
                                <Input
                                  type="number"
                                  value={variant.stock}
                                  onChange={(e) =>
                                    updateVariantForm(
                                      productId,
                                      variant.id,
                                      'stock',
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="mt-4">
                              <Label>Images</Label>
                              <div className="mt-2 space-y-2">
                                {/* Existing Images */}
                                {variant.images && variant.images.length > 0 && (
                                  <div className="flex gap-2 overflow-x-auto pb-2">
                                    {variant.images.map((img, i) => (
                                      <div
                                        key={i}
                                        className="relative w-16 h-16 flex-shrink-0 group"
                                      >
                                        <img
                                          src={img}
                                          alt=""
                                          className="w-full h-full object-cover rounded"
                                        />
                                        <button
                                          onClick={() =>
                                            removeExistingMedia(productId, variant.id, i)
                                          }
                                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* New Images Preview */}
                                {variant.newMedia && variant.newMedia.length > 0 && (
                                  <div className="flex gap-2 overflow-x-auto pb-2">
                                    {variant.newMedia.map((file, i) => (
                                      <div
                                        key={i}
                                        className="relative w-16 h-16 flex-shrink-0 group"
                                      >
                                        <FilePreview
                                          file={file}
                                          alt=""
                                          className="w-full h-full object-cover rounded"
                                        />
                                        <button
                                          onClick={() => removeEditMedia(productId, variant.id, i)}
                                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      document.getElementById(`edit-media-${variant.id}`).click()
                                    }
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Add Images
                                  </Button>
                                  <input
                                    id={`edit-media-${variant.id}`}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleEditMediaSelect(productId, variant.id, e)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button
                          onClick={() => handleSaveVariants(productId)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Save Variants
                        </Button>
                        <Button
                          onClick={() => handleCancelVariantEdit(productId)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Product Form */}
      <Card className="border-2 border-gray-100">
        <CardHeader className="bg-gray-50/50 border-b">
          <CardTitle>Add New Product</CardTitle>
          <p className="text-sm text-gray-500">
            Create a new product by filling out the details below. Group variants by color to
            organize sizes and media.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleProductSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <Info className="w-4 h-4 text-blue-500" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                    placeholder="e.g. Alicia Set"
                  />
                  <p className="text-xs text-gray-500">
                    The public name of the product as it will appear in the store.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">Determines if size selection is required.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="gender"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                    required
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">Used for filtering (Men, Women, Unisex).</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (£) <span className="text-red-500">*</span>
                </Label>
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

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe the product details, material, fit, etc..."
                />
              </div>
            </div>

            {/* Variants Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <h3 className="text-lg font-semibold">Product Variants</h3>
                </div>
                <Button type="button" onClick={addVariantGroup} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant Group
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                Add a variant group for each color. Within each color group, you can specify
                available sizes, stock levels, and upload relevant images/videos.
              </p>

              {variantGroups.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 mb-2">No variants added yet.</p>
                  <Button variant="secondary" onClick={addVariantGroup}>
                    Add your first color variant
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {variantGroups.map((group, index) => (
                    <div
                      key={group.id}
                      className="bg-white p-6 rounded-lg border shadow-sm relative space-y-6 ring-1 ring-gray-100"
                    >
                      <div className="absolute top-0 right-0 p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => removeVariantGroup(group.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <h4 className="font-medium text-gray-900 border-b pb-2">
                        Variant Group #{index + 1}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>
                            Color <span className="text-red-500">*</span>
                          </Label>
                          <p className="text-xs text-gray-500 mb-2">
                            Select the primary color for this variant.
                          </p>
                          <ColorSelect
                            value={group.color}
                            onChange={(val) => updateVariantGroup(group.id, 'color', val)}
                            colors={COMMON_COLORS}
                          />
                        </div>

                        <div>
                          <Label>
                            Stock Quantity <span className="text-red-500">*</span>
                          </Label>
                          <p className="text-xs text-gray-500 mb-2">
                            Total stock available for this color (per size if applicable).
                          </p>
                          <Input
                            type="number"
                            value={group.stock}
                            onChange={(e) => updateVariantGroup(group.id, 'stock', e.target.value)}
                            placeholder="e.g. 100"
                          />
                        </div>
                      </div>

                      {requiresSize(newProduct.category) && (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <Label>
                            Available Sizes <span className="text-red-500">*</span>
                          </Label>
                          <p className="text-xs text-gray-500 mb-3">
                            Click to select all sizes available for this color.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {SIZE_OPTIONS.map((size) => (
                              <button
                                key={size}
                                type="button"
                                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                                  group.sizes.includes(size)
                                    ? 'bg-black text-white border-black shadow-md transform scale-105'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                          {group.sizes.length === 0 && (
                            <p className="text-xs text-red-500 mt-2">
                              At least one size is required.
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <Label>Media Gallery</Label>
                        <p className="text-xs text-gray-500 mb-3">
                          Upload images and videos for the{' '}
                          <span className="font-semibold">{group.color || 'selected'}</span> color.
                          The first image will be used as the thumbnail.
                        </p>
                        <div className="mt-2 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                          <div className="flex flex-wrap gap-4">
                            {group.media.map((file, i) => (
                              <div
                                key={i}
                                className="relative group w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border shadow-sm"
                              >
                                {file.type.startsWith('image/') ? (
                                  <FilePreview
                                    file={file}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-500 bg-gray-100">
                                    <div className="bg-white p-1 rounded-full mb-1">▶️</div>
                                    Video
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeMedia(group.id, i)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center truncate">
                                  {i === 0 ? 'Main' : `#${i + 1}`}
                                </div>
                              </div>
                            ))}
                            <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                              <div className="p-2 bg-white rounded-full mb-1 group-hover:scale-110 transition-transform shadow-sm">
                                <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                              </div>
                              <span className="text-xs text-gray-500 font-medium group-hover:text-blue-600">
                                Upload
                              </span>
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
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Creating Product...
                </span>
              ) : (
                'Create Product'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
