"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import dynamic from "next/dynamic";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "@/context/WishlistContext";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
import ReactMarkdown from "react-markdown";

const fallbackImg = "/fallback.jpg"; // public/fallback.jpg байрлуулна

function ProductImages({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [imgError, setImgError] = useState(false);

  const getImageUrl = (img) => {
    if (!img) return fallbackImg;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `http://localhost:5000/uploads/${img}`;
  };

  return (
    <div>
      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
        <img
          src={imgError ? fallbackImg : getImageUrl(selectedImage)}
          alt="Бүтээгдэхүүний зураг"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={getImageUrl(img)}
            alt={`Зураг ${i + 1}`}
            className={`aspect-square rounded-lg object-cover cursor-pointer border-2 transition-all duration-200
              ${
                selectedImage === img
                  ? "border-blue-500 scale-105"
                  : "border-transparent"
              }
              hover:border-blue-400 hover:scale-105`}
            onClick={() => {
              setSelectedImage(img);
              setImgError(false);
            }}
            onError={(e) => {
              e.target.src = fallbackImg;
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        alert("Бүтээгдэхүүн олдсонгүй");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/${id}/comments`
        );
        setComments(res.data);
      } catch (error) {
        console.error("Сэтгэгдэл ачаалж чадсангүй:", error);
      }
    };

    if (id) {
      fetchProduct();
      fetchComments();
    }
  }, [id, router]);

  const handleAddToCart = () => {
    if (product.category === "shoes" && !selectedSize) {
      alert("Хэмжээгээ сонгоно уу");
      return;
    }
    addToCart(
      {
        ...product,
        size: selectedSize,
        image: product.images?.[0] || "",
        quantity,
      },
      selectedSize
    );
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim()) {
      alert("Нэр болон сэтгэгдлээ бичнэ үү");
      return;
    }

    setCommentsLoading(true);
    try {
      const commentData = {
        author: commentAuthor,
        comment: newComment,
        rating: rating,
        date: new Date().toISOString(),
      };

      const res = await axios.post(
        `http://localhost:5000/api/products/${id}/comments`,
        commentData
      );
      setComments([res.data, ...comments]);
      setNewComment("");
      setCommentAuthor("");
      setRating(5);
      alert("Сэтгэгдэл амжилттай нэмэгдлээ!");
    } catch (error) {
      console.error("Сэтгэгдэл нэмж чадсангүй:", error);
      alert("Сэтгэгдэл нэмж чадсангүй");
    } finally {
      setCommentsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const allSizes = [
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
  ];
  const availableSizes = product.sizes || [];

  // Дундаж үнэлгээ
  const avgRating =
    comments.length > 0
      ? (
          comments.reduce((acc, c) => acc + c.rating, 0) / comments.length
        ).toFixed(1)
      : 0;

  // Энэ product wishlist-д байгаа эсэхийг шалгах
  const isWished = wishlist.some((p) => p._id === product._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white/80 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-gray-900 font-semibold transition"
            >
              Нүүр
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => router.push("/products")}
              className="text-gray-500 hover:text-gray-900 font-semibold transition"
            >
              Бүтээгдэхүүн
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-bold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Буцах товчийг энд байрлуулна */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-blue-700 font-semibold transition mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Буцах
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Product Images & Info - 1 шугаманд (хажуу талдаа) */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Зураг хэсэг */}
          <div className="md:w-1/2 w-full">
            <div className="space-y-6">
              <ProductImages images={product.images} />
            </div>
          </div>
          {/* Мэдээлэл хэсэг */}
          <div className="md:w-1/2 w-full">
            {/* Product Info, Title, Price, Size, Add to cart гэх мэт */}
            <div className="space-y-10">
              {/* Product Title & Price */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                  {product.name}
                </h1>
                <div>
                  {product.discount > 0 ? (
                    <div className="flex items-end gap-3">
                      <span className="text-3xl font-bold text-green-700">
                        {product.discountPrice?.toLocaleString()}₮
                      </span>
                      <span className="line-through text-gray-400 text-xl font-semibold">
                        {product.price?.toLocaleString()}₮
                      </span>
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-sm font-bold rounded">
                        -{product.discount}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-green-700">
                      {product.price?.toLocaleString()}₮
                    </p>
                  )}
                  <div className="flex items-center space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          avgRating >= star
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 font-semibold text-gray-700">
                      {avgRating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Тайлбар</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4 pt-8 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900">Хэмжээ</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {allSizes.map((size) => {
                      const isAvailable = availableSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          className={`py-3 px-4 border rounded-lg text-center font-medium transition-all
                            ${
                              selectedSize === size && isAvailable
                                ? "border-gray-900 bg-gray-900 text-white"
                                : ""
                            }
                            ${
                              !isAvailable
                                ? "border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-100"
                                : "border-gray-200 hover:border-gray-400 text-gray-900"
                            }
                          `}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Тоо ширхэг</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-xl w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-700 text-white py-4 rounded-full font-bold text-lg shadow hover:bg-blue-800 transition"
                >
                  🛒 Сагсанд нэмэх
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    console.log("Wishlist товч дарагдлаа");
                    if (isWished) {
                      removeFromWishlist(product._id);
                    } else {
                      addToWishlist(product);
                    }
                  }}
                  className={`w-full border border-gray-300 text-gray-900 py-4 rounded-full font-semibold text-lg hover:border-blue-400 transition ${
                    isWished ? "bg-red-100 text-red-600 border-red-200" : ""
                  }`}
                >
                  {isWished
                    ? "♥ Хүслийн жагсаалтад байгаа"
                    : "♡ Хүслийн жагсаалтанд нэмэх"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* perk heseg  */}
        <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 py-16 mt-16 rounded-2xl">
          <div className="max-w-none px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* 1-р perk */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 py-8 w-full">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    ҮНЭГҮЙ ХҮРГЭЛТ
                  </h3>
                  <p className="text-gray-600 text-sm">
                    100,000₮-аас дээш захиалгад
                  </p>
                </div>
              </div>
              {/* 2-р perk */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 py-8 w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    ХЯЛБАР БУЦААЛТ
                  </h3>
                  <p className="text-gray-600 text-sm">30 хоногийн дотор</p>
                </div>
              </div>
              {/* 3-р perk */}
              <div className="flex flex-col items-center justify-center py-8 w-full">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    ДЭЛГҮҮРТ ЗОЧЛОХ
                  </h3>
                  <p className="text-gray-600 text-sm underline cursor-pointer hover:text-blue-600">
                    Дэлгүүрийн байршил харах
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="w-full bg-white py-12 mt-16 border-t border-gray-100">
          <div className="max-w-2xl mx-auto px-4">
            {/* Add Comment Form - Эхэнд нь */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 mb-12">
              <h3 className="text-base font-semibold text-gray-800 mb-4 text-center">
                Сэтгэгдэл үлдээх
              </h3>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Таны нэр"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    required
                  />
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none"
                    required
                  >
                    <option value="">Үнэлгээ</option>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>
                        {star} ★
                      </option>
                    ))}
                  </select>
                </div>
                {/* Text editor */}
                <MDEditor
                  value={newComment}
                  onChange={setNewComment}
                  height={120}
                  preview="edit"
                  placeholder="Сэтгэгдэлээ бичнэ үү..."
                />
                <button
                  type="submit"
                  disabled={commentsLoading}
                  className="w-full bg-gray-900 text-white py-2 rounded font-semibold hover:bg-gray-800 transition disabled:opacity-60"
                >
                  {commentsLoading ? "Илгээж байна..." : "Илгээх"}
                </button>
              </form>
            </div>

            {/* Comment List - Дараа нь */}
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
                Сэтгэгдлүүд
              </h2>
              {comments.length === 0 ? (
                <div className="text-center text-gray-400 py-8 border rounded-lg">
                  Одоогоор сэтгэгдэл байхгүй байна.
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 border-b last:border-b-0 border-gray-100 pb-6"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-lg">
                      {comment.author?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(comment.date)}
                        </span>
                        <div className="flex items-center ml-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-sm ${
                                star <= comment.rating
                                  ? "text-yellow-400"
                                  : "text-gray-200"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        <ReactMarkdown>{comment.comment}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
