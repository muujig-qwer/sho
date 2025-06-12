'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

export default function AddProductPage() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    try {
      const decoded = jwtDecode(token)
      if (decoded.role === 'admin') {
        setIsAdmin(true)
      } else {
        router.push('/')
      }
    } catch {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    // Category-уудыг татах
    axios.get('http://localhost:5000/api/categories').then((res) => {
      setCategories(res.data)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Нэвтэрч орно уу')
      router.push('/login')
      return
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/products',
        { name, price, description, image, category },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Бүтээгдэхүүн нэмэгдлээ!')
      router.push('/products')
    } catch (err) {
      alert('Алдаа гарлаа: ' + err.response?.data?.message || 'Unknown error')
    }
  }

  if (!isAdmin) {
    return <p className="mt-10 text-center">Ачааллаж байна...</p>
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Бүтээгдэхүүн нэмэх</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Ангилал сонгох</option>
          {categories
            .filter((cat) => cat.parent) // зөвхөн эцэгтэй (sub-category) ангиллуудыг харуулна
            .map((cat) => {
              const parent = categories.find((c) => c._id === cat.parent)
              const label = parent ? `${cat.name} (${parent.name})` : cat.name
              return (
                <option key={cat._id} value={cat._id}>
                  {label}
                </option>
              )
            })}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Нэмэх
        </button>
      </form>
    </div>
  )
}
