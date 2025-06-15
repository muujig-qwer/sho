'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Нэвтрээгүй байна.')
      return
    }

    axios
      .get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data)
      })
      .catch(() => {
        setError('Мэдээлэл авахад алдаа гарлаа.')
      })
  }, [])

  if (error) {
    return <p className="text-red-600 mt-10 text-center">{error}</p>
  }

  if (!user) {
    return <p className="mt-10 text-center">Ачааллаж байна...</p>
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Миний Профайл</h1>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Зураг */}
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
            <img
              src={`http://localhost:5000/uploads/${user.image || 'placeholder.png'}`}
              alt="Профайл зураг"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Мэдээлэл */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-semibold">Нэр</p>
                <p>{user.name}</p>
              </div>
              <div>
                <p className="font-semibold">Имэйл</p>
                <p>{user.email}</p>
              </div>
              {/* Нэмэлт талбар байвал энд нэмнэ */}
            </div>

            <div className="mt-6 text-center sm:text-left">
              <Link href="/profile/edit">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition">
                  Профайл Засах
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
