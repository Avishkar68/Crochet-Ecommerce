import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { YarnSpinner, TableSkeleton } from "../components/decor/ThemedLoader.jsx";
import api from "../lib/api.js";
import Floral from "../components/decor/Floral.jsx";
import Sprig from "../components/decor/Sprig.jsx";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  ClipboardList,
  Mail,
  Plus,
  Trash2,
  Check,
  X,
  AlertCircle,
  Eye,
  Loader2,
  Calendar,
  DollarSign,
  User,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Admin authentication
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid password. Please try again.");
    }
  };

  // Lightbox Modal for custom order images
  const [lightboxImage, setLightboxImage] = useState(null);

  // Selected detail modals states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Print Invoice Receipt Helper
  const printOrderReceipt = (order) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px dashed #ece2d2;">${item.name} x ${item.quantity}</td>
        <td style="padding: 8px 0; text-align: right; border-bottom: 1px dashed #ece2d2;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order.orderId}</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              color: #4a3a2e;
              background-color: #FFFDF8;
              padding: 40px;
              max-width: 500px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #6E5746;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .title {
              font-size: 24px;
              font-style: italic;
              margin: 0;
            }
            .subtitle {
              font-size: 10px;
              letter-spacing: 3px;
              text-transform: uppercase;
              margin-top: 5px;
              color: #8b7a6a;
            }
            .details {
              font-size: 13px;
              margin-bottom: 20px;
              line-height: 1.6;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 13px;
            }
            .total {
              font-size: 16px;
              font-weight: bold;
              text-align: right;
              border-top: 2px dashed #6E5746;
              padding-top: 15px;
              margin-top: 15px;
            }
            .footer {
              text-align: center;
              font-size: 11px;
              color: #8b7a6a;
              margin-top: 40px;
              border-top: 1px dashed #ece2d2;
              padding-top: 20px;
            }
            @media print {
              body { padding: 0; background: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Stitch & Bloom</h1>
            <div class="subtitle">Crochet Boutique</div>
          </div>
          
          <div class="details">
            <strong>Order ID:</strong> ${order.orderId}<br/>
            <strong>Date:</strong> ${new Date(order.date).toLocaleString()}<br/>
            <strong>Customer:</strong> ${order.name}<br/>
            <strong>Email:</strong> ${order.email}<br/>
            <strong>Shipping Address:</strong><br/>
            ${order.address.replace(/\n/g, '<br/>')}
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th style="text-align: left; border-bottom: 1px solid #6E5746; padding-bottom: 8px;">Item</th>
                <th style="text-align: right; border-bottom: 1px solid #6E5746; padding-bottom: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="total">
            Total Amount: ₹${order.total.toFixed(2)}
          </div>
          
          <div class="footer">
            Thank you for supporting handmade creations!<br/>
            Stitch & Bloom Crochet ♡
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Form states for creating new product
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "Crochet Flowers",
    rating: "0"
  });
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");
  const [customFilter, setCustomFilter] = useState("all");

  // Fetch all products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const res = await api.get("/api/products");
      return res.data;
    }
  });

  // Fetch all orders
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const res = await api.get("/api/orders");
      return res.data;
    }
  });

  // Fetch all custom orders
  const { data: customOrders = [], isLoading: isLoadingCustomOrders } = useQuery({
    queryKey: ["admin", "custom-orders"],
    queryFn: async () => {
      const res = await api.get("/api/custom-orders");
      return res.data;
    }
  });

  // Fetch all newsletter subscribers
  const { data: subscribers = [], isLoading: isLoadingSubscribers } = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: async () => {
      const res = await api.get("/api/newsletter");
      return res.data;
    }
  });

  // Mutations
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/api/orders/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    }
  });

  const updateCustomOrderMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/api/custom-orders/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "custom-orders"] });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setConfirmDeleteId(null);
    }
  });

  // Handle New Product Submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!productForm.name || !productForm.price || !productForm.category) {
      setFormError("Please fill in name, price, and category.");
      return;
    }

    if (!productImage) {
      setFormError("Please select a product image file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("category", productForm.category);
      formData.append("rating", productForm.rating);
      formData.append("img", productImage);

      const res = await api.post("/api/products", formData);
      const data = res.data;

      setFormSuccess("Product added successfully!");
      setProductForm({ name: "", price: "", category: "Crochet Flowers", rating: "0" });
      setProductImage(null);
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to create product.";
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Stats Computations
  const totalSales = orders
    .filter(order => order.status === "completed")
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const pendingOrdersCount = orders.filter(order => order.status === "pending").length;
  const activeCustomRequestsCount = customOrders.filter(req => req.status === "reviewing").length;
  const subscribersCount = subscribers.length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden text-brown">
        {/* Decor floaters */}
        <div className="absolute top-10 left-10 opacity-30">
          <Sprig className="w-16 h-24" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-30">
          <Floral className="w-24 h-12" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative paper rounded-3xl p-8 max-w-sm w-full shadow-card text-center border border-border/60 bg-cream/30"
        >
          <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
          <h2 className="font-display italic text-3xl mb-1 mt-2">Admin Portal</h2>
          <p className="text-xs text-muted-foreground mb-6 uppercase tracking-wider">Stitch & Bloom Control Center</p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-brown mb-1.5">Enter Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/40 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm transition"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-dark font-medium bg-rose/10 py-2 px-3 rounded-lg border border-rose/15">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full btn-rose py-2.5 rounded-xl text-sm font-semibold shadow-soft hover:scale-[1.01] transition-transform"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/40">
            <a
              href="/"
              className="text-xs font-medium text-muted-foreground hover:text-rose-dark transition underline"
            >
              Return to main store
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header Banner */}
      <header className="paper border-b border-border/80 py-8 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative">
            <span className="tape -top-6 left-4 rotate-[-2deg] opacity-70" />
            <h1 className="font-display italic text-3xl md:text-4xl text-brown">Command Center</h1>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">Stitch & Bloom E-Commerce Admin</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsAuthenticated(false);
                sessionStorage.removeItem("admin_auth");
              }}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-border text-rose-dark hover:bg-rose/5 transition"
            >
              Log Out 🔒
            </button>
            <a
              href="/"
              className="px-4 py-2 text-xs font-semibold rounded-full border border-border text-brown hover:bg-muted transition flex items-center gap-1.5"
            >
              Back to Shop <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            {
              label: "Total Sales",
              val: `₹${totalSales.toFixed(2)}`,
              desc: "From completed orders",
              icon: DollarSign,
              color: "text-sage-dark bg-sage/10"
            },
            {
              label: "Pending Orders",
              val: pendingOrdersCount,
              desc: "Requires processing",
              icon: ShoppingBag,
              color: "text-rose-dark bg-rose/10"
            },
            {
              label: "Custom Requests",
              val: activeCustomRequestsCount,
              desc: "Awaiting review",
              icon: ClipboardList,
              color: "text-brown bg-peach/20"
            },
            {
              label: "Subscribers",
              val: subscribersCount,
              desc: "Newsletter audience",
              icon: Mail,
              color: "text-sage-dark bg-sage/10"
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="paper rounded-2xl p-5 shadow-soft border border-border/40 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-brown">{stat.val}</h3>
                <p className="text-[11px] text-muted-foreground mt-1">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/60 mb-6 gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "products", label: "Products Catalog", icon: Package },
            { id: "orders", label: "Customer Orders", icon: ShoppingBag },
            { id: "custom", label: "Custom Requests", icon: ClipboardList },
            { id: "subscribers", label: "Newsletter Subs", icon: Mail }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all relative shrink-0 ${activeTab === tab.id
                  ? "text-brown bg-cream border-t border-x border-border/80"
                  : "text-muted-foreground hover:text-brown hover:bg-cream/40"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="min-h-[400px]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Welcome box */}
              <div className="paper rounded-3xl p-6 md:p-8 shadow-soft relative overflow-hidden bg-cream/70 border border-border/60">
                <span className="tape-sage -top-3 right-12 rotate-[3deg] opacity-75" />
                <h3 className="font-display text-2xl italic text-brown mb-2">Hello, Mira! ♡</h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Welcome to Stitch & Bloom's administration dashboard. Here you can control all details of your hand-knit creations catalog, manage active custom requests, dispatch packages, and connect with your subscribers.
                </p>
              </div>

              {/* Summary Stats / Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent activity summary */}
                <div className="paper rounded-2xl p-6 shadow-soft">
                  <h4 className="font-display text-lg text-brown italic mb-4">Latest Orders</h4>
                  {isLoadingOrders ? (
                    <YarnSpinner message="" />
                  ) : orders.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No orders yet.</p>
                  ) : (
                    <div className="divide-y divide-border/40">
                      {orders.slice(0, 5).map(order => (
                        <div key={order._id} className="py-3 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-semibold text-brown">{order.name}</p>
                            <p className="text-muted-foreground text-[10px] mt-0.5">{order.orderId} • {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-brown">₹{order.total.toFixed(2)}</p>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] mt-1 font-medium capitalize ${order.status === "completed" ? "bg-sage/10 text-sage-dark" :
                                order.status === "shipped" ? "bg-blue-50 text-blue-600" :
                                  order.status === "cancelled" ? "bg-rose-50 text-rose-dark" :
                                    "bg-amber-50 text-amber-600"
                              }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular Categories */}
                <div className="paper rounded-2xl p-6 shadow-soft">
                  <h4 className="font-display text-lg text-brown italic mb-4">Store Overview & Inventory</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1.5">
                        <span>Total Products Cataloged</span>
                        <span>{products.length} Products</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-sage h-full rounded-full" style={{ width: `${Math.min(100, (products.length / 20) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1.5">
                        <span>Custom Orders Pending Review</span>
                        <span>{activeCustomRequestsCount} requests</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-rose h-full rounded-full" style={{ width: `${Math.min(100, (activeCustomRequestsCount / 10) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1.5">
                        <span>Newsletter Subscriptions</span>
                        <span>{subscribersCount} subscribers</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-sage h-full rounded-full" style={{ width: `${Math.min(100, (subscribersCount / 50) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === "products" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-[380px_1fr] gap-6"
            >
              {/* Product Form */}
              <div className="paper rounded-2xl p-6 shadow-soft self-start border border-border/60">
                <h3 className="font-display text-xl text-brown italic mb-4">Add New Product</h3>

                {formError && (
                  <div className="mb-4 p-3 bg-rose/10 text-rose-dark rounded-xl flex items-start gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="mb-4 p-3 bg-sage/10 text-sage-dark rounded-xl flex items-start gap-2 text-xs">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Product Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      required
                      placeholder="e.g. Lavender Pot"
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream/40 outline-none focus:border-rose text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-brown mb-1">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                        required
                        placeholder="24.99"
                        className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream/40 outline-none focus:border-rose text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brown mb-1">Initial Rating count</label>
                      <input
                        type="number"
                        value={productForm.rating}
                        onChange={e => setProductForm({ ...productForm, rating: e.target.value })}
                        placeholder="e.g. 15"
                        className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream/40 outline-none focus:border-rose text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream/40 outline-none focus:border-rose text-sm text-brown"
                    >
                      <option>Crochet Flowers</option>
                      <option>Plush Friends</option>
                      <option>Accessories</option>
                      <option>Bags & Pouches</option>
                      <option>Home Decor</option>
                      <option>Gift Ideas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Product Image</label>
                    <div className="border border-dashed border-border hover:border-rose/60 rounded-xl p-4 bg-cream/20 text-center transition cursor-pointer relative overflow-hidden min-h-[110px] flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required={!imagePreview}
                      />
                      {imagePreview ? (
                        <div className="w-full h-full absolute inset-0 bg-cream/90 flex items-center justify-center p-2">
                          <img src={imagePreview} alt="Preview" className="h-full object-contain rounded-md" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-1 right-1 p-1 bg-rose text-cream rounded-full hover:bg-rose-dark transition shadow"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          <Plus className="w-6 h-6 mx-auto mb-1 text-muted-foreground/60" />
                          <p className="text-xs">Choose or drag product photo</p>
                          <span className="text-[10px] text-muted-foreground/50">Supports JPG, PNG, WEBP</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-sage py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloudinary...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add Product
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Products List */}
              <div className="paper rounded-2xl p-6 shadow-soft border border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h3 className="font-display text-xl text-brown italic">Products Catalog</h3>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl border border-border bg-cream/40 outline-none text-xs w-full sm:max-w-xs"
                  />
                </div>

                {isLoadingProducts ? (
                  <TableSkeleton cols={5} rows={5} />
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border/40 text-muted-foreground">
                            <th className="py-2.5 pb-4 font-semibold">Image</th>
                            <th className="py-2.5 pb-4 font-semibold">Name</th>
                            <th className="py-2.5 pb-4 font-semibold">Category</th>
                            <th className="py-2.5 pb-4 font-semibold">Price</th>
                            <th className="py-2.5 pb-4 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20 text-brown">
                          {products
                            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(product => (
                              <tr
                                key={product._id}
                                onClick={() => setSelectedProduct(product)}
                                className="hover:bg-cream/70 transition cursor-pointer"
                              >
                                <td className="py-2.5 pr-2">
                                  <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded-lg border border-border/50"
                                    onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Img" }}
                                  />
                                </td>
                                <td className="py-2.5 font-medium pr-2">{product.name}</td>
                                <td className="py-2.5 text-muted-foreground pr-2">{product.category}</td>
                                <td className="py-2.5 font-semibold">₹{product.price.toFixed(2)}</td>
                                <td className="py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                                  {confirmDeleteId === product._id ? (
                                    <div className="flex justify-end gap-1.5">
                                      <button
                                        onClick={() => deleteProductMutation.mutate(product._id)}
                                        className="p-1 text-rose rounded hover:bg-rose/10"
                                        title="Confirm delete"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="p-1 text-muted-foreground rounded hover:bg-muted"
                                        title="Cancel"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setConfirmDeleteId(product._id)}
                                      className="p-1.5 text-muted-foreground hover:text-rose-dark hover:bg-rose/5 rounded-lg transition"
                                      title="Delete product"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-8 text-muted-foreground">
                                No products found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {products
                        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(product => (
                          <div
                            key={product._id}
                            onClick={() => setSelectedProduct(product)}
                            className="paper rounded-xl p-4 shadow-soft border border-border/40 hover:bg-cream/40 transition cursor-pointer flex gap-4 items-center bg-cream"
                          >
                            <img
                              src={product.img}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg border border-border/50 shrink-0 bg-muted"
                              onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Img" }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-brown text-sm truncate">{product.name}</h4>
                              <p className="text-muted-foreground text-xs">{product.category}</p>
                              <p className="font-bold text-rose-dark text-xs mt-1">₹{product.price.toFixed(2)}</p>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                              {confirmDeleteId === product._id ? (
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => deleteProductMutation.mutate(product._id)}
                                    className="p-1.5 text-rose rounded-lg bg-rose/10 hover:bg-rose/20"
                                    title="Confirm delete"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="p-1.5 text-muted-foreground rounded-lg bg-muted hover:bg-muted/80"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteId(product._id)}
                                  className="p-2 text-muted-foreground hover:text-rose-dark hover:bg-rose/5 rounded-lg transition"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-xs">
                          No products found.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: CUSTOMER ORDERS */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="paper rounded-2xl p-6 shadow-soft border border-border/60"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="font-display text-xl text-brown italic">Billing & Dispatch</h3>
                <div className="flex gap-2">
                  {["all", "pending", "shipped", "completed", "cancelled"].map(statusFilter => (
                    <button
                      key={statusFilter}
                      onClick={() => setOrderFilter(statusFilter)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize border transition ${orderFilter === statusFilter
                          ? "bg-rose text-cream border-rose"
                          : "border-border text-muted-foreground hover:bg-cream/40"
                        }`}
                    >
                      {statusFilter}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingOrders ? (
                <TableSkeleton cols={7} rows={4} />
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border/40 text-muted-foreground">
                          <th className="py-2.5 pb-4 font-semibold">Order ID</th>
                          <th className="py-2.5 pb-4 font-semibold">Customer</th>
                          <th className="py-2.5 pb-4 font-semibold">Address</th>
                          <th className="py-2.5 pb-4 font-semibold">Items</th>
                          <th className="py-2.5 pb-4 font-semibold">Total</th>
                          <th className="py-2.5 pb-4 font-semibold">Date</th>
                          <th className="py-2.5 pb-4 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 text-brown">
                        {orders
                          .filter(o => orderFilter === "all" || o.status === orderFilter)
                          .map(order => (
                            <tr
                              key={order._id}
                              onClick={() => setSelectedOrder(order)}
                              className="hover:bg-cream/70 transition align-top cursor-pointer"
                            >
                              <td className="py-4 font-semibold pr-2">{order.orderId}</td>
                              <td className="py-4 pr-2">
                                <p className="font-semibold">{order.name}</p>
                                <p className="text-muted-foreground text-[10px]">{order.email}</p>
                              </td>
                              <td className="py-4 text-muted-foreground text-[11px] max-w-[200px] pr-2 break-words">
                                {order.address}
                              </td>
                              <td className="py-4 pr-2 max-w-[220px]">
                                <div className="space-y-1 text-[11px]">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-1.5">
                                      <span className="text-muted-foreground shrink-0">{item.quantity}x</span>
                                      <span className="truncate">{item.name}</span>
                                      <span className="text-muted-foreground/60 shrink-0">(₹{item.price})</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 font-semibold pr-2">₹{order.total.toFixed(2)}</td>
                              <td className="py-4 text-muted-foreground shrink-0 pr-2">
                                {new Date(order.date).toLocaleDateString()}
                              </td>
                              <td className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={order.status}
                                  onChange={e =>
                                    updateOrderMutation.mutate({ id: order._id, status: e.target.value })
                                  }
                                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider outline-none border cursor-pointer border-transparent ${order.status === "completed" ? "bg-sage/10 text-sage-dark" :
                                      order.status === "shipped" ? "bg-blue-50 text-blue-600" :
                                        order.status === "cancelled" ? "bg-rose-50 text-rose-dark" :
                                          "bg-amber-50 text-amber-600"
                                    }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        {orders.filter(o => orderFilter === "all" || o.status === orderFilter).length === 0 && (
                          <tr>
                            <td colSpan="7" className="text-center py-12 text-muted-foreground">
                              No orders found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {orders
                      .filter(o => orderFilter === "all" || o.status === orderFilter)
                      .map(order => (
                        <div
                          key={order._id}
                          onClick={() => setSelectedOrder(order)}
                          className="paper rounded-xl p-4 shadow-soft border border-border/40 hover:bg-cream/40 transition cursor-pointer space-y-3 bg-cream"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-semibold text-brown text-sm">{order.orderId}</span>
                              <span className="text-muted-foreground text-[10px] block">{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <select
                                value={order.status}
                                onChange={e =>
                                  updateOrderMutation.mutate({ id: order._id, status: e.target.value })
                                }
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold uppercase tracking-wider outline-none border cursor-pointer border-transparent ${order.status === "completed" ? "bg-sage/10 text-sage-dark" :
                                    order.status === "shipped" ? "bg-blue-50 text-blue-600" :
                                      order.status === "cancelled" ? "bg-rose-50 text-rose-dark" :
                                        "bg-amber-50 text-amber-600"
                                  }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          <div className="text-xs space-y-1">
                            <p className="font-semibold text-brown">{order.name} <span className="text-muted-foreground font-normal text-[10px]">({order.email})</span></p>
                            <p className="text-muted-foreground text-[11px] line-clamp-1">{order.address}</p>
                          </div>

                          <div className="border-t border-border/30 pt-2 flex justify-between items-center">
                            <span className="text-muted-foreground text-[10px]">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                            <span className="font-bold text-rose-dark text-sm">₹{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    {orders.filter(o => orderFilter === "all" || o.status === orderFilter).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-xs">
                        No orders found.
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* TAB 4: CUSTOM REQUESTS */}
          {activeTab === "custom" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="paper rounded-2xl p-6 shadow-soft border border-border/60"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="font-display text-xl text-brown italic">Custom Creations Board</h3>
                <div className="flex gap-2">
                  {["all", "reviewing", "approved", "declined"].map(cFilter => (
                    <button
                      key={cFilter}
                      onClick={() => setCustomFilter(cFilter)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize border transition ${customFilter === cFilter
                          ? "bg-rose text-cream border-rose"
                          : "border-border text-muted-foreground hover:bg-cream/40"
                        }`}
                    >
                      {cFilter}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingCustomOrders ? (
                <TableSkeleton cols={7} rows={4} />
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border/40 text-muted-foreground">
                          <th className="py-2.5 pb-4 font-semibold">Req ID</th>
                          <th className="py-2.5 pb-4 font-semibold">Customer</th>
                          <th className="py-2.5 pb-4 font-semibold">Description</th>
                          <th className="py-2.5 pb-4 font-semibold">Budget & Deadline</th>
                          <th className="py-2.5 pb-4 font-semibold text-center">Reference</th>
                          <th className="py-2.5 pb-4 font-semibold">Date</th>
                          <th className="py-2.5 pb-4 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 text-brown">
                        {customOrders
                          .filter(req => customFilter === "all" || req.status === customFilter)
                          .map(request => (
                            <tr
                              key={request._id}
                              onClick={() => setSelectedRequest(request)}
                              className="hover:bg-cream/70 transition align-top cursor-pointer"
                            >
                              <td className="py-4 font-semibold pr-2">{request.requestId}</td>
                              <td className="py-4 pr-2">
                                <p className="font-semibold">{request.name}</p>
                                <p className="text-muted-foreground text-[10px]">{request.email}</p>
                              </td>
                              <td className="py-4 text-muted-foreground text-[11px] max-w-[260px] pr-2 break-words whitespace-pre-line">
                                {request.description}
                              </td>
                              <td className="py-4 pr-2 text-[11px]">
                                <p className="font-medium text-brown">Budget: {request.budget || "N/A"}</p>
                                <p className="text-muted-foreground mt-0.5">
                                  Deadline: {request.deadline ? new Date(request.deadline).toLocaleDateString() : "Flexible"}
                                </p>
                              </td>
                              <td className="py-4 text-center pr-2" onClick={(e) => e.stopPropagation()}>
                                {request.referenceImage ? (
                                  <button
                                    onClick={() => setLightboxImage(request.referenceImage)}
                                    className="relative inline-block group cursor-pointer"
                                    title="Click to zoom image"
                                  >
                                    <img
                                      src={request.referenceImage}
                                      alt="Reference"
                                      className="w-10 h-10 object-cover rounded-lg border border-border hover:brightness-90 transition"
                                      onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Img" }}
                                    />
                                    <span className="absolute inset-0 bg-brown/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition">
                                      <Eye className="w-3.5 h-3.5 text-cream" />
                                    </span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground/50">None</span>
                                )}
                              </td>
                              <td className="py-4 text-muted-foreground pr-2">
                                {new Date(request.date).toLocaleDateString()}
                              </td>
                              <td className="py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={request.status}
                                  onChange={e =>
                                    updateCustomOrderMutation.mutate({ id: request._id, status: e.target.value })
                                  }
                                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider outline-none border cursor-pointer border-transparent ${request.status === "approved" ? "bg-sage/10 text-sage-dark" :
                                      request.status === "declined" ? "bg-rose-50 text-rose-dark" :
                                        "bg-amber-50 text-amber-600"
                                    }`}
                                >
                                  <option value="reviewing">Reviewing</option>
                                  <option value="approved">Approved</option>
                                  <option value="declined">Declined</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        {customOrders.filter(req => customFilter === "all" || req.status === customFilter).length === 0 && (
                          <tr>
                            <td colSpan="7" className="text-center py-12 text-muted-foreground">
                              No requests found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {customOrders
                      .filter(req => customFilter === "all" || req.status === customFilter)
                      .map(request => (
                        <div
                          key={request._id}
                          onClick={() => setSelectedRequest(request)}
                          className="paper rounded-xl p-4 shadow-soft border border-border/40 hover:bg-cream/40 transition cursor-pointer space-y-3 bg-cream"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-semibold text-brown text-sm">{request.requestId}</span>
                              <span className="text-muted-foreground text-[10px] block">{new Date(request.date).toLocaleDateString()}</span>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <select
                                value={request.status}
                                onChange={e =>
                                  updateCustomOrderMutation.mutate({ id: request._id, status: e.target.value })
                                }
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold uppercase tracking-wider outline-none border cursor-pointer border-transparent ${request.status === "approved" ? "bg-sage/10 text-sage-dark" :
                                    request.status === "declined" ? "bg-rose-50 text-rose-dark" :
                                      "bg-amber-50 text-amber-600"
                                  }`}
                              >
                                <option value="reviewing">Reviewing</option>
                                <option value="approved">Approved</option>
                                <option value="declined">Declined</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            {request.referenceImage && (
                              <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => setLightboxImage(request.referenceImage)}
                                  className="relative inline-block group cursor-pointer"
                                  title="Click to zoom image"
                                >
                                  <img
                                    src={request.referenceImage}
                                    alt="Reference"
                                    className="w-14 h-14 object-cover rounded-lg border border-border"
                                    onError={(e) => { e.target.src = "https://placehold.co/100x100?text=No+Img" }}
                                  />
                                </button>
                              </div>
                            )}
                            <div className="flex-1 min-w-0 text-xs">
                              <p className="font-semibold text-brown">{request.name}</p>
                              <p className="text-muted-foreground text-[10px] mb-1">{request.email}</p>
                              <p className="text-muted-foreground text-[11px] line-clamp-2">{request.description}</p>
                            </div>
                          </div>

                          <div className="border-t border-border/30 pt-2 flex justify-between text-[11px]">
                            <div>
                              <span className="text-muted-foreground">Budget: </span>
                              <span className="font-semibold text-brown">{request.budget || "Flexible"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Deadline: </span>
                              <span className="font-semibold text-brown">{request.deadline ? new Date(request.deadline).toLocaleDateString() : "Flexible"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    {customOrders.filter(req => customFilter === "all" || req.status === customFilter).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-xs">
                        No requests found.
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* TAB 5: NEWSLETTER SUBSCRIBERS */}
          {activeTab === "subscribers" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="paper rounded-2xl p-6 shadow-soft border border-border/60 max-w-2xl mx-auto"
            >
              <h3 className="font-display text-xl text-brown italic mb-6">Newsletter Audience</h3>

              {isLoadingSubscribers ? (
                <TableSkeleton cols={2} rows={5} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground">
                        <th className="py-2.5 pb-4 font-semibold">Email</th>
                        <th className="py-2.5 pb-4 font-semibold text-right">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-brown">
                      {subscribers.map((sub, index) => (
                        <tr key={sub._id || index} className="hover:bg-cream/40 transition">
                          <td className="py-3 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />
                            {sub.email}
                          </td>
                          <td className="py-3 text-muted-foreground text-right">
                            {new Date(sub.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {subscribers.length === 0 && (
                        <tr>
                          <td colSpan="2" className="text-center py-8 text-muted-foreground">
                            No subscribers registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-brown/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center z-10"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 bg-cream text-brown rounded-full hover:bg-muted transition shadow-lg z-20"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={lightboxImage}
                alt="Reference Full Size"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-lift border-4 border-cream"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-brown/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative paper rounded-3xl p-6 md:p-8 max-w-md w-full shadow-card z-10 text-brown"
            >
              <span className="tape-sage -top-3 left-12 rotate-[2deg] opacity-80" />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-display text-2xl italic text-brown mb-4">Product Details</h3>

              <div className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-2xl overflow-hidden bg-muted border border-border/50 mb-4">
                  <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    <tr className="border-b border-border/30"><td className="py-2.5 font-semibold text-muted-foreground">Product ID</td><td className="py-2.5 font-mono select-all text-right">{selectedProduct._id}</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2.5 font-semibold text-muted-foreground">Name</td><td className="py-2.5 font-medium text-right">{selectedProduct.name}</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2.5 font-semibold text-muted-foreground">Category</td><td className="py-2.5 text-right">{selectedProduct.category}</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2.5 font-semibold text-muted-foreground">Price</td><td className="py-2.5 font-bold text-right">₹{selectedProduct.price.toFixed(2)}</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2.5 font-semibold text-muted-foreground">Rating count</td><td className="py-2.5 text-right">♡ {selectedProduct.rating}</td></tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-brown/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative paper rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-card z-10 text-brown max-h-[90vh] overflow-y-auto"
            >
              <span className="tape -top-3 left-12 rotate-[-2deg] opacity-80" />
              <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground">
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="font-display text-2xl italic text-brown">Order Invoice</h3>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={() => printOrderReceipt(selectedOrder)}
                  className="btn-rose !py-1.5 !px-3.5 text-xs flex items-center gap-1.5 font-semibold shadow-soft self-start sm:self-auto"
                >
                  Print Receipt 🖨️
                </button>
              </div>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-cream/40 p-3.5 rounded-xl border border-border/40 text-xs">
                  <h4 className="font-semibold text-brown mb-1.5">Shipping Details</h4>
                  <p className="font-medium">{selectedOrder.name}</p>
                  <p className="text-muted-foreground">{selectedOrder.email}</p>
                  <p className="text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-wrap">{selectedOrder.address}</p>
                </div>

                {/* Ordered Items */}
                <div>
                  <h4 className="font-semibold text-xs text-brown mb-2">Items Purchased</h4>
                  <div className="divide-y divide-border/25 text-xs">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={item.img} alt={item.name} className="w-8 h-8 object-cover rounded-md border border-border/50" />
                          <div>
                            <p className="font-medium text-brown">{item.name}</p>
                            <p className="text-muted-foreground text-[10px]">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-brown">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total & Status */}
                <div className="pt-3 border-t border-border/40 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Date Placed</span>
                    <p className="font-semibold text-brown">{new Date(selectedOrder.date).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold block mb-0.5">Order Total</span>
                    <p className="text-lg font-bold text-rose-dark">₹{selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="fixed inset-0 bg-brown/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative paper rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-card z-10 text-brown max-h-[90vh] overflow-y-auto"
            >
              <span className="tape-sage -top-3 left-12 rotate-[2deg] opacity-80" />
              <button onClick={() => setSelectedRequest(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground">
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-display text-2xl italic text-brown">Custom Request</h3>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{selectedRequest.requestId}</p>
              </div>

              <div className="space-y-4 mt-4 text-xs">
                {/* Client Details */}
                <div className="bg-cream/40 p-3.5 rounded-xl border border-border/40">
                  <h4 className="font-semibold text-brown mb-1">Contact Info</h4>
                  <p className="font-medium">{selectedRequest.name}</p>
                  <p className="text-muted-foreground">{selectedRequest.email}</p>
                  <p className="text-muted-foreground/60 mt-1">Submitted: {new Date(selectedRequest.date).toLocaleString()}</p>
                </div>

                {/* Request Description */}
                <div>
                  <h4 className="font-semibold text-brown mb-1.5">Description</h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap bg-cream/30 p-3 rounded-xl border border-border/30">
                    {selectedRequest.description}
                  </p>
                </div>

                {/* Budget and Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-cream/40 p-3 rounded-xl border border-border/40">
                    <h4 className="font-semibold text-brown mb-0.5">Est. Budget</h4>
                    <p className="font-bold text-rose-dark">{selectedRequest.budget || "Flexible"}</p>
                  </div>
                  <div className="bg-cream/40 p-3 rounded-xl border border-border/40">
                    <h4 className="font-semibold text-brown mb-0.5">Deadline</h4>
                    <p className="font-semibold text-brown">
                      {selectedRequest.deadline ? new Date(selectedRequest.deadline).toLocaleDateString() : "Flexible"}
                    </p>
                  </div>
                </div>

                {/* Reference Image */}
                {selectedRequest.referenceImage && (
                  <div>
                    <h4 className="font-semibold text-brown mb-2">Reference Image</h4>
                    <div className="w-48 h-36 rounded-xl overflow-hidden border border-border/50 bg-muted cursor-pointer relative group" onClick={() => setLightboxImage(selectedRequest.referenceImage)}>
                      <img src={selectedRequest.referenceImage} alt="Reference Image" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-brown/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Eye className="w-5 h-5 text-cream" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
