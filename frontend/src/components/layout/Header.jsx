import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Search, Heart, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import Sprig from "../decor/Sprig.jsx";

export default function Header({ onOpenCustomOrder }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setCartOpen } = useCart();
  const { wishlist } = useWishlist();

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-sage text-cream text-xs md:text-sm py-2 text-center font-medium tracking-wide">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block animate-pulse">✨</span>
          Free shipping on orders over ₹1,000
          <span className="inline-block animate-pulse">✨</span>
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center gap-4">
          <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 -ml-2 text-brown hover:text-rose-dark transition" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm text-foreground/80 font-medium">
            <a href="#shop" className="hover:text-rose-dark transition">Shop</a>
            <a href="#categories" className="hover:text-rose-dark transition">Collections</a>
            <button onClick={onOpenCustomOrder} className="hover:text-rose-dark transition text-left">Custom Orders</button>
            <a href="#maker" className="hover:text-rose-dark transition">About</a>
            <a href="#journal" className="hover:text-rose-dark transition">Journal</a>
          </nav>

          <a href="#" className="flex flex-col items-center justify-center text-center relative">
            <span className="absolute -left-6 -top-1 hidden sm:block">
              <Sprig className="w-5 h-7 opacity-70" />
            </span>
            <span className="font-display italic text-xl md:text-2xl text-brown leading-none">Stitch &amp; Bloom</span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground mt-1">Crochet</span>
          </a>

          <div className="flex items-center justify-end gap-1 md:gap-3">
            <button className="hidden md:inline-flex p-2 text-brown hover:text-rose-dark transition" aria-label="Search"><Search className="w-5 h-5" /></button>
            <button className="hidden md:inline-flex p-2 text-brown hover:text-rose-dark transition" aria-label="Account"><User className="w-5 h-5" /></button>
            <button className="hidden md:inline-flex p-2 text-brown hover:text-rose-dark transition relative" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose rounded-full" />
              )}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-brown hover:text-rose-dark transition" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose text-cream text-[10px] font-medium w-4 h-4 grid place-items-center rounded-full">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-brown/40" onClick={() => setMenuOpen(false)} />
          <motion.aside
            initial={{ x: "-100%" }} animate={{ x: 0 }}
            className="absolute left-0 top-0 bottom-0 w-72 paper p-6 shadow-card"
          >
            <button onClick={() => setMenuOpen(false)} className="ml-auto block p-2 text-brown hover:text-rose-dark" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
            <nav className="mt-4 flex flex-col gap-4 text-lg font-display">
              <a href="#shop" onClick={() => setMenuOpen(false)} className="border-b border-border/60 pb-3 text-brown">Shop</a>
              <a href="#categories" onClick={() => setMenuOpen(false)} className="border-b border-border/60 pb-3 text-brown">Collections</a>
              <button onClick={() => { setMenuOpen(false); onOpenCustomOrder(); }} className="border-b border-border/60 pb-3 text-left text-brown">Custom Orders</button>
              <a href="#maker" onClick={() => setMenuOpen(false)} className="border-b border-border/60 pb-3 text-brown">About</a>
              <a href="#journal" onClick={() => setMenuOpen(false)} className="border-b border-border/60 pb-3 text-brown">Journal</a>
            </nav>
          </motion.aside>
        </div>
      )}
    </>
  );
}
