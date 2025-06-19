'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setError('Профайл уншихад алдаа гарлаа'))
  }, [])

  if (error) {
    return <div className="text-red-600 text-center mt-12">{error}</div>
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={user.image ? `http://localhost:5000/uploads/${user.image}` : '/default-avatar.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
          />
          <span className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-blue-700 mb-1">{user.name}</h2>
        <div className="text-gray-500 mb-4">{user.email}</div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">ID:</span>
            <span className="text-gray-700 font-mono text-xs">{user._id}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Бүртгүүлсэн:</span>
            <span className="text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Төрөл:</span>
            <span className="text-gray-700 capitalize">{user.role}</span>
          </div>
        </div>
        <button
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
          onClick={() => window.location.href = '/updateprofile'}
        >
          Профайл засах
        </button>
      </div>
    </div>
  )
}
