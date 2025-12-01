import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';
export default function Success() {
  const [sp] = useSearchParams();
  const id = sp.get('orderId');
  const { data } = useQuery({
    queryKey: ['order', id],
    enabled: !!id,
    queryFn: async () => (await api.get(`/orders/${id}`)).data,
  });
  return (
    <div className="p-6">
      <div className="text-xl mb-2">Payment successful</div>
      {data && (
        <div>
          <div>Order #{data.id}</div>
          <div>Status: {data.status}</div>
          <div>Total: ${data.total_amount}</div>
        </div>
      )}
    </div>
  );
}
