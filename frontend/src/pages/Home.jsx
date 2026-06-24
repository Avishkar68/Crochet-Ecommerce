import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Instagram, Scissors, Leaf, Package, MapPin, ArrowRight, Sparkles, Heart
} from "lucide-react";

// Layout components
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import MobileNav from "../components/layout/MobileNav.jsx";

// Product components
import ProductCard from "../components/products/ProductCard.jsx";
import { CardSkeleton } from "../components/decor/ThemedLoader.jsx";

// Modals/Drawers
import CartDrawer from "../components/cart/CartDrawer.jsx";
import CheckoutModal from "../components/cart/CheckoutModal.jsx";
import CustomOrderModal from "../components/custom-order/CustomOrderModal.jsx";

// Decor assets
import Floral from "../components/decor/Floral.jsx";
import Sprig from "../components/decor/Sprig.jsx";
import Butterfly from "../components/decor/Butterfly.jsx";
import Arrow from "../components/decor/Arrow.jsx";

const hero = "/assets/hero.jpg";
const maker = "/assets/maker.jpg";
const igGallery = [
  "/assets/ig1.jpg",
  "/assets/ig2.jpg",
  "/assets/ig3.jpg",
  "/assets/ig4.jpg",
  "/assets/ig5.jpg",
  "/assets/ig1.jpg"
];

const testimonials = [
  { text: "The tulip bouquet is absolutely beautiful! You can feel the love in every stitch. I will definitely be ordering again!", name: "Emma", tilt: -2 },
  { text: "Amazing quality and the packaging was so so thoughtful. Perfect gift for my best friend!", name: "Sarah", tilt: 1.5 },
  { text: "It's even more beautiful in person! Handmade truly makes a difference.", name: "Nadia", tilt: -1 },
];

const SectionTitle = ({ children }) => (
  <div className="flex items-center justify-center gap-3 mb-8">
    <Arrow className="w-10 h-2 rotate-180" />
    <h2 className="text-2xl md:text-3xl font-display italic">{children}</h2>
    <Arrow className="w-10 h-2" />
  </div>
);

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function Home() {
  const [customOrderOpen, setCustomOrderOpen] = useState(false);

  // Fetch data
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    }
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    }
  });

  return (
    <div className="min-h-screen text-foreground pb-24 md:pb-0">
      <Header onOpenCustomOrder={() => setCustomOrderOpen(true)} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-14 pb-16 md:pb-24 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Decorative floaters */}
          <Sprig className="absolute left-4 top-10 w-6 h-10 opacity-60 hidden md:block" />
          <Floral className="absolute right-10 top-6 w-20 h-10 opacity-70" />
          <motion.div
            className="absolute right-1/2 top-1/3 hidden md:block"
            animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Butterfly className="w-8 h-8 opacity-70" />
          </motion.div>

          {/* Left */}
          <motion.div {...fade} className="relative order-2 md:order-1 paper rounded-3xl p-6 md:p-10 shadow-soft">
            <span className="tape -top-3 left-8 rotate-[-4deg]" />
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-brown">
              Handmade<br/>with love,<br/>
              <span className="italic">made for you</span>
              <span className="text-rose"> ♡</span>
            </h1>
            <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
              Cozy crochet pieces crafted one stitch at a time to bring joy
              to your everyday. Each piece is a tiny garden, made by hand.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#shop" className="btn-sage inline-flex items-center gap-2">
                Shop Collection <Sparkles className="w-4 h-4" />
              </a>
              <button onClick={() => setCustomOrderOpen(true)} className="btn-outline-rose inline-flex items-center gap-2">
                Custom Orders <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose" />
              <span className="w-2 h-2 rounded-full bg-border" />
              <span className="w-2 h-2 rounded-full bg-border" />
            </div>
            <Floral className="absolute -bottom-3 right-6 w-24 h-10 opacity-70" />
          </motion.div>

          {/* Right */}
          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.1 }} className="order-1 md:order-2 relative">
            <div className="paper rounded-3xl overflow-hidden shadow-card relative">
              <img src={hero} alt="Crochet tulip bouquet in a basket" width={1280} height={1280} className="w-full h-[320px] md:h-[520px] object-cover" />
              <span className="tape-sage -top-3 right-10 -rotate-3" />
            </div>
            <Sprig className="absolute -right-2 -bottom-4 w-10 h-16 opacity-80" />
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle>Shop by Category</SectionTitle>
          {isLoadingCategories ? (
            <div className="text-center py-10 font-display italic text-muted-foreground">Loading collections...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
              {categories.map((c, i) => (
                <motion.a
                  key={c.name}
                  href="#shop"
                  {...fade}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group block text-center"
                >
                  <div className="paper rounded-3xl p-3 shadow-soft relative overflow-hidden transition-shadow group-hover:shadow-lift">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                      <img src={c.img} alt={c.name} loading="lazy" width={512} height={512} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <Floral className="absolute -top-1 -left-1 w-12 h-6 opacity-60" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-brown">{c.name}</p>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section id="shop" className="py-12 md:py-20 bg-cream/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle>Best Sellers</SectionTitle>
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.slice(0, 4).map((p, i) => (
                  <ProductCard key={p.name || i} p={p} i={i} />
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <Link to="/products" className="btn-outline-rose inline-flex items-center gap-2 group shadow-sm">
                  View All Products 🌸
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* MEET THE MAKER */}
      <section id="maker" className="py-12 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionTitle>Meet the maker</SectionTitle>
          <motion.div {...fade} className="relative paper rounded-3xl p-5 md:p-10 shadow-card grid md:grid-cols-2 gap-8 items-center">
            <span className="tape -top-3 left-10 -rotate-3" />
            <span className="tape-sage -top-3 right-16 rotate-3" />
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-soft border-[6px] border-cream rotate-[-1.5deg]">
                <img src={maker} alt="Crochet artist at work" loading="lazy" width={800} height={800} className="w-full h-auto object-cover" />
              </div>
              <Sprig className="absolute -right-4 -bottom-6 w-10 h-16 opacity-80" />
            </div>
            <div className="relative">
              <p className="font-script text-rose-dark text-2xl">— Hello, I'm Mira</p>
              <h3 className="font-display text-3xl md:text-4xl mt-2">A little story behind every stitch</h3>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Stitch &amp; Bloom started in my sunlit kitchen with a basket of yarn
                and the slow hum of an afternoon. Every flower, friend, and tiny
                keepsake is made by hand — no factories, no shortcuts. Just calm
                hours, soft cotton, and a wish that it makes someone smile.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <button onClick={() => setCustomOrderOpen(true)} className="btn-outline-rose">Custom Requests</button>
                <Floral className="w-16 h-6" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-12 md:py-20 bg-cream/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionTitle>How it's made</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
            {[
              { icon: Scissors, label: "Yarn Selection", note: "Soft natural cotton" },
              { icon: Leaf, label: "Handcrafted", note: "Stitched with care" },
              { icon: Package, label: "Packaged With Care", note: "Pretty paper & tag" },
              { icon: MapPin, label: "Delivered To You", note: "Sent with love" },
            ].map((s, i) => (
              <motion.div key={s.label} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="text-center relative">
                <div className="mx-auto w-20 h-20 rounded-full bg-cream shadow-soft grid place-items-center relative border border-border/60">
                  <s.icon className="w-8 h-8 text-sage-dark" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose text-cream text-xs font-display grid place-items-center">{i + 1}</span>
                </div>
                <h4 className="mt-4 font-display text-lg">{s.label}</h4>
                <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
                {i < 3 && <Arrow className="hidden md:block absolute top-10 -right-6 w-12 h-3" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionTitle>What our customers say</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ rotate: `${t.tilt}deg` }}
                className="paper rounded-2xl p-6 shadow-card relative"
              >
                <span className="tape -top-3 left-1/2 -translate-x-1/2" />
                <Stars count={5} />
                <p className="mt-4 font-script text-lg leading-snug text-foreground/85">"{t.text}"</p>
                <p className="mt-4 text-right font-script text-rose-dark text-xl">— {t.name} ♡</p>
                <Floral className="absolute bottom-2 left-3 w-14 h-5 opacity-60" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section id="journal" className="py-12 md:py-20 bg-cream/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl">Follow along on Instagram</h2>
            <p className="text-sm text-muted-foreground mt-1">@stitchandbloom.crochet</p>
          </div>
          <div className="relative">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 grid place-items-center rounded-full bg-cream shadow-soft hidden md:grid">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none">
              {igGallery.map((img, i) => (
                <motion.a key={i} href="#" whileHover={{ scale: 1.03 }} className="snap-start shrink-0 w-40 md:w-56 aspect-square rounded-2xl overflow-hidden shadow-soft relative group">
                  <img src={img} alt="Instagram post" loading="lazy" width={512} height={512} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-brown/0 group-hover:bg-brown/30 transition grid place-items-center">
                    <Instagram className="w-6 h-6 text-cream opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </motion.a>
              ))}
            </div>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 grid place-items-center rounded-full bg-cream shadow-soft hidden md:grid">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

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

// Inline Stars rating asset to assist review grids
const Stars = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Heart key={i} className={`w-3.5 h-3.5 ${i < count ? "fill-rose text-rose" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);
