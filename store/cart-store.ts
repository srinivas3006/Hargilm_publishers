import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (book, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.book._id === book._id);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.book._id === book._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { book, quantity }] });
        }
      },
      
      removeItem: (bookId) => {
        set({ items: get().items.filter((item) => item.book._id !== bookId) });
      },
      
      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.book._id === bookId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.book.discountPrice || item.book.price;
          return total + price * item.quantity;
        }, 0);
      },
      
      getTax: () => {
        return get().getSubtotal() * 0.05; // 5% GST
      },
      
      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 499 ? 0 : 40;
      },
      
      getTotal: () => {
        return get().getSubtotal() + get().getTax() + get().getShipping();
      },
      
      itemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'harglim-cart',
    }
  )
);
