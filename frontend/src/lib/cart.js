import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      addItem: (variant) => {
        const items = get().items;
        
        // Sanitize price before adding
        let cleanPrice = 0;
        if (typeof variant.price === 'number') {
            cleanPrice = variant.price;
        } else if (typeof variant.price === 'string') {
            cleanPrice = parseFloat(variant.price.replace(/[^\d.-]/g, ''));
        }
        if (isNaN(cleanPrice)) cleanPrice = 0;
        
        const existing = items.find((i) => i.id === variant.id);
        if (existing) {
          set({ items: items.map((i) => (i.id === variant.id ? { ...i, qty: i.qty + 1 } : i)) });
        } else {
          set({ items: [...items, { ...variant, price: cleanPrice, qty: 1 }] });
        }
      },
      updateQty: (id, qty) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)) }),
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [], coupon: null }),
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
    }),
    { name: 'cart' }
  )
);
