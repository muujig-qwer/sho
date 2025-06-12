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
    <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Миний Профайл</h1>
      <div className="flex flex-col items-center space-y-4">
        {user.image && (
          <img
            src={`http://localhost:5000/uploads/${user.image}`}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        )}
        <p>
          <strong>Нэр:</strong> {user.name}
        </p>
        <p>
          <strong>Имэйл:</strong> {user.email}
        </p>
        <Link href="/profile/edit">
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Профайл Засах
          </button>
        </Link>
      </div>
    </div>
  )
}