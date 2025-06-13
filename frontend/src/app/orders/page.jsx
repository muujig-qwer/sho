'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
  const fetchOrders = async () => {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    setOrders(res.data)
  }
  fetchOrders()
}, [])

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">🧾 Миний Захиалгууд</h1>
      {orders.length === 0 ? (
        <p>Та одоогоор захиалга хийгээгүй байна.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded">
            <h2 className="font-semibold">Захиалгын дугаар: {order._id}</h2>
            <p>Нийт үнэ: {order.totalPrice}₮</p>
            <p className="text-sm text-gray-500">Огноо: {new Date(order.createdAt).toLocaleString()}</p>
            <ul className="mt-2 list-disc pl-5">
              {order.products.map((p, idx) => (
                <li key={idx}>
                  {p.product && p.product.name ? (
                    <>
                      {p.product.name} — {p.quantity} ширхэг
                    </>
                  ) : (
                    <>
                      Бүтээгдэхүүний мэдээлэл олдсонгүй — {p.quantity} ширхэг
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}
