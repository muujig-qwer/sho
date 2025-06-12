'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import {
  FaMale, FaFemale, FaChild, FaBoxOpen, FaShoppingCart,
  FaClipboardList, FaUser, FaSignInAlt, FaUserPlus,
  FaSignOutAlt, FaTachometerAlt, FaBoxes, FaChevronDown
} from 'react-icons/fa'

function IconLink({ href, Icon, tooltip }) {
  return (
    <Link href={href} title={tooltip} className="relative group">
      <Icon className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
      <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-700 text-white text-xs rounded px-2 py-1 transition-all duration-200 whitespace-nowrap z-50">
        {tooltip}
      </span>
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState('')
  const [userName, setUserName] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [menDropdownOpen, setMenDropdownOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setIsLoggedIn(true)
        setRole(decoded.role || '')
        setUserName(decoded.name || '')
      } catch {
        setIsLoggedIn(false)
        setRole('')
        setUserName('')
        localStorage.removeItem('token')
      }
    } else {
      setIsLoggedIn(false)
      setRole('')
      setUserName('')
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  useEffect(() => {
    if (!menDropdownOpen) return
    const handleClick = (e) => {
      if (!e.target.closest('#men-dropdown-parent')) {
        setMenDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menDropdownOpen])

  const menSubcategories = [
    {
      title: 'Гутал',
      items: [
        { name: 'Пүүз', href: '/men/shoes/sneakers' },
        { name: 'Арьсан гутал', href: '/men/shoes/leather' },
        { name: 'Сандаал', href: '/men/shoes/sandals' },
      ],
    },
    {
      title: 'Хувцас',
      items: [
        { name: 'Футболк', href: '/men/clothes/tshirts' },
        { name: 'Өмд', href: '/men/clothes/pants' },
        { name: 'Куртик', href: '/men/clothes/jackets' },
      ],
    },
    {
      title: 'Дагалдах',
      items: [
        { name: 'Малгай', href: '/men/accessories/hats' },
        { name: 'Цүнх', href: '/men/accessories/bags' },
        { name: 'Бүс', href: '/men/accessories/belts' },
      ],
    },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-md border-b">
      <div className="max-w-full flex items-center justify-between h-16 px-4 relative">

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden focus:outline-none"
        >
          <FaBoxOpen className="h-7 w-7" />
        </button>

        {/* Зүүн icon-ууд (desktop) */}
        <div className="hidden sm:flex gap-6 items-center">
          <div id="men-dropdown-parent" className="relative">
            <button
              onClick={() => setMenDropdownOpen((v) => !v)}
              className="flex items-center gap-1 group focus:outline-none"
            >
              <FaMale className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-sm font-semibold"></span>
              <FaChevronDown className={`h-4 w-4 transition-transform ${menDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {menDropdownOpen && (
              <div className="absolute left-0 right-0 top-[100%] mt-2 w-screen -ml-4 bg-white border-t border-b shadow-2xl z-50 py-8">
                <div className="max-w-7xl mx-auto px-8">
                  <div className="flex flex-row gap-12 justify-center">
                    {menSubcategories.map((cat) => (
                      <div key={cat.title} className="flex-1 max-w-xs">
                        <div className="font-bold text-gray-900 mb-4 text-xl border-b border-gray-200 pb-3">{cat.title}</div>
                        <ul className="space-y-2">
                          {cat.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                                onClick={() => setMenDropdownOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <IconLink href="/women" Icon={FaFemale} tooltip="Эмэгтэй" />
          <IconLink href="/kids" Icon={FaChild} tooltip="Хүүхэд" />
        </div>

        {/* Төв лого */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="text-gray-900 text-2xl font-extrabold tracking-tight hover:text-blue-700 transition">
            My E-Shop
          </Link>
        </div>

        {/* Баруун icon-ууд */}
        <div className="hidden sm:flex gap-4 items-center">
          <IconLink href="/products" Icon={FaBoxOpen} tooltip="Бүтээгдэхүүн" />

          {isLoggedIn && (
            <>
              {role !== 'admin' && (
                <>
                  <IconLink href="/cart" Icon={FaShoppingCart} tooltip="Сагс" />
                  <IconLink href="/orders" Icon={FaClipboardList} tooltip="Миний захиалгууд" />
                </>
              )}
              <IconLink href="/profile" Icon={FaUser} tooltip="Профайл" />
              {role === 'admin' && (
                <>
                  <IconLink href="/admin/dashboard" Icon={FaTachometerAlt} tooltip="Админ самбар" />
                  <IconLink href="/admin/orders" Icon={FaClipboardList} tooltip="Захиалгууд" />
                  <IconLink href="/categories/add" Icon={FaBoxes} tooltip="Ангилал нэмэх" />
                  <span className="text-sm font-semibold text-blue-700">{userName && 'Админ'}</span>
                </>
              )}
              <button onClick={handleLogout} title="Гарах" className="hover:scale-110 transition">
                <FaSignOutAlt className="h-7 w-7" />
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <IconLink href="/login" Icon={FaSignInAlt} tooltip="Нэвтрэх" />
              <IconLink href="/register" Icon={FaUserPlus} tooltip="Бүртгүүлэх" />
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 py-2 space-y-4 bg-white border-t">
          <div className="flex gap-6">
            <IconLink href="/men" Icon={FaMale} tooltip="Эрэгтэй" />
            <IconLink href="/women" Icon={FaFemale} tooltip="Эмэгтэй" />
            <IconLink href="/kids" Icon={FaChild} tooltip="Хүүхэд" />
          </div>
          <div className="flex gap-6">
            <IconLink href="/products" Icon={FaBoxOpen} tooltip="Бүтээгдэхүүн" />
            {isLoggedIn && role !== 'admin' && (
              <>
                <IconLink href="/cart" Icon={FaShoppingCart} tooltip="Сагс" />
                <IconLink href="/orders" Icon={FaClipboardList} tooltip="Миний захиалгууд" />
              </>
            )}
            {isLoggedIn && (
              <>
                <IconLink href="/profile" Icon={FaUser} tooltip="Профайл" />
                {role === 'admin' && (
                  <>
                    <IconLink href="/admin/dashboard" Icon={FaTachometerAlt} tooltip="Админ самбар" />
                    <IconLink href="/admin/orders" Icon={FaClipboardList} tooltip="Захиалгууд" />
                    <IconLink href="/categories/add" Icon={FaBoxes} tooltip="Ангилал нэмэх" />
                  </>
                )}
                <button onClick={handleLogout} title="Гарах" className="hover:scale-110 transition">
                  <FaSignOutAlt className="h-7 w-7" />
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <IconLink href="/login" Icon={FaSignInAlt} tooltip="Нэвтрэх" />
                <IconLink href="/register" Icon={FaUserPlus} tooltip="Бүртгүүлэх" />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}