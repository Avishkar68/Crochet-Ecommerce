import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import api from "../../lib/api.js";

export default function CheckoutModal() {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart,
    cartCount,
    cartSubtotal,
    clearCart
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = {
      name: formData.get("name"),
      email: formData.get("email"),
      address: formData.get("address"),
      items: cart,
      total: cartSubtotal,
    };

    setIsCheckingOut(true);
    try {
      const res = await api.post("/api/orders", orderData);
      const data = res.data;
      if (data.success) {
        setCheckoutSuccess(data.order);
        clearCart();
      } else {
        alert(data.error || "Failed to place order. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred during checkout.";
      alert(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCheckoutOpen(false)}
            className="fixed inset-0 bg-brown/40 backdrop-blur-xs"
          />
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="relative paper rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-card z-10 max-h-[90vh] overflow-y-auto text-brown"
          >
            <span className="tape -top-3 left-8 rotate-[-3deg]" />
            <button onClick={() => setCheckoutOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-sage mx-auto mb-4" />
                <h3 className="font-display text-2xl text-brown italic">Thank you for your order!</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Order ID: <span className="font-bold text-rose-dark">{checkoutSuccess.orderId}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  We've received your request and will start stitching soon. A confirmation email has been sent to {checkoutSuccess.email}.
                </p>
                
                <div className="border border-border/80 rounded-2xl p-4 bg-cream/40 my-6 text-left space-y-2">
                  <p className="text-xs font-semibold text-brown">Shipping Address:</p>
                  <p className="text-sm text-muted-foreground leading-snug">{checkoutSuccess.address}</p>
                  <p className="text-xs font-semibold text-brown mt-2">Order Summary:</p>
                  <div className="space-y-1">
                    {checkoutSuccess.items.map((item) => (
                      <div key={item._id || item.id} className="text-xs flex justify-between text-muted-foreground">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border/40 pt-2 flex justify-between font-bold text-xs text-brown">
                    <span>Total Paid:</span>
                    <span>₹{checkoutSuccess.total.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={() => setCheckoutOpen(false)} className="btn-sage">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl text-brown italic mb-6">Completing your order</h3>
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm transition"
                      placeholder="Emma Watson"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm transition"
                      placeholder="emma@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Shipping Address</label>
                    <textarea
                      name="address"
                      required
                      rows="3"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm transition resize-none"
                      placeholder="Street, City, Zip Code, Country"
                    />
                  </div>
                  
                  <div className="bg-cream/40 rounded-2xl p-4 border border-border/40 flex justify-between items-center text-sm my-4">
                    <div>
                      <span className="text-muted-foreground block text-xs">Total Items</span>
                      <span className="font-bold text-brown">{cartCount} items</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground block text-xs">Total Price</span>
                      <span className="font-bold text-rose-dark text-base">₹{cartSubtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCheckingOut}
                    className="btn-rose w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 shadow-md font-medium text-sm"
                  >
                    {isCheckingOut ? "Placing Order..." : `Pay ₹${cartSubtotal.toFixed(2)}`}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
