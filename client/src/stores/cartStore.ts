import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartStoreActionsType, CartStoreStateType } from "@/types";
import useAuthStore from "./authStore";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,

      addToCart: (product) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (p) =>
              p.id === product.id &&
              p.selectedSize === product.selectedSize &&
              p.selectedColor === product.selectedColor
          );

          if (existingIndex !== -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex].quantity += product.quantity || 1;
            return { cart: updatedCart };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: product.quantity || 1,
                selectedSize: product.selectedSize,
                selectedColor: product.selectedColor,
              },
            ],
          };
        }),

      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter(
            (p) =>
              !(
                p.id === product.id &&
                p.selectedSize === product.selectedSize &&
                p.selectedColor === product.selectedColor
              )
          ),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart", // this key will be dynamically modified
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    }
  )
);

// Custom hook to use per-user cart key
export const useUserCart = () => {
  const { user } = useAuthStore();
  const store = useCartStore();

  const key = user ? `cart_${user}` : "cart_guest";

  // When user changes, migrate data if necessary
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem(key);
    if (savedCart && !store.hasHydrated) {
      try {
        const parsed = JSON.parse(savedCart);
        if (parsed.state?.cart) {
          store.cart = parsed.state.cart;
        }
      } catch {}
    }
  }

  return store;
};

export default useCartStore;
