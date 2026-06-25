import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Trash2, Minus, Plus, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import Floral from "../decor/Floral.jsx";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    setCheckoutOpen,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartSubtotal,
    freeShippingThreshold,
    isFreeShipping,
    mobileNumber,
    syncMobileNumber,
    disconnectMobileNumber
  } = useCart();

  const [mobileInput, setMobileInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!mobileInput || mobileInput.length < 10) {
      setSyncError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSyncing(true);
    setSyncError("");
    try {
      await syncMobileNumber(mobileInput);
      setMobileInput("");
    } catch (err) {
      setSyncError("Failed to sync cart. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-brown/30 backdrop-blur-xs"
          />
          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-screen max-w-md paper border-l border-border shadow-card flex flex-col h-full"
            >
              <div className="p-6 border-b border-border/60 flex items-center justify-between">
                <h3 className="font-display text-xl text-brown flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-rose" /> Your Basket
                </h3>
                <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Sync Section */}
              <div className="px-6 py-4 bg-cream/45 border-b border-border/40 text-brown">
                {mobileNumber ? (
                  <div className="flex items-center justify-between bg-sage/10 border border-sage/20 rounded-2xl p-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase tracking-wider text-sage-dark font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                        Live Synced
                      </span>
                      <span className="text-sm font-semibold text-brown">{mobileNumber}</span>
                    </div>
                    <button
                      onClick={disconnectMobileNumber}
                      className="text-xs text-rose-dark hover:text-rose hover:underline font-semibold transition"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="bg-peach/15 border border-peach/30 rounded-2xl p-4">
                    <p className="text-xs font-bold text-brown flex items-center gap-1.5">
                      <span>📱</span> Instant Cloud Save
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      Save your basket to the cloud! Enter your mobile number to retrieve and update your cart across devices without an account.
                    </p>
                    <form onSubmit={handleMobileSubmit} className="mt-3 flex gap-2">
                      <input
                        type="tel"
                        placeholder="Mobile number"
                        value={mobileInput}
                        onChange={(e) => {
                          setMobileInput(e.target.value.replace(/\D/g, ""));
                          setSyncError("");
                        }}
                        maxLength={15}
                        required
                        className="flex-1 min-w-0 px-3.5 py-1.5 rounded-xl border border-border bg-cream outline-none text-xs focus:border-rose focus:ring-1 focus:ring-rose text-brown transition placeholder:text-muted-foreground/60"
                      />
                      <button
                        type="submit"
                        disabled={isSyncing}
                        className="btn-rose text-[11px] !py-1.5 !px-3 font-semibold shadow-sm shrink-0 disabled:opacity-60 flex items-center gap-1 cursor-pointer"
                      >
                        {isSyncing ? "Syncing..." : "Sync Basket"}
                      </button>
                    </form>
                    {syncError && (
                      <p className="text-[10px] text-rose-dark font-medium mt-1.5 pl-1">⚠️ {syncError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <Floral className="w-20 h-10 mx-auto opacity-50 mb-4" />
                    <p className="font-display italic text-lg text-brown/70">Your basket is empty</p>
                    <p className="text-sm text-muted-foreground mt-2">Let's add some cozy hand-stitched items!</p>
                    <button onClick={() => setCartOpen(false)} className="btn-sage mt-6 inline-flex items-center gap-2">
                      Start Shopping <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  cart.map((item) => {
                    const itemId = item._id || item.id;
                    return (
                      <div key={itemId} className="flex gap-4 p-3 bg-cream/50 rounded-2xl border border-border/40 relative group">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-display text-base text-brown leading-tight">{item.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                            <div className="flex items-center gap-1 bg-cream border border-border/80 rounded-full px-1.5 py-0.5 shadow-sm">
                              <button onClick={() => updateQuantity(itemId, -1)} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-semibold px-1 min-w-[16px] text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(itemId, 1)} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(itemId)} className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground hover:text-rose-dark hover:bg-rose/10 opacity-0 group-hover:opacity-100 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer details */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-border/60 bg-cream/70 backdrop-blur-xs">
                  {/* Free shipping progress */}
                  <div className="mb-4 text-center">
                    {isFreeShipping ? (
                      <p className="text-xs text-sage-dark font-medium flex items-center justify-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-sage" /> You qualified for Free Shipping!
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Add <span className="font-semibold text-rose-dark">₹{(freeShippingThreshold - cartSubtotal).toFixed(2)}</span> more to unlock free shipping!
                      </p>
                    )}
                    <div className="w-full bg-border/50 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-sage h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base text-brown font-display italic">Subtotal</span>
                    <span className="text-xl font-bold text-brown">₹{cartSubtotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="btn-rose w-full text-center py-3 flex items-center justify-center gap-2 shadow-md font-medium"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
