import React from "react";
import { Home, ShoppingBag, Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useNavigate } from "react-router-dom";

export default function MobileNav() {
  const { cartCount, setCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur border-t border-border shadow-[0_-8px_24px_-12px_rgba(110,87,70,0.2)]">
      <div className="grid grid-cols-5">
        {[
          { I: Home, l: "Home", action: () => navigate("/") },
          { I: ShoppingBag, l: "Shop", action: () => navigate("/products") },
          { I: Heart, l: "Wishlist", action: () => navigate("/products"), badge: wishlist.length },
          { I: ShoppingCart, l: "Cart", badge: cartCount, action: () => setCartOpen(true) },
          { I: User, l: "Account", action: () => navigate("/admin") },
        ].map(({ I, l, badge, action }) => (
          <button key={l} onClick={action} className="py-2.5 flex flex-col items-center gap-0.5 text-foreground/80 active:text-rose-dark font-medium">
            <div className="relative">
              <I className="w-5 h-5" />
              {badge > 0 ? (
                <span className="absolute -top-1 -right-2 bg-rose text-cream text-[9px] font-medium w-3.5 h-3.5 grid place-items-center rounded-full">
                  {badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px]">{l}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
