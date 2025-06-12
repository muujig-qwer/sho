'use client'
import { useCart } from '../../context/CartContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import React from 'react'

type CartItem = {
  _id: string
  name: string
  price: number
  quantity: number
}

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart() as {
    cartItems: CartItem[]
    removeFromCart: (id: string) => void
    clearCart: () => void
  }
  const router = useRouter()

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleOrder = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Нэвтрэх шаардлагатай')
      router.push('/login')
      return
    }

    try {
      const products = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }))

      await axios.post(
        'http://localhost:5000/api/orders',
        { products, totalPrice: total },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      router.push('/orders')
    } catch (err) {
      alert('Захиалга үүсгэхэд алдаа гарлаа')
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="cart">🛒</span> Миний сагс
      </h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Сагс хоосон байна</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center border p-4 rounded shadow-sm bg-white">
              <div>
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-600">{item.price}₮ x {item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-600 hover:underline font-medium"
              >
                Устгах
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <div className="font-bold text-xl">Нийт:</div>
            <div className="font-bold text-2xl text-green-700">{total}₮</div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={clearCart}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Сагс хоослох
            </button>
            <button
              onClick={handleOrder}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
            >
              Захиалах
            </button>
          </div>
        </div>
      )}
    </div>
  )
}