'use client'
import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product, selectedSize) => {
    setCartItems((prev) => {
      const exists = prev.find(
        (item) =>
          item._id === product._id &&
          item.size === (product.size || selectedSize)
      )
      if (exists) {
        return prev.map((item) =>
          item._id === product._id && item.size === (product.size || selectedSize)
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        )
      }
      return [
        ...prev,
        {
          ...product,
          size: selectedSize,
          image: product.images?.[0] || '',
          quantity: product.quantity || 1,
        },
      ]
    })
  }

  const removeFromCart = (id, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item._id === id && item.size === size))
    )
  }

  const clearCart = () => setCartItems([])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
