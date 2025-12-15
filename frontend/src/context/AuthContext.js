'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      // localStorage-с token болон userId авах
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      
      if (token && userId) {
        try {
          // Backend-аас user profile fetch хийх
          const res = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          })
          
          // User мэдээллийг token-тэй хамт хадгалах
          setUser({ 
            token, 
            userId,
            email: res.data.email,
            name: res.data.name,
            role: res.data.role,
            image: res.data.image
          })
        } catch (err) {
          console.error('Failed to load user profile:', err)
          // Token буруу бол localStorage цэвэр��эх
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          setUser(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  const login = (token, userId, userData = {}) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    
    setUser({ 
      token, 
      userId,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      image: userData.image
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
