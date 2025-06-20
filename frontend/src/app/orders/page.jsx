'use client'
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios from "axios"

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!session) return
    const fetchOrders = async () => {
      try {
        // Google login хэрэглэгчийн email-ээр захиалгыг авна
        const res = await axios.get(
          `http://localhost:5000/api/orders?email=${encodeURIComponent(session.user.email)}`
        )
        setOrders(res.data)
      } catch (err) {
        setError("Захиалга уншихад алдаа гарлаа")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [session])

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600 mb-4">Захиалгаа харахын тулд нэвтэрнэ үү.</p>
        <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Нэвтрэх
        </a>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600 text-center mt-12">{error}</div>
  }

  return (
    <div className="max-w-3xl pt-30 mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="text-4xl">🧾</span>
        Миний захиалгууд
      </h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl shadow">
          <p className="text-lg">Та одоогоор захиалга хийгээгүй байна.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-6 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="font-semibold text-lg text-gray-900">
                  Захиалгын дугаар: <span className="font-mono">{order._id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className="font-bold text-green-700 text-xl">
                  {order.totalPrice.toLocaleString()}₮
                </div>
                <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                  {order.products.length} бүтээгдэхүүн
                </div>
              </div>
              <ul className="mt-2 space-y-1">
                {order.products.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    {p.product && p.product.name ? (
                      <>
                        <span className="font-medium">{p.product.name}</span>
                        <span className="text-gray-400">—</span>
                        <span>{p.quantity} ширхэг</span>
                        {p.size && (
                          <span className="ml-2 text-gray-500">({p.size})</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-red-500">Бүтээгдэхүүний мэдээлэл олдсонгүй</span>
                        <span className="text-gray-400">—</span>
                        <span>{p.quantity} ширхэг</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
