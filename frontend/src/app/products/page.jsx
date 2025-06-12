"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { jwtDecode } from "jwt-decode";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
    // Админ эсэхийг шалгах
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Устгахдаа итгэлтэй байна уу?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Устгалаа");
      fetchProducts(); // дахин татах
    } catch (err) {
      alert("Устгахад алдаа гарлаа");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Бүтээгдэхүүний жагсаалт</h1>
        {isAdmin && (
          <Link
            href="/products/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Нэмэх
          </Link>
        )}
      </div>
      <div className="grid gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.price}₮</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/products/${product._id}`}
                className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-300"
              >
                Дэлгэрэнгүй
              </Link>
              {isAdmin && (
                <>
                  <Link
                    href={`/products/edit/${product._id}`}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Засах
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Устгах
                  </button>
                </>
              )}
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-red-300"
              >
                Сагсанд нэмэх
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
