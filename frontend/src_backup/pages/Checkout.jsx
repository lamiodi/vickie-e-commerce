import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, ChevronLeft, ChevronRight, CreditCard, Package, Truck, User, Lock, Eye, EyeOff } from 'lucide-react';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    // Account Information
    email: '',
    password: '',
    confirmPassword: '',
    createAccount: false,
    
    // Billing Information
    billing: {
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phone: ''
    },
    
    // Shipping Information
    shipping: {
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phone: ''
    },
    
    // Shipping Method
    shippingMethod: 'standard',
    
    // Payment Information
    payment: {
      method: 'credit',
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      saveCard: false
    }
  });

  const [errors, setErrors] = useState({});
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Premium Running Shoes', price: 129.99, quantity: 1, image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Premium%20running%20shoes%20with%20modern%20design%20and%20red%20accents&image_size=square', size: '9', color: 'Red/Black' },
    { id: 2, name: 'Athletic T-Shirt', price: 39.99, quantity: 2, image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Athletic%20t-shirt%20in%20red%20color%20with%20sporty%20design&image_size=square', size: 'M', color: 'Red' },
    { id: 3, name: 'Sports Water Bottle', price: 24.99, quantity: 1, image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Sports%20water%20bottle%20with%20red%20accents%20and%20modern%20design&image_size=square', size: '32oz', color: 'Red' }
  ]);

  const promoCodes = {
    'WELCOME10': { discount: 10, type: 'percentage', description: '10% off your first order' },
    'SPORTS20': { discount: 20, type: 'fixed', description: '$20 off orders over $100' },
    'FREESHIP': { discount: 0, type: 'shipping', description: 'Free shipping' }
  };

  const shippingMethods = {
    standard: { name: 'Standard Shipping', price: 9.99, days: '5-7 business days' },
    express: { name: 'Express Shipping', price: 19.99, days: '2-3 business days' },
    overnight: { name: 'Overnight Shipping', price: 39.99, days: 'Next business day' }
  };

  const states = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.createAccount) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const billing = formData.billing;
    
    if (!billing.firstName) newErrors.firstName = 'First name is required';
    if (!billing.lastName) newErrors.lastName = 'Last name is required';
    if (!billing.address) newErrors.address = 'Address is required';
    if (!billing.city) newErrors.city = 'City is required';
    if (!billing.state) newErrors.state = 'State is required';
    if (!billing.zipCode) newErrors.zipCode = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(billing.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }
    if (!billing.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(billing.phone)) {
      newErrors.phone = 'Please enter a valid phone number (555) 123-4567';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!sameAsBilling) {
      const shipping = formData.shipping;
      if (!shipping.firstName) newErrors.shippingFirstName = 'First name is required';
      if (!shipping.lastName) newErrors.shippingLastName = 'Last name is required';
      if (!shipping.address) newErrors.shippingAddress = 'Address is required';
      if (!shipping.city) newErrors.shippingCity = 'City is required';
      if (!shipping.state) newErrors.shippingState = 'State is required';
      if (!shipping.zipCode) newErrors.shippingZipCode = 'ZIP code is required';
      if (!shipping.phone) newErrors.shippingPhone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (formData.payment.method === 'credit') {
      const payment = formData.payment;
      if (!payment.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(payment.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid card number (1234 5678 9012 3456)';
      }
      if (!payment.cardName) newErrors.cardName = 'Cardholder name is required';
      if (!payment.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
      if (!payment.expiryYear) newErrors.expiryYear = 'Expiry year is required';
      if (!payment.cvv) newErrors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(payment.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((field, value, section = null) => {
    setFormData(prev => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    
    if (errors[field] || (section && errors[section + field.charAt(0).toUpperCase() + field.slice(1)])) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (section) {
          delete newErrors[section + field.charAt(0).toUpperCase() + field.slice(1)];
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  }, [errors]);

  const handlePhoneChange = (value, section) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      const formatted = cleaned.length >= 6 
        ? `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
        : cleaned.length >= 3
        ? `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
        : cleaned;
      handleInputChange('phone', formatted, section);
    }
  };

  const handleCardNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 16) {
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      handleInputChange('cardNumber', formatted, 'payment');
    }
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code]) {
      setAppliedPromo({ code, ...promoCodes[code] });
    } else {
      setAppliedPromo(null);
      alert('Invalid promo code');
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    let shipping = shippingMethods[formData.shippingMethod].price;
    
    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        discount = subtotal * (appliedPromo.discount / 100);
      } else if (appliedPromo.type === 'fixed' && subtotal >= 100) {
        discount = appliedPromo.discount;
      } else if (appliedPromo.type === 'shipping') {
        shipping = 0;
      }
    }
    
    const tax = (subtotal - discount) * 0.08;
    const total = subtotal - discount + shipping + tax;
    
    return { subtotal, discount, shipping, tax, total };
  };

  const nextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      default:
        isValid = true;
    }
    
    if (isValid && currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const orderNum = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setOrderNumber(orderNum);
      setOrderComplete(true);
      setCurrentStep(5);
    } catch (error) {
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Helmet>
          <title>Order Confirmation - Vickie Ecom</title>
          <meta name="description" content="Your order has been confirmed" />
        </Helmet>
        
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
              <CardDescription>Thank you for your purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-2">Your order number is:</p>
              <p className="text-2xl font-bold text-red-600 mb-6">{orderNumber}</p>
              <p className="text-gray-600 mb-8">
                We've sent a confirmation email to {formData.email} with your order details and tracking information.
              </p>
              <div className="space-y-4">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Continue Shopping
                </Button>
                <Button variant="outline" className="w-full">
                  View Order Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Checkout - Vickie Ecom</title>
        <meta name="description" content="Complete your purchase" />
      </Helmet>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-24 h-1 mx-2 ${
                    currentStep > step ? 'bg-red-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Account</span>
            <span>Billing</span>
            <span>Shipping</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Enter your email address to continue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="createAccount"
                        checked={formData.createAccount}
                        onChange={(e) => handleInputChange('createAccount', e.target.checked)}
                      />
                      <Label htmlFor="createAccount">Create an account for faster checkout next time</Label>
                    </div>
                    
                    {formData.createAccount && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Label htmlFor="password">Password *</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className={errors.password ? 'border-red-500' : ''}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              className={errors.confirmPassword ? 'border-red-500' : ''}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Enter your billing address</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.billing.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value, 'billing')}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.billing.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value, 'billing')}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={formData.billing.company}
                        onChange={(e) => handleInputChange('company', e.target.value, 'billing')}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={formData.billing.address}
                        onChange={(e) => handleInputChange('address', e.target.value, 'billing')}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="apartment">Apartment, suite, etc. (Optional)</Label>
                      <Input
                        id="apartment"
                        value={formData.billing.apartment}
                        onChange={(e) => handleInputChange('apartment', e.target.value, 'billing')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.billing.city}
                        onChange={(e) => handleInputChange('city', e.target.value, 'billing')}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={formData.billing.state}
                        onValueChange={(value) => handleInputChange('state', value, 'billing')}
                      >
                        <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.code} value={state.code}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.billing.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value, 'billing')}
                        className={errors.zipCode ? 'border-red-500' : ''}
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.billing.phone}
                        onChange={(e) => handlePhoneChange(e.target.value, 'billing')}
                        placeholder="(555) 123-4567"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Method</CardTitle>
                    <CardDescription>Choose your preferred shipping option</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.shippingMethod}
                      onValueChange={(value) => handleInputChange('shippingMethod', value)}
                      className="space-y-4"
                    >
                      {Object.entries(shippingMethods).map(([key, method]) => (
                        <div key={key} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value={key} id={key} />
                          <Label htmlFor={key} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{method.name}</p>
                                <p className="text-sm text-gray-600">{method.days}</p>
                              </div>
                              <p className="font-bold">${method.price}</p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                    <CardDescription>Where should we deliver your order?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id="sameAsBilling"
                        checked={sameAsBilling}
                        onChange={(e) => setSameAsBilling(e.target.checked)}
                      />
                      <Label htmlFor="sameAsBilling">Same as billing address</Label>
                    </div>
                    
                    {!sameAsBilling && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shippingFirstName">First Name *</Label>
                          <Input
                            id="shippingFirstName"
                            value={formData.shipping.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value, 'shipping')}
                            className={errors.shippingFirstName ? 'border-red-500' : ''}
                          />
                          {errors.shippingFirstName && <p className="text-red-500 text-sm mt-1">{errors.shippingFirstName}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="shippingLastName">Last Name *</Label>
                          <Input
                            id="shippingLastName"
                            value={formData.shipping.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value, 'shipping')}
                            className={errors.shippingLastName ? 'border-red-500' : ''}
                          />
                          {errors.shippingLastName && <p className="text-red-500 text-sm mt-1">{errors.shippingLastName}</p>}
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="shippingAddress">Address *</Label>
                          <Input
                            id="shippingAddress"
                            value={formData.shipping.address}
                            onChange={(e) => handleInputChange('address', e.target.value, 'shipping')}
                            className={errors.shippingAddress ? 'border-red-500' : ''}
                          />
                          {errors.shippingAddress && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="shippingCity">City *</Label>
                          <Input
                            id="shippingCity"
                            value={formData.shipping.city}
                            onChange={(e) => handleInputChange('city', e.target.value, 'shipping')}
                            className={errors.shippingCity ? 'border-red-500' : ''}
                          />
                          {errors.shippingCity && <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="shippingState">State *</Label>
                          <Select
                            value={formData.shipping.state}
                            onValueChange={(value) => handleInputChange('state', value, 'shipping')}
                          >
                            <SelectTrigger className={errors.shippingState ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state.code} value={state.code}>
                                  {state.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.shippingState && <p className="text-red-500 text-sm mt-1">{errors.shippingState}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="shippingZipCode">ZIP Code *</Label>
                          <Input
                            id="shippingZipCode"
                            value={formData.shipping.zipCode}
                            onChange={(e) => handleInputChange('zipCode', e.target.value, 'shipping')}
                            className={errors.shippingZipCode ? 'border-red-500' : ''}
                          />
                          {errors.shippingZipCode && <p className="text-red-500 text-sm mt-1">{errors.shippingZipCode}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="shippingPhone">Phone *</Label>
                          <Input
                            id="shippingPhone"
                            value={formData.shipping.phone}
                            onChange={(e) => handlePhoneChange(e.target.value, 'shipping')}
                            placeholder="(555) 123-4567"
                            className={errors.shippingPhone ? 'border-red-500' : ''}
                          />
                          {errors.shippingPhone && <p className="text-red-500 text-sm mt-1">{errors.shippingPhone}</p>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Secure payment processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={formData.payment.method}
                      onValueChange={(value) => handleInputChange('method', value, 'payment')}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex items-center cursor-pointer">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Credit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="cursor-pointer">
                          PayPal
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.payment.method === 'credit' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.payment.cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className={errors.cardNumber ? 'border-red-500' : ''}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="cardName">Cardholder Name *</Label>
                        <Input
                          id="cardName"
                          value={formData.payment.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value, 'payment')}
                          className={errors.cardName ? 'border-red-500' : ''}
                        />
                        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiryMonth">Expiry Month *</Label>
                          <Select
                            value={formData.payment.expiryMonth}
                            onValueChange={(value) => handleInputChange('expiryMonth', value, 'payment')}
                          >
                            <SelectTrigger className={errors.expiryMonth ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                  {(i + 1).toString().padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.expiryMonth && <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="expiryYear">Expiry Year *</Label>
                          <Select
                            value={formData.payment.expiryYear}
                            onValueChange={(value) => handleInputChange('expiryYear', value, 'payment')}
                          >
                            <SelectTrigger className={errors.expiryYear ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem key={new Date().getFullYear() + i} value={(new Date().getFullYear() + i).toString()}>
                                  {(new Date().getFullYear() + i).toString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.expiryYear && <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={formData.payment.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value, 'payment')}
                            placeholder="123"
                            maxLength="4"
                            className={errors.cvv ? 'border-red-500' : ''}
                          />
                          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="saveCard"
                          checked={formData.payment.saveCard}
                          onChange={(e) => handleInputChange('saveCard', e.target.checked, 'payment')}
                        />
                        <Label htmlFor="saveCard">Save this card for future purchases</Label>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-green-600 mr-2" />
                      <p className="text-sm text-green-800">
                        Your payment information is secure and encrypted
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-8">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={currentStep === 4 ? handleSubmit : nextStep}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 flex items-center"
              >
                {isLoading ? (
                  'Processing...'
                ) : currentStep === 4 ? (
                  <>
                    Complete Order
                    <Lock className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.size} • {item.color}
                        </p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({appliedPromo.code})</span>
                      <span className="text-green-600">-${totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="promoCode">Promo Code</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                    />
                    <Button
                      onClick={applyPromoCode}
                      variant="outline"
                      size="sm"
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedPromo && (
                    <p className="text-green-600 text-sm mt-1">
                      {appliedPromo.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;