'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
  })

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
    // Админ болсны дараа статистик авах
    if (isAdmin) {
      const fetchStats = async () => {
        try {
          const [productsRes, usersRes, ordersRes] = await Promise.all([
            axios.get('http://localhost:5000/api/products'),
            axios.get('http://localhost:5000/api/auth/users', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
            axios.get('http://localhost:5000/api/orders', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
          ])
          setStats({
            products: productsRes.data.length,
            users: usersRes.data.length,
            orders: ordersRes.data.length,
          })
        } catch (e) {
          // алдаа гарвал статистик харуулахгүй
        }
      }
      fetchStats()
    }
  }, [isAdmin])

  if (!isAdmin) {
    return <p className="mt-10 text-center">Ачааллаж байна...</p>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Админ Хяналтын Самбар</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 rounded-lg p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-blue-700">{stats.products}</span>
          <span className="mt-2 text-lg text-gray-700">Бүтээгдэхүүн</span>
        </div>
        <div className="bg-green-100 rounded-lg p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-green-700">{stats.users}</span>
          <span className="mt-2 text-lg text-gray-700">Хэрэглэгч</span>
        </div>
        <div className="bg-yellow-100 rounded-lg p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-yellow-700">{stats.orders}</span>
          <span className="mt-2 text-lg text-gray-700">Захиалга</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {isAdmin && (
          <div className="flex-1 bg-gray-50 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Шинэ бүтээгдэхүүн нэмэх</h2>
            <a
              href="/products/add"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Бүтээгдэхүүн нэмэх
            </a>
          </div>
        )}
        <div className="flex-1 bg-gray-50 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Захиалгуудыг харах</h2>
          <a
            href="/admin/orders"
            className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            Захиалгууд
          </a>
        </div>
      </div>
      {/* Энд цаашид хүссэн хүснэгт, график, мэдээллээ нэмээрэй */}
    </div>
  )
}