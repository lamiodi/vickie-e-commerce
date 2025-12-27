import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Mail } from 'lucide-react';
import { api } from '@/lib/api';

import Analytics from '@/components/admin/Analytics';
import Inventory from '@/components/admin/Inventory';
import Orders from '@/components/admin/Orders';
import Customers from '@/components/admin/Customers';
import Coupons from '@/components/admin/Coupons';
import Subscribers from '@/components/admin/Subscribers';

const NavItem = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      activeTab === id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setDashboardStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Analytics stats={dashboardStats} />;
      case 'inventory':
        return <Inventory />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'subscribers':
        return <Subscribers />;
      case 'coupons':
        return <Coupons />;
      default:
        return <Analytics stats={dashboardStats} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard | aswbyvickie</title>
      </Helmet>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            id="dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavItem
            id="inventory"
            label="Inventory"
            icon={Package}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavItem
            id="orders"
            label="Orders"
            icon={ShoppingCart}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavItem
            id="customers"
            label="Customers"
            icon={Users}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavItem
            id="subscribers"
            label="Newsletter"
            icon={Mail}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavItem
            id="coupons"
            label="Coupons"
            icon={Tag}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b md:hidden">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('dashboard')} className="p-2">
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('inventory')} className="p-2">
              <Package className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('orders')} className="p-2">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
