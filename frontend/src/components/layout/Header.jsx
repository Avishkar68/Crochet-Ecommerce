import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, Search, Heart, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import Sprig from "../decor/Sprig.jsx";

export default function Header({ onOpenCustomOrder, search, setSearch }) {
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
            <Link to="/products" className="hover:text-rose-dark transition">Shop</Link>
            <Link to="/#categories" className="hover:text-rose-dark transition">Collections</Link>
            <button onClick={onOpenCustomOrder} className="hover:text-rose-dark transition text-left">Custom Orders</button>
            <Link to="/#maker" className="hover:text-rose-dark transition">About</Link>
            <Link to="/#journal" className="hover:text-rose-dark transition">Journal</Link>
          </nav>

          <Link to="/" className="flex flex-col items-center justify-center text-center relative">
            <span className="absolute -left-6 -top-1 hidden sm:block">
              <Sprig className="w-5 h-7 opacity-70" />
            </span>
            <span className="font-display italic text-xl md:text-2xl text-brown leading-none">Stitch &amp; Bloom</span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground mt-1">Crochet</span>
          </Link>

          <div className="flex items-center justify-end gap-1 md:gap-3">
            {setSearch && (
              <div className="relative mr-1 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="Search creations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 w-44 lg:w-52 rounded-2xl border border-border bg-cream/50 outline-none text-xs text-brown focus:border-rose focus:ring-1 focus:ring-rose transition"
                />
              </div>
            )}
            <Link to="/admin" className="hidden md:inline-flex p-2 text-brown hover:text-rose-dark transition" aria-label="Account"><User className="w-5 h-5" /></Link>
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
              {setSearch && (
                <div className="relative mb-2">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="Search creations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-2xl border border-border bg-cream/50 outline-none text-sm text-brown focus:border-rose focus:ring-1 focus:ring-rose transition"
                  />
                </div>
              )}
              <Link to="/products" onClick={() => setMenuOpen(false)} className="border-b border-border/60 pb-3 text-brown">Shop</Link>
              <Link to="/#categories" onClick={() => setMenuOpen(false)} className="border-b border-border/60 pb-3 text-brown">Collections</Link>
              <button onClick={() => { setMenuOpen(false); onOpenCustomOrder(); }} className="border-b border-border/60 pb-3 text-left text-brown">Custom Orders</button>
              <Link to="/#maker" onClick={() => setMenuOpen(false)} className="border-b border-border/60 pb-3 text-brown">About</Link>
              <Link to="/#journal" onClick={() => setMenuOpen(false)} className="border-b border-border/60 pb-3 text-brown">Journal</Link>
            </nav>
          </motion.aside>
        </div>
      )}
    </>
  );
}
