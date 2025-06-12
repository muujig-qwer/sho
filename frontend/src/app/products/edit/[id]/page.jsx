'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`)
        const product = res.data
        setName(product.name)
        setPrice(product.price)
        setDescription(product.description)
        setImage(product.image)
      } catch (err) {
        alert('Бүтээгдэхүүн олдсонгүй')
        router.push('/products')
      }
    }

    fetchProduct()
  }, [id, router])

  const handleUpdate = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Нэвтэрч орно уу')
      router.push('/login')
      return
    }

    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        { name, price, description, image },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Амжилттай заслаа!')
      router.push('/products')
    } catch (err) {
      alert('Засахад алдаа гарлаа')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Бүтээгдэхүүн засах</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Нэр"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Үнэ"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Тайлбар"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
        />
        <input
          type="text"
          placeholder="Зурагны URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Засах
        </button>
      </form>
    </div>
  )
}
