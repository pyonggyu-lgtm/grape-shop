import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, weight: number) => void;
  updateQuantity: (productId: string, weight: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.weight === item.weight
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId && i.weight === item.weight
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (productId, weight) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.weight === weight)
          ),
        })),

      updateQuantity: (productId, weight, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.weight === weight ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      totalCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'grape-shop-cart' }
  )
);
