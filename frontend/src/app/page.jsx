'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [openParent, setOpenParent] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
    axios.get('http://localhost:5000/api/products?featured=true')
      .then(res => setFeaturedProducts(res.data))
  }, [])

  // Parent category-ууд (эцэггүй)
  const parentCategories = categories.filter(cat => !cat.parent)

  // Сонгосон parent-ийн child category-ууд
  const getChildCategories = (parentId) =>
    categories.filter(cat => cat.parent === parentId)

  return (
    <div>
      {/* Navbar хэсгийг устгана */}
      {/* Hero section */}
      <div className="w-full h-72 bg-[url('/banner.jpg')] bg-cover bg-center flex items-center justify-center mb-10">
        <div className="bg-white/80 p-8 rounded shadow text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Тавтай морил!</h1>
          <p className="text-lg text-gray-600">Таны өдөр тутмын хэрэгцээнд зориулсан чанартай бүтээгдэхүүнүүд</p>
        </div>
      </div>

      {/* Category showcase */}
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Ангиллууд</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {parentCategories.map(parent => (
            <div key={parent._id} className="relative">
              <button
                className="w-full block bg-gray-100 rounded-lg shadow hover:shadow-lg transition p-8 text-center text-xl font-semibold"
                onClick={() => setOpenParent(openParent === parent._id ? null : parent._id)}
              >
                <div className="text-3xl mb-4">👟</div>
                {parent.name}
              </button>
              {/* Slide-down child categories */}
              <div
                className={`absolute left-0 right-0 z-10 bg-white rounded-lg shadow transition-all duration-300 overflow-hidden
                  ${openParent === parent._id ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}
                `}
                style={{ top: '100%' }}
              >
                <div className="p-4 flex flex-col gap-2">
                  {getChildCategories(parent._id).length === 0 && (
                    <span className="text-gray-400 text-center">Дэд ангилал алга</span>
                  )}
                  {getChildCategories(parent._id).map(child => (
                    <Link
                      key={child._id}
                      href={`/products?category=${child._id}`}
                      className="block px-4 py-2 rounded hover:bg-blue-100 text-left"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured products */}
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Онцлох бүтээгдэхүүнүүд</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition p-4 text-center"
            >
              <img
                src={product.image ? product.image : "/placeholder.png"}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <div className="font-semibold">{product.name}</div>
              <div className="text-gray-600">{product.price}₮</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}