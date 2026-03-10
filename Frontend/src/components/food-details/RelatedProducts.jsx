import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import dishService from "../../api/services/dish.service";

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentProduct?.category?.name) return;

    const fetchRelated = async () => {
      setIsLoading(true);
      try {
        const response = await dishService.getByCategory(currentProduct.category.name, 1, 6);
        if (response.success) {
          // Filter out the current product itself
          setRelatedProducts(response.data.filter(p => p.id !== currentProduct.id));
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [currentProduct]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (relatedProducts.length === 0) return null;

  return (
    <div className="animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        You might also like
        <span className="h-px bg-slate-200 flex-1 ml-4"></span>
      </h3>
      <div className="flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 scrollbar-hide snap-x">
        {relatedProducts.map((related) => (
          <Link
            key={related.id}
            to={`/food/${related.id}`}
            className="min-w-[200px] w-[200px] snap-start bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-4/3 bg-slate-100 relative">
              <img
                src={related.imageUrl || related.image || "/images/placeholder.jpg"}
                alt={related.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-slate-800 text-sm truncate mb-1">
                {related.name}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold text-sm">
                  NPR {related.price}
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <ChevronLeft size={14} className="rotate-180" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
