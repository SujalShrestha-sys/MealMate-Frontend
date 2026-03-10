import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/common/Navbar";
import { Sparkles, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Footer from "../components/common/Footer";
import MenuFilters from "../components/menu/MenuFilters";
import MenuGrid from "../components/menu/MenuGrid";
import PromoBanner from "../components/menu/PromoBanner";
import { motion } from "motion/react";

import dishService from "../api/services/dish.service";
import categoryService from "../api/services/category.service";

import useCartStore from "../store/useCartStore";
import MenuCardSkeleton from "../components/common/MenuCardSkeleton";

const MenuPage = () => {
  const { fetchCart } = useCartStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  // Fetch Categories and Cart
  useEffect(() => {
    fetchCart();
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (response.success) {
          const catNames = response.data
            .filter(
              (cat) => cat.isActive && cat.dishes && cat.dishes.length > 0,
            )
            .map((cat) => cat.name);
          setCategories(["All", ...catNames]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchDishes = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (searchQuery) {
        response = await dishService.searchDishes(
          searchQuery,
          currentPage,
          itemsPerPage,
        );
      } else if (activeCategory !== "All") {
        response = await dishService.getByCategory(
          activeCategory,
          currentPage,
          itemsPerPage,
        );
      } else {
        response = await dishService.getAllDishes(currentPage, itemsPerPage);
      }

      if (response.success) {
        setItems(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch dishes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, searchQuery, currentPage]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // Handlers for filter/search changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        {/* Promotional Banner */}
        <PromoBanner />
        {/* Search & Filter - Separated Component (No Sticky) */}
        <MenuFilters
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
        />
        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <MenuCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <MenuGrid products={items} />
            </motion.div>
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-medium transition ${
                      currentPage === page
                        ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
