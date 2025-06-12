'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div className="text-center mt-10">Ачааллаж байна...</div>
  if (!product) return null

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="mb-2 text-gray-700">Үнэ: {product.price}₮</p>
      {product.image && (
        <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="w-full h-64 object-cover rounded mb-4" />
      )}
      <p className="whitespace-pre-line">{product.description}</p>
    </div>
  )
}
