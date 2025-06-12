'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProfileEdit() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return setError('Нэвтрээгүй байна')

    axios
      .get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data)
        setName(res.data.name)
      })
      .catch(() => setError('Мэдээлэл авахад алдаа гарлаа'))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Нэвтрээгүй байна')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    if (imageFile) formData.append('image', imageFile)

    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      setMessage(res.data.message)
      setUser(res.data.user)
    } catch {
      setError('Шинэчлэх үед алдаа гарлаа')
    }
  }

  if (error) return <p className="text-red-600 mt-10 text-center">{error}</p>
  if (!user) return <p className="mt-10 text-center">Ачааллаж байна...</p>

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Профайл засах</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label>
          Нэр:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </label>

        <label>
          Зураг:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-1"
          />
        </label>

        {user.image && (
          <img
            src={`http://localhost:5000/uploads/${user.image}`}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Хадгалах
        </button>
      </form>
    </div>
  )
}
