import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";
import toast from "react-hot-toast";

interface CartItem extends Product {
  offer: number;
  price: number;
  quantity: number;
  selectedSize?: { name: string, value: string }; // Updated to handle size name and value
}

interface CartStore {
  items: CartItem[]; // Each item has a quantity and optional size
  addItem: (data: Product, selectedSize?: { name: string, value: string }) => void;
  reduceItem: (id: string, selectedSize?: { name: string, value: string }) => void;
  removeItem: (id: string, selectedSize?: { name: string, value: string }) => void;
  removeAll: () => void;
  getItemQuantity: (id: string, selectedSize?: { name: string, value: string }) => number;
  getItemSelectedSize: (id: string) => { name: string, value: string } | undefined;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product, selectedSize?: { name: string, value: string }) => {
        console.log("Adding item:", { data, selectedSize });
        const currentItems = get().items;
        console.log("Current items:", currentItems);
        const existingItem = currentItems.find((item) => item.id === data.id && item.selectedSize?.value === selectedSize?.value);
        console.log("Existing item:", existingItem);

        if (existingItem) {
          if (existingItem.quantity < data.stock) {
            set({
              items: currentItems.map((item) =>
                item.id === data.id && item.selectedSize?.value === selectedSize?.value
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            });
            toast.success("Item quantity increased.");
          } else {
            toast.error("Maximum Item Added.");
          }
        } else {
          set({ items: [...get().items, {
            ...data, quantity: 1, selectedSize,
            offer: data.offer
          }] });
          toast.success("Item added to cart.");
        }
        console.log("Updated items:", get().items);
      },
      reduceItem: (id: string, selectedSize?: { name: string, value: string }) => {
        console.log("Reducing item quantity:", { id, selectedSize });
        const currentItems = get().items;
        console.log("Current items:", currentItems);
        const existingItem = currentItems.find((item) => item.id === id && item.selectedSize?.value === selectedSize?.value);
        console.log("Existing item:", existingItem);

        if (existingItem && existingItem.quantity > 1) {
          set({
            items: currentItems.map((item) =>
              item.id === id && item.selectedSize?.value === selectedSize?.value
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          });
        } else {
          set({ items: currentItems.filter((item) => item.id !== id || item.selectedSize?.value !== selectedSize?.value) });
          toast.success("Item removed from the cart.");
        }
        console.log("Updated items:", get().items);
      },
      removeItem: (id: string, selectedSize?: { name: string, value: string }) => {
        console.log("Removing item:", { id, selectedSize });
        set({ items: get().items.filter((item) => item.id !== id || item.selectedSize?.value !== selectedSize?.value) });
        toast.success("Item removed from the cart.");
        console.log("Updated items:", get().items);
      },
      removeAll: () => {
        console.log("Removing all items");
        set({ items: [] });
        console.log("Updated items:", get().items);
      },
      getItemQuantity: (id: string, selectedSize?: { name: string, value: string }) => {
        const item = get().items.find((item) => item.id === id && item.selectedSize?.value === selectedSize?.value);
        console.log("Getting item quantity:", { id, selectedSize, item });
        return item ? item.quantity : 0;
      },
      getItemSelectedSize: (id: string) => {
        const item = get().items.find((item) => item.id === id);
        console.log("Getting item selected size:", { id, item });
        return item?.selectedSize;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
