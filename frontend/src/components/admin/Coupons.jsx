import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/UiInput';
import { Label } from '@/components/ui/UiLabel';
import { Trash2, Plus, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '',
    max_uses: '',
    expires_at: '',
  });

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/admin/coupons');
      setCoupons(res.data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/coupons', newCoupon);
      toast.success('Coupon created successfully');
      setNewCoupon({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: '',
        max_uses: '',
        expires_at: '',
      });
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      toast.success('Coupon deleted');
      setCoupons(coupons.filter((c) => c.id !== id));
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Coupon</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div>
              <Label>Code</Label>
              <Input
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
                required
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newCoupon.discount_type}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (£)</option>
              </select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                type="number"
                value={newCoupon.discount_value}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: e.target.value })}
                placeholder="10"
                required
              />
            </div>
            <div>
              <Label>Min Order (£)</Label>
              <Input
                type="number"
                value={newCoupon.min_order_amount}
                onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Max Uses</Label>
              <Input
                type="number"
                value={newCoupon.max_uses}
                onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: e.target.value })}
                placeholder="Unlimited"
              />
            </div>
            <div>
              <Label>Expires At</Label>
              <Input
                type="datetime-local"
                value={newCoupon.expires_at}
                onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" /> Create Coupon
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : coupons.length === 0 ? (
              <p className="text-gray-500">No coupons found.</p>
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Tag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold">{coupon.code}</p>
                      <p className="text-sm text-gray-500">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}% off`
                          : `£${coupon.discount_value} off`}
                        {coupon.min_order_amount > 0 && ` • Min £${coupon.min_order_amount}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm text-gray-500">
                      <p>
                        Uses: {coupon.uses_count} {coupon.max_uses ? `/ ${coupon.max_uses}` : ''}
                      </p>
                      {coupon.expires_at && (
                        <p>Exp: {new Date(coupon.expires_at).toLocaleDateString()}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Coupons;
