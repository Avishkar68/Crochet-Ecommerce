import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid,
  List,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  X,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";

// Layout components
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import MobileNav from "../components/layout/MobileNav.jsx";

// Product component
import ProductCard from "../components/products/ProductCard.jsx";
import { CardSkeleton, ListSkeleton } from "../components/decor/ThemedLoader.jsx";

// Context hooks
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

// Modals/Drawers
import CartDrawer from "../components/cart/CartDrawer.jsx";
import CheckoutModal from "../components/cart/CheckoutModal.jsx";
import CustomOrderModal from "../components/custom-order/CustomOrderModal.jsx";

// Decor assets
import Floral from "../components/decor/Floral.jsx";
import Sprig from "../components/decor/Sprig.jsx";
import Butterfly from "../components/decor/Butterfly.jsx";
import api from "../lib/api.js";

export default function Products() {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Search/Filters states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("best-sellers");
  const [layoutMode, setLayoutMode] = useState("grid"); // grid or list
  const [customOrderOpen, setCustomOrderOpen] = useState(false);

  // Fetch all products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/api/products");
      return res.data;
    }
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    "All",
    "Crochet Flowers",
    "Plush Friends",
    "Accessories",
    "Bags & Pouches",
    "Home Decor",
    "Gift Ideas"
  ];

  // Filtering logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    }
    if (sortBy === "price-high") {
      return b.price - a.price;
    }
    // 'best-sellers' uses rating count descending
    return b.rating - a.rating;
  });

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("best-sellers");
  };

  return (
    <div className="min-h-screen text-foreground pb-24 md:pb-0 relative bg-background">
      <Header onOpenCustomOrder={() => setCustomOrderOpen(true)} search={search} setSearch={setSearch} />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden py-10 md:py-14 bg-cream/30 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <Sprig className="absolute left-6 top-4 w-6 h-10 opacity-60 hidden md:block" />
          <Floral className="absolute right-12 top-4 w-20 h-10 opacity-70 hidden md:block" />

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/80 mb-3">
            <a href="/" className="hover:text-rose-dark transition">Home</a>
            <ChevronRight className="w-3 h-3 text-muted-foreground/45" />
            <span className="font-semibold text-brown">Shop Catalog</span>
          </div>

          <h2 className="font-display italic text-3xl md:text-5xl text-brown mt-2">
            The Crochet Shop
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Explore our curated catalog of beautiful, hand-woven plush toys, floral decor, and custom cozy lifestyle accessories.
          </p>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* Controls Layout */}
        <div className="paper rounded-3xl p-5 shadow-soft border border-border/40 mb-8 space-y-4">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-4">

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-cream/40 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm text-brown placeholder:text-muted-foreground/60 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75 hover:text-brown transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & Layout Toggles */}
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">

              {/* Sort Selector */}
              <div className="flex items-center gap-2 border border-border bg-cream/40 px-3 py-2 rounded-2xl">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-brown outline-none cursor-pointer"
                >
                  <option value="best-sellers">Sort: Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Layout Toggle */}
              <div className="flex items-center bg-muted/60 p-1 rounded-xl">
                <button
                  onClick={() => setLayoutMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${layoutMode === "grid"
                    ? "bg-cream text-brown shadow-soft"
                    : "text-muted-foreground hover:text-brown"
                    }`}
                  aria-label="Grid View"
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${layoutMode === "list"
                    ? "bg-cream text-brown shadow-soft"
                    : "text-muted-foreground hover:text-brown"
                    }`}
                  aria-label="List View"
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Category Filter Horizontal Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 pt-1.5 border-t border-border/40">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all shrink-0 ${selectedCategory === cat
                  ? "bg-rose text-cream border-rose shadow-soft"
                  : "border-border text-muted-foreground bg-cream/20 hover:bg-cream/55 hover:text-brown"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Active Filter Badges */}
        {(selectedCategory !== "All" || search || sortBy !== "best-sellers") && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-muted-foreground mr-1">Active filters:</span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 bg-rose/10 text-rose-dark px-3 py-1 rounded-full text-xs font-medium border border-rose/15">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="hover:text-rose-dark/70">
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 bg-rose/10 text-rose-dark px-3 py-1 rounded-full text-xs font-medium border border-rose/15">
                Keyword: "{search}"
                <button onClick={() => setSearch("")} className="hover:text-rose-dark/70">
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              </span>
            )}
            {sortBy !== "best-sellers" && (
              <span className="inline-flex items-center gap-1 bg-rose/10 text-rose-dark px-3 py-1 rounded-full text-xs font-medium border border-rose/15">
                Sort: {sortBy === "price-low" ? "Price Low-High" : "Price High-Low"}
                <button onClick={() => setSortBy("best-sellers")} className="hover:text-rose-dark/70">
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-rose-dark font-medium underline transition ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Products Results List/Grid */}
        {isLoadingProducts ? (
          layoutMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <ListSkeleton key={i} />
              ))}
            </div>
          )
        ) : sortedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 paper rounded-3xl p-8 max-w-md mx-auto shadow-soft border border-border/40 text-brown"
          >
            <span className="tape-sage -top-3 left-1/2 -translate-x-1/2 rotate-[1deg]" />
            <h3 className="font-display text-xl italic mt-3">No Creations Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              We couldn't find any products matching your search criteria. Please adjust your keywords or category.
            </p>
            <button onClick={clearAllFilters} className="btn-rose mt-6 text-xs">
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {layoutMode === "grid" ? (
              // GRID LAYOUT
              <motion.div
                layout
                key="grid-layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {sortedProducts.map((p, idx) => (
                  <ProductCard key={p._id || idx} p={p} i={idx % 4} />
                ))}
              </motion.div>
            ) : (
              // LIST LAYOUT
              <motion.div
                layout
                key="list-layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 max-w-4xl mx-auto"
              >
                {sortedProducts.map((p, idx) => {
                  const productId = p._id || p.id;
                  const wishlisted = isWishlisted(productId);

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (idx % 8) * 0.05 }}
                      key={productId || idx}
                      className="flex flex-col sm:flex-row items-center gap-4 bg-cream/70 paper rounded-3xl p-4 shadow-soft relative overflow-hidden group border border-border/30 hover:border-rose/20 transition-all"
                    >
                      {/* Left: Product Image */}
                      <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-muted relative shrink-0 border border-border/40">
                        <img
                          src={p.img}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                        <button
                          onClick={() => toggleWishlist(productId)}
                          className={`absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-cream/90 backdrop-blur shadow-soft hover:text-rose-dark transition ${wishlisted ? "text-rose-dark" : "text-muted-foreground"
                            }`}
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose" : ""}`} />
                        </button>
                      </div>

                      {/* Center: Details */}
                      <div className="flex-1 text-center sm:text-left py-2">
                        <span className="text-[9px] uppercase tracking-wider text-rose-dark font-semibold bg-rose/10 px-2.5 py-1 rounded-full border border-rose/15">
                          {p.category}
                        </span>
                        <h4 className="font-display text-lg md:text-xl text-brown mt-2.5 leading-tight">
                          {p.name}
                        </h4>
                        <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, idxStars) => (
                            <Heart
                              key={idxStars}
                              className={`w-3.5 h-3.5 ${idxStars < 5 ? "fill-rose text-rose" : "text-muted-foreground/30"
                                }`}
                            />
                          ))}
                          <span className="text-[11px] text-muted-foreground ml-1">
                            ({p.rating || 0})
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="text-center sm:text-right shrink-0 flex flex-col items-center sm:items-end gap-2 pr-2">
                        <p className="text-lg font-bold text-brown">₹{p.price.toFixed(2)}</p>
                        <button
                          onClick={() => addToCart(p)}
                          className="btn-rose text-xs !py-2 !px-4 flex items-center gap-1.5 font-medium shadow-sm transition-all hover:scale-[1.02]"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Basket
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </main>

      <Footer />
      <MobileNav />

      {/* Sidebar Cart Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal />

      {/* Custom Order Request Modal */}
      <CustomOrderModal open={customOrderOpen} onClose={() => setCustomOrderOpen(false)} />
    </div>
  );
}
