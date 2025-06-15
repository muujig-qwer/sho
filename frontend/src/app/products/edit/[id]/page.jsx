'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

const defaultSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']

export default function EditProductPage() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState([''])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('') // null биш!
  const [sizes, setSizes] = useState([]) // Шинэ нэмэлт
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const { id } = useParams()

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
    axios.get('http://localhost:5000/api/categories').then((res) => {
      setCategories(res.data)
    })
    // Бүтээгдэхүүний мэдээлэл авах
    axios.get(`http://localhost:5000/api/products/${id}`).then((res) => {
      setName(res.data.name)
      setPrice(res.data.price)
      setDescription(res.data.description)
      setCategory(res.data.category)
      // images массивыг URL болон filename-аар ялгаж харуулна
      if (res.data.images && res.data.images.length > 0) {
        const urls = res.data.images.filter(img => img.startsWith('http'))
        setImageUrls(urls.length ? urls : [''])
      }
      // Хэмжээ массивыг populate хийх
      if (res.data.sizes && res.data.sizes.length > 0) {
        setSizes(res.data.sizes)
      }
    })
  }, [id])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
  }

  const handleImageUrlChange = (idx, value) => {
    const newUrls = [...imageUrls]
    newUrls[idx] = value
    setImageUrls(newUrls)
  }

  const addImageUrlInput = () => {
    setImageUrls([...imageUrls, ''])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Нэвтэрч орно уу')
      router.push('/login')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', price)
      formData.append('description', description)
      formData.append('category', category)
      images.forEach((img) => formData.append('images', img))
      imageUrls
        .filter((url) => url.trim() !== '')
        .forEach((url) => formData.append('imageUrls', url))
      // Хэмжээг массив хэлбэрээр илгээнэ
      sizes.forEach((size) => formData.append('sizes', size))

      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      alert('Бүтээгдэхүүн амжилттай шинэчлэгдлээ!')
      router.push('/products')
    } catch (err) {
      alert('Алдаа гарлаа: ' + (err.response?.data?.message || 'Unknown error'))
    }
  }

  if (!isAdmin) {
    return <p className="mt-10 text-center">Ачааллаж байна...</p>
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Бүтээгдэхүүн засах</h1>
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
        <div>
          <label className="block mb-1 font-medium">Зураг upload хийх</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Зурагны URL-ууд</label>
          {imageUrls.map((url, idx) => (
            <div key={idx} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Зурагны URL"
                value={url}
                onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                className="w-full border p-2 rounded"
              />
              {idx === imageUrls.length - 1 && (
                <button
                  type="button"
                  onClick={addImageUrlInput}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
        <select
          value={category || ''}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Ангилал сонгох</option>
          {categories
            .filter((cat) => cat.parent)
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
        <div>
          <label className="block font-medium mb-2">Хэмжээ</label>
          <div className="grid grid-cols-5 gap-2">
            {defaultSizes.map(size => (
              <label key={size} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={size}
                  checked={sizes.includes(size)}
                  onChange={e => {
                    if (e.target.checked) setSizes([...sizes, size])
                    else setSizes(sizes.filter(s => s !== size))
                  }}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Шинэчлэх
        </button>
      </form>
    </div>
  )
}