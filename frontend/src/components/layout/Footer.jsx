import React, { useState } from "react";
import { Mail, Instagram, Heart } from "lucide-react";
import Floral from "../decor/Floral.jsx";
import Sprig from "../decor/Sprig.jsx";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewsletterStatus("success");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        alert(data.error || "Subscription failed.");
      }
    } catch (error) {
      setNewsletterStatus("error");
    }
  };

  return (
    <>
      {/* NEWSLETTER */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="gingham-bg rounded-3xl p-6 md:p-10 shadow-card relative overflow-hidden grid md:grid-cols-[280px_1fr] gap-6 items-center">
            <div className="bg-cream/60 rounded-2xl p-3 shadow-soft rotate-[-2deg]">
              <img src="/assets/yarn-basket.jpg" alt="Basket of yarn" loading="lazy" width={800} height={600} className="w-full h-auto object-contain" />
            </div>
            <div className="text-brown">
              <h3 className="font-display text-2xl md:text-3xl">Be the first to know <span className="text-rose-dark">♡</span></h3>
              <p className="mt-2 text-sm md:text-base">
                Get updates on new collections, special offers and cozy behind-the-scenes.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mt-5 flex flex-col sm:flex-row gap-2 bg-cream/70 rounded-full p-1.5 max-w-md backdrop-blur">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-sm placeholder:text-muted-foreground"
                />
                <button type="submit" disabled={newsletterStatus === "loading"} className="btn-rose !py-2 text-sm disabled:opacity-50">
                  {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              {newsletterStatus === "success" && (
                <p className="mt-2 text-xs text-sage-dark font-medium">Thank you for subscribing! Keep an eye on your inbox.</p>
              )}
            </div>
            <Floral className="absolute right-6 top-4 w-20 h-8 opacity-80" />
            <Mail className="absolute right-12 top-12 w-5 h-5 text-rose-dark opacity-70" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-sage text-cream pt-14 pb-8 mt-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <p className="font-display italic text-2xl">Stitch &amp; Bloom</p>
            <p className="text-[10px] tracking-[0.35em] uppercase text-cream/70 mt-1">Crochet</p>
            <p className="mt-4 text-sm text-cream/85 max-w-xs">
              Handmade crochet pieces with love, joy, just for you.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Heart, Mail].map((I, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-cream/15 hover:bg-cream/25 grid place-items-center transition">
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { t: "Shop", l: ["All Products", "Best Sellers", "New Arrivals", "Ready to Ship"] },
            { t: "Information", l: ["About Us", "Shipping & Delivery", "Returns & Exchanges", "Privacy Policy"] },
            { t: "Customer Care", l: ["Custom Orders", "Contact Us", "Track Your Order", "FAQs"] },
          ].map(col => (
            <div key={col.t}>
              <p className="font-display text-lg mb-3">{col.t}</p>
              <ul className="space-y-2 text-sm text-cream/85">
                {col.l.map(li => <li key={li}><a href="#" className="hover:text-cream transition">{li}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
          <p className="font-display text-lg mb-3">Let's stay connected <span className="text-rose">♡</span></p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 bg-cream/15 rounded-full p-1.5 max-w-md backdrop-blur">
            <input
              type="email"
              placeholder="Your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="flex-1 bg-transparent px-4 py-2 outline-none text-sm placeholder:text-cream/60 text-cream"
            />
            <button type="submit" className="btn-rose !py-2 text-sm">Subscribe</button>
          </form>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 pt-6 border-t border-cream/20 text-xs text-cream/70 text-center">
          © 2026 Stitch &amp; Bloom Crochet. All rights reserved.
        </div>
        <Sprig className="absolute -left-2 bottom-2 w-12 h-20 opacity-50" />
      </footer>
    </>
  );
}
