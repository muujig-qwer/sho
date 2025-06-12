'use client'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef(null)

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
    setImageLoading(false)
  }

  // Зураг upload хийх функц
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setImageLoading(true)
    setImageError(false)
    
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const res = await axios.post('http://localhost:5000/api/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setImage(res.data.url) // backend-аас ирсэн зурагны url-г хадгална
    } catch {
      alert('Зураг upload хийхэд алдаа гарлаа')
      setImageError(true)
    } finally {
      setImageLoading(false)
    }
  }

  // Найдвартай sneaker зургийн жагсаалт
  const sneakerImageUrls = [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop&crop=center'
  ]

  // Random sneaker зураг үүсгэх
  const generateRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * sneakerImageUrls.length)
    const imageUrl = sneakerImageUrls[randomIndex]
    setImage(imageUrl)
    setImageError(false)
  }

  // Placeholder зураг үүсгэх
  const generatePlaceholderImage = () => {
    const randomNum = Math.floor(Math.random() * 1000)
    const imageUrl = `https://via.placeholder.com/400x400/007bff/ffffff?text=Sneaker+${randomNum}`
    setImage(imageUrl)
    setImageError(false)
  }

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
        
        {/* Зурагны хэсэг - засварласан */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Зураг</label>
          
          {/* Одоогийн зураг харуулах */}
          {image && (
            <div className="relative">
              {imageLoading && (
                <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-sm text-gray-500">Ачааллаж байна...</span>
                </div>
              )}
              
              {!imageError && !imageLoading && (
                <img
                  src={getImageUrl(image)}
                  alt="Бүтээгдэхүүний зураг"
                  className="w-32 h-32 object-cover rounded border"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}
              
              {imageError && (
                <div className="w-32 h-32 bg-gray-100 rounded border flex flex-col items-center justify-center p-2">
                  <span className="text-xs text-red-500 text-center mb-2">
                    Зураг ачаалж чадсангүй
                  </span>
                  <button
                    type="button"
                    className="bg-blue-400 text-white px-2 py-1 rounded text-xs hover:bg-blue-500"
                    onClick={() => {
                      setImageError(false)
                      // Дахин ачаалахыг оролдох
                      const img = new Image()
                      img.onload = () => setImageError(false)
                      img.onerror = () => setImageError(true)
                      img.src = getImageUrl(image)
                    }}
                  >
                    Дахин оролдох
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* URL input */}
          <input
            type="text"
            placeholder="Зурагны URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border p-2 rounded"
          />
          
          {/* File upload */}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Файл сонгох
            </button>
            
            <button
              type="button"
              className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
              onClick={generateRandomImage}
            >
              Sneaker зураг
            </button>
            
            <button
              type="button"
              className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
              onClick={generatePlaceholderImage}
            >
              Placeholder зураг
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Засах
        </button>
      </form>
    </div>
  )
}