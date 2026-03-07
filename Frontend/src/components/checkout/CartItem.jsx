import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

const CartItem = ({ item, updateQuantity }) => {
  const { dish, quantity } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-100 hover:border-green-600/30 transition-all duration-300 shadow-sm"
    >
      {/* Product Image */}
      <div className="relative w-22 h-22 shrink-0">
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover rounded-xl border border-slate-200/20 transition-all duration-300"
        />
        {dish.badge && (
          <span className="absolute -top-1 -left-1 px-1.5 py-0.5 bg-green-600 text-white text-[7px] font-bold rounded-md shadow-sm uppercase tracking-tight">
            {dish.badge}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight transition-colors group-hover:text-green-600 truncate">
            {dish.name}
          </h3>
          <span className="text-base font-bold text-slate-900 whitespace-nowrap">
            Rs. {dish.price.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-sm">
          {dish.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
            Fulfillment
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-100">
            <motion.button
              onClick={() => updateQuantity(dish.id, -1)}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${quantity === 1 ? 'text-slate-400 hover:text-red-500 hover:bg-red-500/10' : 'bg-white text-slate-600 hover:text-green-600 shadow-sm'}`}
            >
              {quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
            </motion.button>
            <span className="text-slate-900 font-bold min-w-[18px] text-center text-sm">{quantity}</span>
            <motion.button
              onClick={() => updateQuantity(dish.id, 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700 shadow-sm transition-colors"
            >
              <Plus size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
