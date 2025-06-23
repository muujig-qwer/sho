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
        {/* Dreame брэндийн бараа */}
        <BrandProductSlider 
          products={featuredProducts}
          showViewAll={true}
        />
        
        {/* Apple брэндийн бараа */}
        <BrandProductSlider 
          brand="Apple"
          products={featuredProducts}
          showViewAll={true}
        />
        
        {/* Samsung брэндийн бараа */}
        <BrandProductSlider 
          brand="Samsung" 
          products={featuredProducts}
          showViewAll={true}
        />
        
        {/* Xiaomi брэндийн бараа */}
        <BrandProductSlider 
          brand="Xiaomi" 
          products={featuredProducts}
          showViewAll={true}
        />
      </section>

      {/* Уриа */}
      <section
        className="w-full h-[400px] bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-center text-white px-4"
        style={{
          backgroundImage:
            "url('https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_2053/cms/3gaucwAUA2KXTW2QeloccX/02d479630932580eb29bc1329e0ec6fd/24Q3_AugustCore_Statement_Module_Site_Desktop_IMG_2880x720.jpg')",
        }}
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Бид илүү сайныг илүү зөвөөр бүтээдэг
        </h2>
        <p className="max-w-2xl text-base md:text-lg mb-4">
          Байгалийн ухаалаг шийдлээс сэдэвлэн бид тав тухтай, хэрэглэхэд таатай
          бүтээгдэхүүн үйлдвэрлэж байна.
        </p>
        <div className="text-xl font-bold italic">
          ECOshop{" "}
          <span className="text-sm block font-normal">БАЙГАЛИЙН УХААНААР</span>
        </div>
      </section>

      {/* Онцлох хэсэг */}
      <section className="w-screen px-4 pt-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative min-h-[500px] rounded-xl overflow-hidden flex">
            <img
              src="https://images.unsplash.com/photo-1612452830710-97cd38a7b6e8?q=80&w=1974&auto=format&fit=crop"
              alt="Эцэгт зориулсан бэлэг"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-10 bg-black/40 p-8 md:p-12 text-white flex flex-col justify-center w-full">
              <h3 className="text-3xl font-bold mb-2">
                Танд хэрэгтэй бүх зүйл энд байна
              </h3>
              <p className="mb-4 text-base">
                Сонгосон бүтээгдэхүүн, онцгой урамшууллууд
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200">
                  Онцлох бараа
                </button>
                <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200">
                  Тусгай бэлгүүд
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {featuredProducts.slice(0, 4).map((product) => {
              const isWished = wishlist.some((p) => p._id === product._id);
              return (
                <div key={product._id} className="group relative">
                  <Link href={`/products/${product._id}`}>
                    <div className="relative overflow-hidden rounded-xl aspect-square bg-gray-100">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : product.image
                            ? product.image
                            : "/placeholder.png"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Нэр, үнэ зураг дотор байрлана */}
                      <div className="absolute bottom-0 left-0 w-full text-black px-4 py-2">
                        <h3 className="font-medium text-sm sm:text-base">
                          {product.name}
                        </h3>
                        <p className="text-black-200 text-sm">
                          {product.price?.toLocaleString()}₮
                        </p>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() =>
                      isWished
                        ? removeFromWishlist(product._id)
                        : addToWishlist(product)
                    }
                    className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow transition ${
                      isWished ? "text-red-500" : "text-gray-400 hover:text-red-500"
                    }`}
                    aria-label="Wishlist"
                  >
                    <FaHeart />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
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