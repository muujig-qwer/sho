'use client'
import { useSession } from "next-auth/react"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Уншиж байна...</div>
  if (!session) return <div>Та нэвтрээгүй байна.</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={session.user.image || '/default-avatar.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
          />
        </div>
        <h2 className="text-2xl font-bold text-blue-700 mb-1">{session.user.name}</h2>
        <div className="text-gray-500 mb-4">{session.user.email}</div>
        <button
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
          onClick={() => window.location.href = '/profile/edit'}
        >
          Профайл засах
        </button>
      </div>
    </div>
  )
}