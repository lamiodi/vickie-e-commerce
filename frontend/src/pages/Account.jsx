import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/UiInput';
import { Label } from '@/components/ui/UiLabel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { getMe, meOrders } from '@/lib/auth';
import LoginForm from '@/components/LoginForm';
import {
  User,
  Package,
  Heart,
  Settings,
  MapPin,
  CreditCard,
  Eye,
  EyeOff,
  Edit2,
  DollarSign,
  Save,
  X,
  ChevronRight,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  ShoppingBag,
  LogOut,
} from 'lucide-react';

const Account = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addresses] = useState([
    {
      id: 1,
      type: 'billing',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true,
    },
    {
      id: 2,
      type: 'shipping',
      firstName: 'John',
      lastName: 'Doe',
      address: '456 Oak Avenue',
      apartment: '',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'United States',
      phone: '(555) 987-6543',
      isDefault: false,
    },
  ]);

  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      cardType: 'Visa',
      lastFour: '1234',
      expiryMonth: '12',
      expiryYear: '2025',
      cardholderName: 'John Doe',
      isDefault: true,
    },
    {
      id: 2,
      type: 'card',
      cardType: 'Mastercard',
      lastFour: '5678',
      expiryMonth: '06',
      expiryYear: '2024',
      cardholderName: 'John Doe',
      isDefault: false,
    },
    {
      id: 3,
      type: 'paypal',
      email: 'john.doe@example.com',
      isDefault: false,
    },
  ]);

  const [orders] = useState([
    {
      id: 'ORD-ABC123456',
      date: '2024-01-15',
      status: 'delivered',
      total: 189.97,
      items: [
        {
          id: 1,
          name: 'Premium Running Shoes',
          price: 129.99,
          quantity: 1,
          image:
            'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Premium%20running%20shoes%20with%20modern%20design%20and%20red%20accents&image_size=square',
          size: '9',
          color: 'Red/Black',
        },
        {
          id: 2,
          name: 'Athletic T-Shirt',
          price: 39.99,
          quantity: 1,
          image:
            'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Athletic%20t-shirt%20in%20red%20color%20with%20sporty%20design&image_size=square',
          size: 'M',
          color: 'Red',
        },
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-20',
    },
    {
      id: 'ORD-DEF789012',
      date: '2024-01-10',
      status: 'shipped',
      total: 84.98,
      items: [
        {
          id: 3,
          name: 'Sports Water Bottle',
          price: 24.99,
          quantity: 1,
          image:
            'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Sports%20water%20bottle%20with%20red%20accents%20and%20modern%20design&image_size=square',
          size: '32oz',
          color: 'Red',
        },
        {
          id: 4,
          name: 'Running Shorts',
          price: 59.99,
          quantity: 1,
          image:
            'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Running%20shorts%20in%20red%20color%20with%20athletic%20design&image_size=square',
          size: 'L',
          color: 'Red',
        },
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
      },
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-18',
    },
    {
      id: 'ORD-GHI345678',
      date: '2024-01-05',
      status: 'processing',
      total: 159.99,
      items: [
        {
          id: 5,
          name: 'Fitness Tracker',
          price: 159.99,
          quantity: 1,
          image:
            'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Fitness%20tracker%20watch%20with%20red%20band%20and%20modern%20design&image_size=square',
          size: 'One Size',
          color: 'Black/Red',
        },
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
      trackingNumber: null,
      estimatedDelivery: '2024-01-22',
    },
  ]);

  const [wishlist] = useState([
    {
      id: 6,
      name: 'Premium Yoga Mat',
      price: 79.99,
      originalPrice: 99.99,
      image:
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Premium%20yoga%20mat%20in%20red%20color%20with%20premium%20texture&image_size=square',
      rating: 4.8,
      reviews: 124,
      inStock: true,
      addedDate: '2024-01-12',
    },
    {
      id: 7,
      name: 'Wireless Earbuds',
      price: 149.99,
      originalPrice: null,
      image:
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Wireless%20earbuds%20in%20red%20color%20with%20sport%20design&image_size=square',
      rating: 4.6,
      reviews: 89,
      inStock: false,
      addedDate: '2024-01-08',
    },
    {
      id: 8,
      name: 'Gym Bag',
      price: 49.99,
      originalPrice: 69.99,
      image:
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Gym%20bag%20in%20red%20color%20with%20sporty%20design&image_size=square',
      rating: 4.4,
      reviews: 67,
      inStock: true,
      addedDate: '2024-01-03',
    },
  ]);

  const [recentlyViewed] = useState([
    {
      id: 9,
      name: 'Compression Socks',
      price: 29.99,
      image:
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Compression%20socks%20in%20red%20color%20athletic%20design&image_size=square',
      viewedDate: '2024-01-14',
    },
    {
      id: 10,
      name: 'Sports Watch',
      price: 199.99,
      image:
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Sports%20watch%20with%20red%20accents%20and%20digital%20display&image_size=square',
      viewedDate: '2024-01-13',
    },
    {
      id: 11,
      name: 'Training Shoes',
      price: 89.99,
      image:
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Training%20shoes%20in%20red%20color%20with%20modern%20design&image_size=square',
      viewedDate: '2024-01-12',
    },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        setUserData((prev) => ({
          ...prev,
          firstName: userData.name?.split(' ')[0] || '',
          lastName: userData.name?.split(' ')[1] || '',
          email: userData.email,
        }));

        // Try to fetch orders, but don't block if it fails
        try {
          await meOrders();
          // Transform backend orders to frontend format if needed
          // For now we keep using mock orders until backend returns same structure
        } catch (err) {
          console.error('Failed to fetch orders', err);
        }
      } catch {
        // Not logged in
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoading(true);
    getMe().then((userData) => {
      setUser(userData);
      setUserData((prev) => ({
        ...prev,
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ')[1] || '',
        email: userData.email,
      }));
      setIsLoading(false);
    });
  };

  const handleLogout = () => {
    setUser(null);
    window.location.reload();
  };

  const handleInputChange = useCallback((field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSaveProfile = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      dateOfBirth: '1990-01-15',
      gender: 'male',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>My Account - Vickie Ecom</title>
        <meta name="description" content="Manage your account, orders, and preferences" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-2">Manage your profile, orders, and preferences</p>
            </div>
            <Button variant="outline" className="flex items-center" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage
                      src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20male%20avatar%20with%20red%20background&image_size=square"
                      alt={userData.firstName}
                    />
                    <AvatarFallback className="bg-red-600 text-white text-xl">
                      {userData.firstName.charAt(0)}
                      {userData.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm">{userData.email}</p>
                </div>

                <Separator className="my-6" />

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                      activeTab === 'overview' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                      activeTab === 'orders' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Package className="w-4 h-4 mr-3" />
                    Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                      activeTab === 'wishlist' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Heart className="w-4 h-4 mr-3" />
                    Wishlist
                  </button>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                      activeTab === 'addresses' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mr-3" />
                    Addresses
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                      activeTab === 'payment' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mr-3" />
                    Payment Methods
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                      activeTab === 'settings' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </div>
                      {!isEditing && (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={userData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={userData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={userData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={userData.dateOfBirth}
                              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender">Gender</Label>
                            <select
                              id="gender"
                              value={userData.gender}
                              onChange={(e) => handleInputChange('gender', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <Button onClick={handleSaveProfile} className="flex items-center">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            className="flex items-center"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Full Name</p>
                            <p className="font-medium">
                              {userData.firstName} {userData.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email Address</p>
                            <p className="font-medium">{userData.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Phone Number</p>
                            <p className="font-medium">{userData.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date of Birth</p>
                            <p className="font-medium">{formatDate(userData.dateOfBirth)}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="font-medium capitalize">{userData.gender}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Package className="w-8 h-8 mx-auto mb-2 text-red-600" />
                      <p className="text-2xl font-bold">{orders.length}</p>
                      <p className="text-gray-600">Total Orders</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
                      <p className="text-2xl font-bold">{wishlist.length}</p>
                      <p className="text-gray-600">Wishlist Items</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-red-600" />
                      <p className="text-2xl font-bold">
                        {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                      </p>
                      <p className="text-gray-600">Total Spent</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Your latest purchases</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <img
                                src={order.items[0].image}
                                alt={order.items[0].name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium text-sm">{order.items[0].name}</p>
                                <p className="text-xs text-gray-600">
                                  {order.items.length > 1 &&
                                    `+${order.items.length - 1} more items`}
                                </p>
                              </div>
                            </div>
                            <p className="font-bold">{formatCurrency(order.total)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Track and manage your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-medium text-lg">{order.id}</p>
                              <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Items</p>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center space-x-3">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{item.name}</p>
                                      <p className="text-xs text-gray-600">
                                        {item.size} • {item.color} • Qty: {item.quantity}
                                      </p>
                                    </div>
                                    <p className="font-medium text-sm">
                                      {formatCurrency(item.price * item.quantity)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
                              <div className="text-sm">
                                <p>
                                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p>{order.shippingAddress.address}</p>
                                <p>
                                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                  {order.shippingAddress.zipCode}
                                </p>
                              </div>

                              {order.trackingNumber && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-600">Tracking Number</p>
                                  <p className="font-medium text-sm">{order.trackingNumber}</p>
                                </div>
                              )}

                              {order.estimatedDelivery && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                                  <p className="font-medium text-sm">
                                    {formatDate(order.estimatedDelivery)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {order.status === 'delivered' && (
                                <Button variant="outline" size="sm">
                                  Write Review
                                </Button>
                              )}
                              {order.status === 'shipped' && (
                                <Button variant="outline" size="sm">
                                  Track Order
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>My Wishlist</CardTitle>
                        <CardDescription>Your saved items</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        Add All to Cart
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-48 object-cover"
                            />
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <p className="text-white font-medium">Out of Stock</p>
                              </div>
                            )}
                            <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-2">{item.name}</h3>
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(item.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-2">({item.reviews})</span>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-bold text-lg">{formatCurrency(item.price)}</p>
                                {item.originalPrice && (
                                  <p className="text-sm text-gray-600 line-through">
                                    {formatCurrency(item.originalPrice)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Button
                                className="w-full bg-red-600 hover:bg-red-700"
                                disabled={!item.inStock}
                              >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                              <p className="text-xs text-gray-600 text-center">
                                Added {formatDate(item.addedDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {recentlyViewed.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recently Viewed</CardTitle>
                      <CardDescription>Items you&apos;ve recently looked at</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentlyViewed.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3 p-3 border rounded-lg"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="font-bold text-red-600">{formatCurrency(item.price)}</p>
                              <p className="text-xs text-gray-600">
                                Viewed {formatDate(item.viewedDate)}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Addresses</h2>
                    <p className="text-gray-600">Manage your shipping and billing addresses</p>
                  </div>
                  <Button className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-red-600" />
                            <CardTitle className="text-lg">
                              {address.type === 'billing' ? 'Billing Address' : 'Shipping Address'}
                            </CardTitle>
                          </div>
                          {address.isDefault && (
                            <Badge className="bg-green-100 text-green-800">Default</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="font-medium">
                            {address.firstName} {address.lastName}
                          </p>
                          <p>{address.address}</p>
                          {address.apartment && <p>{address.apartment}</p>}
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          {!address.isDefault && (
                            <Button variant="outline" size="sm">
                              Set as Default
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Payment Methods</h2>
                    <p className="text-gray-600">Manage your saved payment methods</p>
                  </div>
                  <Button className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <Card key={method.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {method.type === 'card' ? (
                              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold mr-4">
                                {method.cardType === 'Visa' ? 'VISA' : 'MC'}
                              </div>
                            ) : (
                              <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center text-white text-xs font-bold mr-4">
                                PP
                              </div>
                            )}
                            <div>
                              {method.type === 'card' ? (
                                <div>
                                  <p className="font-medium">
                                    {method.cardType} ending in {method.lastFour}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Expires {method.expiryMonth}/{method.expiryYear}
                                  </p>
                                  <p className="text-sm text-gray-600">{method.cardholderName}</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-medium">PayPal</p>
                                  <p className="text-sm text-gray-600">{method.email}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.isDefault && (
                              <Badge className="bg-green-100 text-green-800">Default</Badge>
                            )}
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            {!method.isDefault && (
                              <Button variant="outline" size="sm">
                                Set as Default
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={userData.currentPassword}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={userData.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={userData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <Button className="flex items-center">
                        <Save className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-600">
                            Receive updates about your orders and account
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Newsletter</p>
                          <p className="text-sm text-gray-600">
                            Receive promotional offers and new product updates
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newsletter}
                            onChange={(e) => setNewsletter(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Updates</p>
                          <p className="text-sm text-gray-600">
                            Receive text messages about order status
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={smsUpdates}
                            onChange={(e) => setSmsUpdates(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-between"
                      >
                        <span>Download Account Data</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-between"
                      >
                        <span>Request Account Deletion</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
