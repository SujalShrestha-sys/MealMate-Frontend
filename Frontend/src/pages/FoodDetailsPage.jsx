import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// Services
import dishService from "../api/services/dish.service";

// Sub-components
import ImageGallery from "../components/food-details/ImageGallery";
import FoodInfo from "../components/food-details/FoodInfo";
import FoodActions from "../components/food-details/FoodActions";
import FoodTabs from "../components/food-details/FoodTabs";
import RelatedProducts from "../components/food-details/RelatedProducts";

import useCartStore from "../store/useCartStore";
import Skeleton from "../components/common/Skeleton";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

const FoodDetailsPage = () => {
  const { fetchCart, getQuantity, updateQuantity } = useCartStore();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top and fetch cart/product
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCart(); // Sync cart on mount

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await dishService.getSingleDish(id);
        if (response.success) {
          // Normalize data for easy use in sub-components
          const normalized = {
            ...response.data,
            image: response.data.imageUrl || response.data.image,
            categoryName: response.data.category?.name || "Uncategorized",
          };
          setProduct(normalized);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, fetchCart]);

  const quantity = getQuantity(product?.id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb / Back Navigation */}
          <Link
            to="/menu"
            className="inline-flex items-center text-slate-500 hover:text-green-600 transition-colors mb-6 group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 group-hover:border-green-200 group-hover:bg-green-50 group-hover:shadow-sm transition-all duration-300">
              <ChevronLeft
                size={18}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </div>
            <span className="font-medium text-sm">Back to Menu</span>
            {product?.name && (
              <>
                <ChevronRight size={14} className="mx-2 text-slate-300" />
                <span className="text-slate-900 truncate max-w-[200px]">
                  {product.name}
                </span>
              </>
            )}
          </Link>

          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden mb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              {isLoading ? (
                <>
                  {/* Skeleton for Image */}
                  <div className="lg:col-span-7 p-6 border-r border-slate-50 bg-slate-50/30">
                    <Skeleton
                      height="100%"
                      borderRadius="1rem"
                      className="aspect-square"
                    />
                  </div>
                  {/* Skeleton for Content */}
                  <div className="lg:col-span-5 p-8 space-y-8 bg-white">
                    <div className="space-y-4">
                      <Skeleton width="40%" height="0.75rem" />
                      <Skeleton width="80%" height="2.5rem" />
                      <Skeleton width="30%" height="1.5rem" />
                    </div>
                    <div className="space-y-4 py-8 border-y border-slate-100">
                      <Skeleton height="0.75rem" />
                      <Skeleton height="0.75rem" />
                      <Skeleton width="60%" height="0.75rem" />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Skeleton
                        width="120px"
                        height="3.5rem"
                        borderRadius="999px"
                      />
                      <Skeleton
                        className="flex-1"
                        height="3.5rem"
                        borderRadius="999px"
                      />
                    </div>
                  </div>
                </>
              ) : !product ? (
                <div className="lg:col-span-12 py-20 text-center">
                  <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-slate-300" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Dish not found
                  </h2>
                  <p className="text-slate-500 mt-2 mb-6">
                    This dish might have been removed or is unavailable.
                  </p>
                  <Link
                    to="/menu"
                    className="text-green-600 font-semibold hover:underline"
                  >
                    Return to Menu
                  </Link>
                </div>
              ) : (
                <>
                  {/* Left Column: Image Gallery (Span 7) */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7 flex flex-col justify-center border-r border-slate-50"
                  >
                    <ImageGallery key={product.id} product={product} />
                  </motion.div>

                  {/* Right Column: Details (Span 5) */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 p-8 flex flex-col relative bg-white"
                  >
                    <FoodInfo product={product} />
                    <FoodActions
                      product={product}
                      quantity={quantity}
                      updateQuantity={updateQuantity}
                    />
                  </motion.div>
                </>
              )}
            </div>

            {/* Tabs Section - Only show when loaded */}
            {!isLoading && product && <FoodTabs />}
          </div>

          {/* Related Items Section - Only show when loaded */}
          {!isLoading && product && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RelatedProducts currentProduct={product} />
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FoodDetailsPage;
