'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`)
        setProduct(res.data)
      } catch (error) {
        alert('Бүтээгдэхүүн олдсонгүй')
        router.push('/products')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, router])

  // Зурагны URL-г зөв форматлах функц
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    
    // Хэрэв HTTP эсвэл HTTPS-ээр эхэлж байвал шууд буцаах
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    
    // Үгүй бол localhost server-ийн uploads folder-аас авах
    return `http://localhost:5000/uploads/${imageUrl}`
  }

  // Зурагны алдааг шийдвэрлэх функц
  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageError(false)
  }

  if (loading) return <div className="text-center mt-10">Ачааллаж байна...</div>
  if (!product) return null

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Зурагны хэсэг */}
        {product.image && (
          <div className="relative">
            {!imageError ? (
              <img 
                src={getImageUrl(product.image)} 
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex flex-col items-center justify-center">
                <div className="text-gray-500 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">Зураг ачаалж чадсангүй</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Зураг: {product.image}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Бүтээгдэхүүний мэдээлэл */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
          
          <div className="mb-6">
            <span className="text-2xl font-bold text-green-600">{product.price}₮</span>
          </div>

          {product.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Тайлбар:</h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Товчнууд */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Буцах
            </button>
            
          </div>
        </div>
      </div>

      {/* Debug мэдээлэл (development-д л харагдана) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug мэдээлэл:</h3>
          <p className="text-sm text-gray-600">
            Зурагны URL: {getImageUrl(product.image)}
          </p>
          <p className="text-sm text-gray-600">
            Анхны зураг: {product.image}
          </p>
          <p className="text-sm text-gray-600">
            Зурагны алдаа: {imageError ? 'Тийм' : 'Үгүй'}
          </p>
        </div>
      )}
    </div>
  )
}