import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [mobileNumber, setMobileNumber] = useState(() => {
    return localStorage.getItem("mobileNumber") || "";
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Sync cart with localStorage and backend (when cart changes)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (mobileNumber) {
      api.post("/api/cart", { mobileNumber, items: cart })
        .catch((err) => console.error("Error syncing cart to backend:", err));
    }
  }, [cart, mobileNumber]);

  // Fetch latest cart from backend on mount or when mobile number is set
  useEffect(() => {
    if (mobileNumber) {
      api.get(`/api/cart/${mobileNumber}`)
        .then((res) => {
          if (res.data && res.data.success && res.data.items) {
            setCart(res.data.items);
          }
        })
        .catch((err) => console.error("Error fetching cart from backend:", err));
    }
  }, [mobileNumber]);

  const syncMobileNumber = async (number) => {
    try {
      const res = await api.get(`/api/cart/${number}`);
      let dbItems = [];
      if (res.data && res.data.success && res.data.items) {
        dbItems = res.data.items;
      }

      // Merge local cart items with database cart items
      const merged = [...dbItems];
      cart.forEach((localItem) => {
        const localId = localItem._id || localItem.id;
        const existingIdx = merged.findIndex(
          (item) => (item._id || item.id) === localId
        );
        if (existingIdx > -1) {
          merged[existingIdx].quantity += localItem.quantity;
        } else {
          merged.push(localItem);
        }
      });

      // Update local state and backend
      setCart(merged);
      setMobileNumber(number);
      localStorage.setItem("mobileNumber", number);

      // Sync merged cart to backend
      await api.post("/api/cart", { mobileNumber: number, items: merged });
      return { success: true };
    } catch (error) {
      console.error("Error syncing mobile number:", error);
      throw error;
    }
  };

  const disconnectMobileNumber = () => {
    setMobileNumber("");
    localStorage.removeItem("mobileNumber");
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const productId = product._id || product.id;
      const existing = prev.find((item) => (item._id || item.id) === productId);
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, id: productId, _id: productId, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId, amount) => {
    setCart((prev) => {
      return prev.map((item) => {
        if ((item._id || item.id) === productId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 1000;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        freeShippingThreshold,
        isFreeShipping,
        mobileNumber,
        syncMobileNumber,
        disconnectMobileNumber
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
