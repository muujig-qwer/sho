// components/BrandProductSlider.jsx
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Star, Clock, Home } from "lucide-react";

export default function BrandProductSlider({ 
  brand, 
  products, 
  showViewAll = true 
}) {
  if (!products || products.length === 0) return null;

  // Filter products by brand if specified
  const filteredProducts = brand 
    ? products.filter(product => 
        product.brand?.toLowerCase() === brand.toLowerCase()
      )
    : products;

  if (filteredProducts.length === 0) return null;

  return (
    <div className="w-full py-8 relative">
      {/* Brand Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Brand Logo */}
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {brand ? brand.charAt(0).toUpperCase() : 'B'}
              </span>
            </div>
            
            {/* Brand Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {brand || 'Featured Brand'}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span>5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>0.51 км</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-green-500" />
                  <span>10:00 - 20:30</span>
                </div>
                <div className="flex items-center gap-1">
                  <Home size={16} className="text-blue-500" />
                  <span>1</span>
                </div>
              </div>
            </div>
          </div>

          {/* View All Link */}
          {showViewAll && (
            <Link 
              href={`/brands/${brand?.toLowerCase()}`} 
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-sm"
            >
              Дэлгүүрт зочлох
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Products Slider */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            prevEl: `.swiper-button-prev-${brand}`,
            nextEl: `.swiper-button-next-${brand}`,
          }}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
          }}
          className="brand-product-slider"
        >
          {filteredProducts.map((product, index) => (
            <SwiperSlide key={`${product._id}-${index}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : product.image
                        ? product.image
                        : "/placeholder.png"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Installment Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <span className="text-[10px]">⚡</span>
                      М
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow opacity-0 group-hover:opacity-100">
                    <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price?.toLocaleString()}₮
                    </span>
                  </div>

                  {/* Product Name */}
                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-blue-600 transition-colors leading-relaxed mb-1">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Product Details */}
                  {product.specifications && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {product.specifications}
                    </p>
                  )}

                  {/* Add to Cart Button */}
                  <button className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                    Сагслах
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className={`swiper-button-prev-${brand} absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-shadow`}>
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <button className={`swiper-button-next-${brand} absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-shadow`}>
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .brand-product-slider .swiper-slide {
          height: auto;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}