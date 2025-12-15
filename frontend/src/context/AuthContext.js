'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // localStorage-с token болон userId авах
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    if (token && userId) {
      // User байгаа бол тохируулах
      setUser({ token, userId })
    }
    setLoading(false)
  }, [])

  const login = (token, userId) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    setUser({ token, userId })
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
