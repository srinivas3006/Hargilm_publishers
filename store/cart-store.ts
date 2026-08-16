import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Book {
  _id: string;
  title: string;
  slug: string;
  author: { _id: string; name: string; email?: string } | string;
  category: { _id: string; name: string; slug: string } | string;
  description: string;
  coverImage: string;
  price: number;
  discountPrice?: number;
  format: string;
  rating?: number;
  totalReviews?: number;
  totalSales?: number;
  isBestseller?: boolean;
  isNewRelease?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  itemCount: () => number;
}

const SHIPPING_THRESHOLD = 499;
const SHIPPING_FEE = 50;
const TAX_RATE = 0.05; // 5% GST

export const useCartStore = create<CartState>()(
  persist(
    (set: any, get: any): CartState => ({
      items: [],
      
      addItem: (book: Book, quantity: number = 1) => {
        set((state: CartState) => {
          const existingItem = state.items.find((item: CartItem) => item.book._id === book._id);
          if (existingItem) {
            return {
              items: state.items.map((item: CartItem) =>
                item.book._id === book._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return { items: [...state.items, { book, quantity }] };
        });
      },
      
      removeItem: (bookId: string) => {
        set((state: CartState) => ({
          items: state.items.filter((item: CartItem) => item.book._id !== bookId)
        }));
      },
      
      updateQuantity: (bookId: string, quantity: number) => {
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.book._id === bookId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total: number, item: CartItem) => {
          const price = item.book.discountPrice || (item.book as any).mrp || item.book.price;
          return total + (price * item.quantity);
        }, 0);
      },
      
      getTax: () => {
        const subtotal = get().getSubtotal();
        return parseFloat((subtotal * TAX_RATE).toFixed(2));
      },
      
      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
      },
      
      getTotal: () => {
        const totalAmount = get().getSubtotal() + get().getTax() + get().getShipping();
        return parseFloat(totalAmount.toFixed(2));
      },
      
      itemCount: () => {
        return get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
