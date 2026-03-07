import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import useCartStore from "../store/useCartStore";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    getCartDetails,
    getCartTotal,
    updateQuantity,
    clearCart
  } = useCartStore();

  const cartDetails = getCartDetails();
  const cartTotal = getCartTotal();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link to="/menu" className="inline-flex items-center gap-2 text-slate-500 hover:text-green-600 font-bold text-xs transition-colors mb-4 uppercase tracking-widest group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Continue Selection
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Your <span className="text-green-600">Selection.</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Review and refine your curated meals before checkout.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartDetails.length > 0 ? (
                cartDetails.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex gap-5 items-center hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 cursor-pointer"
                      onClick={() => navigate(`/food/${item.id}`)}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className="font-bold text-slate-800 text-lg hover:text-green-600 transition-colors cursor-pointer"
                          onClick={() => navigate(`/food/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        <span className="font-bold text-slate-900">Rs. {item.price * item.quantity}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-4">{item.category}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 rounded-full hover:bg-white text-slate-400 hover:text-red-500 transition-colors active:scale-90"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-6 text-center text-slate-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 rounded-full hover:bg-white text-slate-400 hover:text-green-600 transition-colors active:scale-90"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => updateQuantity(item.id, -item.quantity)}
                          className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-4xl p-12 text-center border border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6 border border-slate-100">
                    <ShoppingBag size={36} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Empty Curation</h2>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto font-medium">Your selection is currently empty. Head over to the menu to find something great.</p>
                  <Button
                    variant="primary"
                    className="rounded-full px-10 py-3 font-bold"
                    onClick={() => navigate("/menu")}
                  >
                    Explore Menu
                  </Button>
                </div>
              )}
            </div>

            {/* Summary Sidebar */}
            {cartDetails.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm sticky top-28">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Summary</h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Subtotal</span>
                      <span className="text-slate-900 font-bold">Rs. {cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Service Fee</span>
                      <span className="text-green-600 font-bold italic underline">FREE</span>
                    </div>
                    <div className="h-px bg-slate-100 my-2" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-black text-green-600 tracking-tight">Rs. {cartTotal}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      className="w-full rounded-2xl py-4.5 font-bold shadow-xl shadow-green-600/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                    </Button>
                    <button
                      onClick={clearCart}
                      className="w-full py-3.5 text-slate-400 hover:text-red-500 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors"
                    >
                      Clear All Selection
                    </button>
                  </div>

                  <div className="mt-8 p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
                    <p className="text-[10px] text-green-700/70 leading-relaxed text-center font-medium">
                      Orders are handcrafted fresh for your selected pickup timeline. Skip the queue and eat better.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
