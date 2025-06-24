"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import CategorySlider from "@/components/CategorySlider";
import DiscountSlider from "@/components/DiscountSlider";
import BrandProductSlider from "@/components/BrandProductSlider";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "@/context/WishlistContext";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [openParent, setOpenParent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data));
    axios
      .get("http://localhost:5000/api/products?featured=true")
      .then((res) => setFeaturedProducts(res.data));

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const parentCategories = categories.filter((cat) => !cat.parent);
  const getChildCategories = (parentId) =>
    categories.filter((cat) => cat.parent === parentId);

  // Хямдралтай бараануудыг шүүх
  const discountedProducts = featuredProducts.filter(
    (p) => p.discount && p.discountPrice
  );

  const featuredCategoryId = "685a77b1a79b80fa8a74a637";
  const featuredCategoryProducts = featuredProducts.filter(
    (p) => p.category === featuredCategoryId || (p.category?._id === featuredCategoryId)
  );

  return (
    <div className=" text-gray-800 font-montserrat">
      {/* Category Slider - Hero section-ий ДЭЭР */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <CategorySlider categories={parentCategories} />
      </section>

      {/* Hero section-ийг устгаад DiscountSlider-ийг оруулна */}
      <section className="max-w-7xl mx-auto px-4 pt-0 bg-white rounded-xl shadow">
        <DiscountSlider products={featuredProducts} />
      </section>

      {/* Brand Product Sliders */}
      <section className="max-w-7xl mx-auto  px-4 pt-0 mt-8 bg-white rounded-xl shadow">
        {/* Зөвхөн 685a77b1a79b80fa8a74a637 category-тай бүтээгдэхүүнүүд */}
        <BrandProductSlider
          brand={"Tsahilgaan baraa"}
          products={featuredCategoryProducts}
          showViewAll={true}
        />
        {/* Хэрвээ Apple, Samsung гэх мэт бусад брэнд slider-ууд хэрэггүй бол устгаарай */}
      </section>

      

      

      {/* Онцлох carousel */}
      <h2 className="text-xl font-bold mb-1 mt-0">
        Онцгой бүтээгдэхүүнүүд
      </h2>
      <FeaturedCarousel products={featuredProducts} />

      {/* Шуудангийн мэдээ */}
      <section className="bg-gray-100 mt-10 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Манай нэгдэлд нэгдээрэй</h2>
          <p className="text-gray-600 mb-6">
            Онцгой хямдрал, хэрэгцээт зөвлөгөө болон шинэ бүтээгдэхүүний
            мэдээлэл шууд танд хүрнэ.
          </p>
          <form className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="И-мэйл хаяг"
              className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition"
            >
              Бүртгүүлэх
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}