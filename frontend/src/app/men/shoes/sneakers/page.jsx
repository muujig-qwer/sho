'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function SneakersPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Та энд API-г өөрийн backend-д тааруулж өөрчилж болно
    axios.get('http://localhost:5000/api/products/category/eregtei/sneakers')
  .then(res => setProducts(res.data))

  }, [])

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Пүүз (Эрэгтэй)</h1>
      {products.length === 0 ? (
        <div>Бүтээгдэхүүн олдсонгүй.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 mb-2 rounded text-gray-400">
                  Зураг байхгүй
                </div>
              )}
              <div className="font-semibold">{product.name}</div>
              <div className="text-gray-600">{product.price}₮</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}