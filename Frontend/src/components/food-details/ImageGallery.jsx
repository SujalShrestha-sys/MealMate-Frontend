import React from "react";

const ImageGallery = ({ product }) => {
  if (!product) return null;

  // Use product.image (which we normalized in the parent)
  const mainImage = product.image;

  return (
    <div className="bg-green-50/30 p-6 lg:p-10 flex flex-col justify-center h-full">
      {/* Main Image Container */}
      <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg shadow-green-900/5 bg-white mb-6 group">
        <img
          src={mainImage || "/images/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-green-900/20 backdrop-blur-sm animate-fade-in">
              {product.badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
