import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import useCartStore from "../../store/useCartStore";
import Button from "../common/Button";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    getCartCount,
    items,
    getCartTotal,
    updateQuantity,
    clearCart
  } = useCartStore();

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[360px] bg-white shadow-2xl z-101 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Your Selection</h2>
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">{cartCount} items reserved</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {items.length > 0 ? (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3.5 group"
                  >
                    <div
                      className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shrink-0 shadow-sm cursor-pointer"
                      onClick={() => {
                        onClose();
                        navigate(`/food/${item.dishId}`);
                      }}
                    >
                      <img
                        src={item.dish.imageUrl || item.dish.image || "/images/placeholder.jpg"}
                        alt={item.dish.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3
                            className="font-extrabold text-slate-800 text-[13px] leading-tight hover:text-green-700 transition-colors tracking-tight cursor-pointer"
                            onClick={() => {
                              onClose();
                              navigate(`/food/${item.dishId}`);
                            }}
                          >
                            {item.dish.name}
                          </h3>
                          <span className="text-[13px] font-bold text-slate-400 ml-2">Rs. {item.dish.price}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 font-medium tracking-wide">{item.dish.category?.name || "Uncategorized"}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.dishId, -1)}
                            className="p-1 rounded-full hover:bg-white text-slate-400 hover:text-red-500 transition-colors active:scale-90"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-6 text-center text-slate-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.dishId, 1)}
                            className="p-1 rounded-full hover:bg-white text-slate-400 hover:text-green-600 transition-colors active:scale-90"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => updateQuantity(item.dishId, -item.quantity)}
                          className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3 border border-slate-100">
                    <ShoppingBag size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1.5">Your cart is empty</h3>
                  <p className="text-[13px] text-slate-500 mb-6 max-w-[220px]">Explore our menu and discover something delicious to add to your curation.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full px-7 py-2.5"
                    onClick={() => {
                      onClose();
                      navigate("/menu");
                    }}
                  >
                    Browse Menu
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-slate-400 font-extrabold text-[9px] uppercase tracking-[0.2em]">
                    <span>Selection Total</span>
                    <span>Rs. {cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-extrabold text-slate-900 tracking-tight">Total Payment.</span>
                    <span className="text-xl font-extrabold text-green-600 tracking-tight">Rs. {cartTotal}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="primary"
                    className="w-full rounded-2xl py-5 font-bold text-base shadow-xl shadow-green-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => {
                      onClose();
                      navigate("/checkout");
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                  <div className="flex justify-center mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full rounded-2xl py-3.5 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 font-extrabold text-[10px] uppercase tracking-[0.2em]"
                      onClick={clearCart}
                      icon={<Trash2 size={12} />}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
