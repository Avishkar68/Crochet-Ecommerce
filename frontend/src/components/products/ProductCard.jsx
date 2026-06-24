import React from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
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
  
  const productId = p._id || p.id;
  const wishlisted = isWishlisted(productId);

  return (
    <motion.div
      {...fade}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      whileHover={{ y: -4 }}
      className="paper rounded-3xl p-3 shadow-soft relative group"
    >
      <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative border border-border/40">
        <img src={p.img} alt={p.name} loading="lazy" width={640} height={640} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <button
          onClick={() => toggleWishlist(productId)}
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
        <button onClick={() => addToCart(p)} className="btn-rose w-full mt-3 !py-1.5 text-xs inline-flex items-center justify-center gap-1.5 shadow-sm font-medium">
          <ShoppingBag className="w-3.5 h-3.5" /> Add to Basket
        </button>
      </div>
      <Floral className="absolute -bottom-1 -left-1 w-10 h-5 opacity-60" />
    </motion.div>
  );
}
