import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (variant) => {
        const items = get().items;
        const existing = items.find((i) => i.id === variant.id);
        if (existing) {
          set({ items: items.map((i) => (i.id === variant.id ? { ...i, qty: i.qty + 1 } : i)) });
        } else {
          set({ items: [...items, { ...variant, qty: 1 }] });
        }
      },
      updateQty: (id, qty) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)) }),
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart' }
  )
);
