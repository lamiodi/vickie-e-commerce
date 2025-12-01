import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  BarChart,
  PieChart,
  Activity,
  CreditCard,
  Truck,
  UserCheck,
  UserX,
  Box,
  Archive,
  Image,
  Upload,
  Film,
  Grid,
  Move,
  EyeOff
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 125430.50,
    totalOrders: 1247,
    totalCustomers: 892,
    totalProducts: 156,
    revenueChange: 12.5,
    ordersChange: 8.3,
    customersChange: -2.1,
    productsChange: 5.7
  });

  const [chartData, setChartData] = useState([
    { name: 'Jan', revenue: 12000, orders: 45 },
    { name: 'Feb', revenue: 19000, orders: 67 },
    { name: 'Mar', revenue: 15000, orders: 52 },
    { name: 'Apr', revenue: 22000, orders: 78 },
    { name: 'May', revenue: 28000, orders: 89 },
    { name: 'Jun', revenue: 31000, orders: 95 },
    { name: 'Jul', revenue: 35000, orders: 108 }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      total: 189.99,
      status: 'completed',
      date: '2024-01-15',
      items: 3,
      payment: 'paid'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      total: 124.50,
      status: 'processing',
      date: '2024-01-15',
      items: 2,
      payment: 'paid'
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      total: 299.99,
      status: 'shipped',
      date: '2024-01-14',
      items: 5,
      payment: 'paid'
    },
    {
      id: 'ORD-004',
      customer: 'Alice Brown',
      email: 'alice@example.com',
      total: 67.25,
      status: 'pending',
      date: '2024-01-14',
      items: 1,
      payment: 'pending'
    },
    {
      id: 'ORD-005',
      customer: 'Charlie Wilson',
      email: 'charlie@example.com',
      total: 445.00,
      status: 'completed',
      date: '2024-01-13',
      items: 8,
      payment: 'paid'
    }
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium Running Shoes',
      sku: 'SHOES-001',
      price: 129.99,
      cost: 65.00,
      stock: 45,
      category: 'Footwear',
      brand: 'SportMax',
      status: 'active',
      rating: 4.8,
      reviews: 124,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Premium%20running%20shoes%20with%20modern%20design%20and%20red%20accents&image_size=square',
      sales: 234
    },
    {
      id: 2,
      name: 'Athletic T-Shirt',
      sku: 'SHIRT-002',
      price: 39.99,
      cost: 18.50,
      stock: 120,
      category: 'Apparel',
      brand: 'FitWear',
      status: 'active',
      rating: 4.6,
      reviews: 89,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Athletic%20t-shirt%20in%20red%20color%20with%20sporty%20design&image_size=square',
      sales: 456
    },
    {
      id: 3,
      name: 'Sports Water Bottle',
      sku: 'BOTTLE-003',
      price: 24.99,
      cost: 8.75,
      stock: 0,
      category: 'Accessories',
      brand: 'HydroFlex',
      status: 'out_of_stock',
      rating: 4.3,
      reviews: 67,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Sports%20water%20bottle%20with%20red%20accents%20and%20modern%20design&image_size=square',
      sales: 178
    },
    {
      id: 4,
      name: 'Fitness Tracker',
      sku: 'TRACKER-004',
      price: 159.99,
      cost: 89.00,
      stock: 25,
      category: 'Electronics',
      brand: 'TechFit',
      status: 'active',
      rating: 4.7,
      reviews: 203,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Fitness%20tracker%20watch%20with%20red%20band%20and%20modern%20design&image_size=square',
      sales: 89
    },
    {
      id: 5,
      name: 'Yoga Mat',
      sku: 'MAT-005',
      price: 49.99,
      cost: 22.00,
      stock: 67,
      category: 'Accessories',
      brand: 'ZenFit',
      status: 'active',
      rating: 4.5,
      reviews: 156,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Premium%20yoga%20mat%20in%20red%20color%20with%20premium%20texture&image_size=square',
      sales: 312
    }
  ]);

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      totalSpent: 1250.00,
      totalOrders: 12,
      status: 'active',
      joinDate: '2023-03-15',
      lastOrder: '2024-01-15',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20avatar%20with%20red%20background&image_size=square'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(555) 987-6543',
      totalSpent: 890.50,
      totalOrders: 8,
      status: 'active',
      joinDate: '2023-05-20',
      lastOrder: '2024-01-14',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20female%20avatar%20with%20red%20background&image_size=square'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '(555) 456-7890',
      totalSpent: 2100.75,
      totalOrders: 18,
      status: 'active',
      joinDate: '2022-11-10',
      lastOrder: '2024-01-13',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20avatar%20with%20red%20background&image_size=square'
    }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Footwear', products: 45, active: true },
    { id: 2, name: 'Apparel', products: 78, active: true },
    { id: 3, name: 'Accessories', products: 23, active: true },
    { id: 4, name: 'Electronics', products: 12, active: true },
    { id: 5, name: 'Equipment', products: 34, active: false }
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      product: 'Premium Running Shoes',
      customer: 'John Doe',
      rating: 5,
      comment: 'Excellent quality and very comfortable. Highly recommend!',
      date: '2024-01-15',
      status: 'approved'
    },
    {
      id: 2,
      product: 'Athletic T-Shirt',
      customer: 'Jane Smith',
      rating: 4,
      comment: 'Good fit and quality material. Fast shipping.',
      date: '2024-01-14',
      status: 'approved'
    },
    {
      id: 3,
      product: 'Sports Water Bottle',
      customer: 'Bob Johnson',
      rating: 3,
      comment: 'Average product, could be better quality.',
      date: '2024-01-13',
      status: 'pending'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'out_of_stock':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-3 h-3" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'shipped':
        return <Truck className="w-3 h-3" />;
      case 'cancelled':
        return <X className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(Math.max(filteredProducts.length, filteredCustomers.length) / itemsPerPage);

  const StatCard = ({ title, value, change, icon: Icon, changeType }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center mt-2">
              {changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          </div>
          <Icon className="w-8 h-8 text-red-600" />
        </div>
      </CardContent>
    </Card>
  );

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'categories', label: 'Categories', icon: Archive },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard - Vickie Ecom</title>
        <meta name="description" content="Admin dashboard for managing your e-commerce store" />
      </Helmet>
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-red-600">Vickie Admin</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <nav className="p-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-lg mb-2 ${
                  activeTab === item.id ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-red-600">Vickie Admin</h2>
          </div>
          <nav className="p-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg mb-2 ${
                  activeTab === item.id ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mr-4"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeTab)?.label}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20admin%20avatar%20with%20red%20background&image_size=square" />
                    <AvatarFallback className="bg-red-600 text-white">AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">Admin User</span>
                </button>
              </div>
            </div>
          </header>

          <main className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Revenue"
                    value={formatCurrency(dashboardStats.totalRevenue)}
                    change={dashboardStats.revenueChange}
                    icon={DollarSign}
                    changeType="positive"
                  />
                  <StatCard
                    title="Total Orders"
                    value={dashboardStats.totalOrders}
                    change={dashboardStats.ordersChange}
                    icon={ShoppingCart}
                    changeType="positive"
                  />
                  <StatCard
                    title="Total Customers"
                    value={dashboardStats.totalCustomers}
                    change={dashboardStats.customersChange}
                    icon={Users}
                    changeType="negative"
                  />
                  <StatCard
                    title="Total Products"
                    value={dashboardStats.totalProducts}
                    change={dashboardStats.productsChange}
                    icon={Package}
                    changeType="positive"
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>Monthly revenue trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-end justify-between">
                        {chartData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div
                              className="bg-red-600 rounded-t"
                              style={{
                                height: `${(data.revenue / Math.max(...chartData.map(d => d.revenue))) * 200}px`,
                                width: '40px'
                              }}
                            />
                            <span className="text-xs mt-2">{data.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Status</CardTitle>
                      <CardDescription>Current order distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Completed</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <span className="text-sm font-medium">65%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Processing</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                            <span className="text-sm font-medium">20%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Shipped</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                            <span className="text-sm font-medium">10%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Pending</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                              <div className="bg-gray-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                            </div>
                            <span className="text-sm font-medium">5%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest customer orders</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Order ID</th>
                            <th className="text-left p-3">Customer</th>
                            <th className="text-left p-3">Total</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Date</th>
                            <th className="text-left p-3">Items</th>
                            <th className="text-left p-3">Payment</th>
                            <th className="text-left p-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium">{order.id}</td>
                              <td className="p-3">
                                <div>
                                  <p className="font-medium">{order.customer}</p>
                                  <p className="text-sm text-gray-600">{order.email}</p>
                                </div>
                              </td>
                              <td className="p-3 font-bold">{formatCurrency(order.total)}</td>
                              <td className="p-3">
                                <Badge className={getStatusColor(order.status)}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1 capitalize">{order.status}</span>
                                </Badge>
                              </td>
                              <td className="p-3">{formatDate(order.date)}</td>
                              <td className="p-3">{order.items}</td>
                              <td className="p-3">
                                <Badge className={order.payment === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {order.payment}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-4">Product</th>
                            <th className="text-left p-4">SKU</th>
                            <th className="text-left p-4">Price</th>
                            <th className="text-left p-4">Cost</th>
                            <th className="text-left p-4">Stock</th>
                            <th className="text-left p-4">Category</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Rating</th>
                            <th className="text-left p-4">Sales</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedProducts.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-600">{product.brand}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 font-mono text-sm">{product.sku}</td>
                              <td className="p-4 font-bold">{formatCurrency(product.price)}</td>
                              <td className="p-4 text-gray-600">{formatCurrency(product.cost)}</td>
                              <td className="p-4">
                                <span className={`font-medium ${
                                  product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                  {product.stock}
                                </span>
                              </td>
                              <td className="p-4">{product.category}</td>
                              <td className="p-4">
                                <Badge className={getStatusColor(product.status)}>
                                  {product.status.replace('_', ' ')}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                  <span>{product.rating}</span>
                                  <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                                </div>
                              </td>
                              <td className="p-4 font-medium">{product.sales}</td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border rounded-lg disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 border rounded-lg ${
                            currentPage === page ? 'bg-red-600 text-white' : 'hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border rounded-lg disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Media Management</h2>
                    <p className="text-gray-600">Manage product images and videos</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Media
                    </Button>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <Button className="flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Media
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Product Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Product</CardTitle>
                    <CardDescription>Choose a product to manage its media</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.slice(0, 6).map((product) => (
                        <div
                          key={product.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedProduct === product.id
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleProductSelect(product.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{product.name}</h3>
                              <p className="text-xs text-gray-600">{product.sku}</p>
                              <Badge variant="outline" className="mt-1">
                                ${product.price}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Drag and Drop Upload Area */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Media</CardTitle>
                    <CardDescription>Drag and drop images and videos or click to browse</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                        dragOver
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Drop files here</h3>
                      <p className="text-gray-600 mb-4">
                        Support JPG, PNG, WebP images and MP4, WebM videos up to 50MB
                      </p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                        <Button variant="outline">
                          Browse Files
                        </Button>
                      </label>
                    </div>

                    {/* Upload Progress */}
                    {uploadingFiles.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="font-medium">Uploading...</h4>
                        {uploadingFiles.map((file) => (
                          <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              {file.type === 'image' ? (
                                <Image className="w-8 h-8 text-blue-500" />
                              ) : (
                                <Film className="w-8 h-8 text-purple-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{file.name}</p>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                  className="bg-red-600 h-2 rounded-full transition-all"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm text-gray-600">{file.progress}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Media Gallery */}
                {selectedProduct && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Media Gallery</CardTitle>
                      <CardDescription>Drag to reorder media files</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {mediaFiles.length === 0 ? (
                        <div className="text-center py-12">
                          <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No media files</h3>
                          <p className="text-gray-600">Upload some images or videos to get started</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {mediaFiles
                            .sort((a, b) => a.displayOrder - b.displayOrder)
                            .map((media) => (
                              <MediaPreview
                                key={media.id}
                                media={media}
                                onDelete={handleMediaDelete}
                                onMove={(draggedId, targetId) => {
                                  const draggedIndex = mediaFiles.findIndex(f => f.id === draggedId);
                                  const targetIndex = mediaFiles.findIndex(f => f.id === targetId);
                                  handleMediaReorder(draggedIndex, targetIndex);
                                }}
                              />
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-4">Customer</th>
                            <th className="text-left p-4">Email</th>
                            <th className="text-left p-4">Phone</th>
                            <th className="text-left p-4">Total Spent</th>
                            <th className="text-left p-4">Orders</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Join Date</th>
                            <th className="text-left p-4">Last Order</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedCustomers.map((customer) => (
                            <tr key={customer.id} className="border-b hover:bg-gray-50">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={customer.avatar} />
                                    <AvatarFallback className="bg-red-600 text-white">
                                      {customer.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{customer.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-gray-600">{customer.email}</td>
                              <td className="p-4 text-gray-600">{customer.phone}</td>
                              <td className="p-4 font-bold">{formatCurrency(customer.totalSpent)}</td>
                              <td className="p-4 font-medium">{customer.totalOrders}</td>
                              <td className="p-4">
                                <Badge className={getStatusColor(customer.status)}>
                                  {customer.status === 'active' ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                                  {customer.status}
                                </Badge>
                              </td>
                              <td className="p-4">{formatDate(customer.joinDate)}</td>
                              <td className="p-4">{formatDate(customer.lastOrder)}</td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-4">Order ID</th>
                            <th className="text-left p-4">Customer</th>
                            <th className="text-left p-4">Total</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Items</th>
                            <th className="text-left p-4">Payment</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium">{order.id}</td>
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{order.customer}</p>
                                  <p className="text-sm text-gray-600">{order.email}</p>
                                </div>
                              </td>
                              <td className="p-4 font-bold">{formatCurrency(order.total)}</td>
                              <td className="p-4">
                                <Badge className={getStatusColor(order.status)}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1 capitalize">{order.status}</span>
                                </Badge>
                              </td>
                              <td className="p-4">{formatDate(order.date)}</td>
                              <td className="p-4">{order.items}</td>
                              <td className="p-4">
                                <Badge className={order.payment === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {order.payment}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Categories</h2>
                    <p className="text-gray-600">Manage product categories</p>
                  </div>
                  <Button className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-4">Category</th>
                            <th className="text-left p-4">Products</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((category) => (
                            <tr key={category.id} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium">{category.name}</td>
                              <td className="p-4">{category.products}</td>
                              <td className="p-4">
                                <Badge className={getStatusColor(category.active ? 'active' : 'inactive')}>
                                  {category.active ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Product Reviews</h2>
                    <p className="text-gray-600">Manage customer reviews</p>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-4">Product</th>
                            <th className="text-left p-4">Customer</th>
                            <th className="text-left p-4">Rating</th>
                            <th className="text-left p-4">Comment</th>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reviews.map((review) => (
                            <tr key={review.id} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium">{review.product}</td>
                              <td className="p-4">{review.customer}</td>
                              <td className="p-4">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 max-w-xs">
                                <p className="text-sm truncate">{review.comment}</p>
                              </td>
                              <td className="p-4">{formatDate(review.date)}</td>
                              <td className="p-4">
                                <Badge className={getStatusColor(review.status)}>
                                  {getStatusIcon(review.status)}
                                  <span className="ml-1 capitalize">{review.status}</span>
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <button className="p-1 hover:bg-gray-100 rounded">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  {review.status === 'pending' && (
                                    <button className="p-1 hover:bg-gray-100 rounded text-green-600">
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button className="p-1 hover:bg-gray-100 rounded text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Settings</CardTitle>
                    <CardDescription>Configure your store preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input id="storeName" defaultValue="Vickie Ecom" className="max-w-md" />
                      </div>
                      <div>
                        <Label htmlFor="storeEmail">Store Email</Label>
                        <Input id="storeEmail" type="email" defaultValue="admin@vickie.com" className="max-w-md" />
                      </div>
                      <div>
                        <Label htmlFor="storePhone">Store Phone</Label>
                        <Input id="storePhone" defaultValue="(555) 123-4567" className="max-w-md" />
                      </div>
                      <div>
                        <Label htmlFor="storeAddress">Store Address</Label>
                        <Input id="storeAddress" defaultValue="123 Main Street, New York, NY 10001" className="max-w-md" />
                      </div>
                      <Button>Save Settings</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                    <CardDescription>Configure payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                          <div>
                            <p className="font-medium">Credit Card</p>
                            <p className="text-sm text-gray-600">Accept Visa, Mastercard, American Express</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-5 h-5 mr-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center text-white text-xs font-bold">PP</div>
                          <div>
                            <p className="font-medium">PayPal</p>
                            <p className="text-sm text-gray-600">Accept PayPal payments</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );

  // Media Management Functions
  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = useCallback(async (files) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (!validTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Please upload JPG, PNG, WebP images or MP4, WebM videos.`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Maximum size is 50MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    const newUploadingFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Simulate upload progress
    newUploadingFiles.forEach(file => {
      const interval = setInterval(() => {
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, progress: Math.min(f.progress + 20, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadingFiles(prev => prev.filter(f => f.id !== file.id));
        setMediaFiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: URL.createObjectURL(file.file),
          displayOrder: prev.length + 1
        }]);
      }, 1000);
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
    e.target.value = '';
  }, [handleFileUpload]);

  const handleMediaDelete = useCallback((mediaId) => {
    setMediaFiles(prev => prev.filter(file => file.id !== mediaId));
  }, []);

  const handleMediaReorder = useCallback((dragIndex, hoverIndex) => {
    setMediaFiles(prev => {
      const draggedFile = prev[dragIndex];
      const newFiles = [...prev];
      newFiles.splice(dragIndex, 1);
      newFiles.splice(hoverIndex, 0, draggedFile);
      return newFiles.map((file, index) => ({ ...file, displayOrder: index + 1 }));
    });
  }, []);

  const handleProductSelect = useCallback((productId) => {
    setSelectedProduct(productId);
    // Load media for selected product
    setMediaFiles([]);
  }, []);

  // Media Preview Component
  const MediaPreview = ({ media, onDelete, onMove }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [showVideoPreview, setShowVideoPreview] = useState(false);

    const handleDragStart = (e) => {
      setIsDragging(true);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', media.id);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      if (draggedId !== media.id) {
        onMove && onMove(draggedId, media.id);
      }
    };

    return (
      <div
        className={`relative group bg-gray-100 rounded-lg overflow-hidden cursor-move transition-all ${
          isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg'
        }`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {media.type === 'image' ? (
          <img
            src={media.url}
            alt={media.name}
            className="w-full h-32 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center relative">
            <Film className="w-12 h-12 text-gray-400" />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              Video
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all flex space-x-2">
            <button className="p-2 bg-white rounded-full hover:bg-gray-100" title="Preview">
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete && onDelete(media.id)}
              className="p-2 bg-white rounded-full hover:bg-gray-100 text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded px-2 py-1">
          <p className="text-xs font-medium truncate" title={media.name}>
            {media.name}
          </p>
          <p className="text-xs text-gray-600">
            {media.type === 'image' ? 'Image' : 'Video'} • Order: {media.displayOrder}
          </p>
        </div>
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
          <Move className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  };
};

export default Admin;