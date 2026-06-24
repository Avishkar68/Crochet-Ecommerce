import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import Stars from "../decor/Stars.jsx";
import Floral from "../decor/Floral.jsx";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

export default function ProductCard({ p, i }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const productId = p._id || p.id;
  const wishlisted = isWishlisted(productId);

  return (
    <>
      <motion.div
        {...fade}
        transition={{ duration: 0.5, delay: i * 0.06 }}
        whileHover={{ y: -4 }}
        onClick={() => setIsDetailOpen(true)}
        className="paper rounded-3xl p-3 shadow-soft relative group cursor-pointer"
      >
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative border border-border/40">
          <img src={p.img} alt={p.name} loading="lazy" width={640} height={640} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(productId);
            }}
            className={`absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-cream/90 backdrop-blur shadow-soft hover:text-rose-dark transition ${wishlisted ? "text-rose-dark" : "text-muted-foreground"}`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose" : ""}`} />
          </button>
        </div>
        <div className="px-1 pt-3 pb-1">
          <p className="font-display text-base text-brown leading-tight">{p.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Stars count={5} />
            <span className="text-[11px] text-muted-foreground">({p.rating})</span>
          </div>
          <p className="mt-1 text-sm font-medium">₹{p.price.toFixed(2)}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(p);
            }}
            className="btn-rose w-full mt-3 !py-1.5 text-xs inline-flex items-center justify-center gap-1.5 shadow-sm font-medium"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Add to Basket
          </button>
        </div>
        <Floral className="absolute -bottom-1 -left-1 w-10 h-5 opacity-60" />
      </motion.div>

      <AnimatePresence>
        {isDetailOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailOpen(false)}
              className="fixed inset-0 bg-brown/50 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative paper rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-card z-10 text-brown overflow-hidden grid md:grid-cols-2 gap-6"
            >
              <span className="tape-sage -top-3 left-12 rotate-[2deg] opacity-80" />
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Image */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>

              {/* Right Column: Details */}
              <div className="flex flex-col justify-between py-1">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-rose-dark font-semibold bg-rose/10 px-2.5 py-1 rounded-full border border-rose/15">
                    {p.category || "Creations"}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl italic text-brown mt-3 leading-tight">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Stars count={5} />
                    <span className="text-xs text-muted-foreground">({p.rating || 0} reviews)</span>
                  </div>
                  
                  <p className="text-xl font-bold text-brown mt-3">₹{p.price.toFixed(2)}</p>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed mt-4">
                    Stitched carefully with premium organic cotton yarns. This handmade creation brings cozy warmth, custom color depth, and soft texture to any space or makes the perfect thoughtful gift for someone special.
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      addToCart(p);
                      setIsDetailOpen(false);
                    }}
                    className="btn-rose flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-soft"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Basket
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(productId);
                    }}
                    className={`p-2.5 border border-border rounded-xl hover:bg-muted transition ${
                      wishlisted ? "text-rose-dark border-rose/25 bg-rose/5" : "text-muted-foreground"
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? "fill-rose text-rose" : ""}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
