import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

export default function CustomOrderModal({ open, onClose }) {
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [customSuccess, setCustomSuccess] = useState(false);

  const handleCustomOrderSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setIsSubmittingCustom(true);
    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomSuccess(true);
      } else {
        alert(data.error || "Failed to submit request.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brown/40 backdrop-blur-xs"
          />
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="relative paper rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-card z-10 max-h-[90vh] overflow-y-auto text-brown"
          >
            <span className="tape-sage -top-3 left-12 rotate-[2deg]" />
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            {customSuccess ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-sage mx-auto mb-4" />
                <h3 className="font-display text-2xl text-brown italic">Request Submitted!</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  Mira has received your custom order request. We'll review the description and reach back within 2-3 business days to finalize pricing and deadlines!
                </p>
                <button onClick={onClose} className="btn-sage mt-6">
                  Close Window
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl text-brown italic mb-1">Request a Custom Creation</h3>
                <p className="text-xs text-muted-foreground mb-6">Need a specific color scheme, size, or an entirely new design? Fill out the details below!</p>
                
                <form onSubmit={handleCustomOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm transition"
                      placeholder="Mira Benson"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm transition"
                      placeholder="mira@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Detailed Description</label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm transition resize-none"
                      placeholder="Explain colors, dimensions, shape, references, and details..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-brown mb-1">Est. Budget (₹)</label>
                      <input
                        type="text"
                        name="budget"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm transition"
                        placeholder="e.g. ₹1,000 - ₹5,000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brown mb-1">Deadline Date</label>
                      <input
                        type="date"
                        name="deadline"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 outline-none focus:border-rose focus:ring-1 focus:ring-rose text-sm transition text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown mb-1">Reference Image (Optional)</label>
                    <input
                      type="file"
                      name="referenceImage"
                      accept="image/*"
                      className="w-full px-4 py-2 rounded-xl border border-border bg-cream/50 text-xs text-muted-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose/10 file:text-rose-dark hover:file:bg-rose/20 cursor-pointer outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingCustom}
                    className="btn-sage w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 shadow-md font-medium text-sm mt-4"
                  >
                    {isSubmittingCustom ? "Submitting..." : "Send Request ♡"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
