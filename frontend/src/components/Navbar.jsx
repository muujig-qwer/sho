'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import {
  FaMale, FaFemale, FaChild, FaBoxOpen, FaShoppingCart,
  FaClipboardList, FaUser, FaSignInAlt, FaUserPlus,
  FaSignOutAlt, FaTachometerAlt, FaBoxes, FaChevronDown, FaBars, FaTimes
} from 'react-icons/fa'

function IconLink({ href, Icon, tooltip, className = "" }) {
  return (
    <Link href={href} title={tooltip} className={`relative group ${className}`}>
      <div className="p-2 rounded-full transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg">
        <Icon className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-400" />
      </div>
      <span className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 transition-all duration-300 whitespace-nowrap z-50 shadow-xl border border-gray-700">
        {tooltip}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45 border-l border-t border-gray-700"></div>
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
  const [womenDropdownOpen, setWomenDropdownOpen] = useState(false)
  const [kidsDropdownOpen, setKidsDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  useEffect(() => {
    if (!womenDropdownOpen) return
    const handleClick = (e) => {
      if (!e.target.closest('#women-dropdown-parent')) {
        setWomenDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [womenDropdownOpen])

  useEffect(() => {
    if (!kidsDropdownOpen) return
    const handleClick = (e) => {
      if (!e.target.closest('#kids-dropdown-parent')) {
        setKidsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [kidsDropdownOpen])

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

  const womenSubcategories = [
    {
      title: 'Гутал',
      items: [
        { name: 'Пүүз', href: '/women/shoes/sneakers' },
        { name: 'Туфль', href: '/women/shoes/heels' },
        { name: 'Сандаал', href: '/women/shoes/sandals' },
      ],
    },
    {
      title: 'Хувцас',
      items: [
        { name: 'Даашинз', href: '/women/clothes/dresses' },
        { name: 'Юбка', href: '/women/clothes/skirts' },
        { name: 'Цамц', href: '/women/clothes/shirts' },
      ],
    },
    {
      title: 'Дагалдах',
      items: [
        { name: 'Малгай', href: '/women/accessories/hats' },
        { name: 'Цүнх', href: '/women/accessories/bags' },
        { name: 'Бүс', href: '/women/accessories/belts' },
      ],
    },
  ]

  const kidsSubcategories = [
    {
      title: 'Хүүхэд',
      items: [
        { name: 'Гутал', href: '/kids/shoes' },
        { name: 'Хувцас', href: '/kids/clothes' },
        { name: 'Дагалдах', href: '/kids/accessories' },
      ],
    },
    {
      title: 'Бусад',
      items: [
        { name: 'Спорт', href: '/others/sport' },
        { name: 'Аялал', href: '/others/travel' },
      ],
    },
  ]

  return (
    <div className="relative w-full">
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50' 
          : 'bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm shadow-lg'
      }`}>
        <div className="max-w-full flex items-center justify-between h-20 px-6 relative">

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden focus:outline-none p-2 rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            {menuOpen ? (
              <FaTimes className="h-6 w-6 text-white" />
            ) : (
              <FaBars className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Зүүн icon-ууд (desktop) */}
          <div className="hidden sm:flex gap-8 items-center">
            {/* Эрэгтэй dropdown */}
            <div id="men-dropdown-parent" className="relative">
              <button
                onClick={() => setMenDropdownOpen((v) => !v)}
                className={`flex items-center gap-2 group focus:outline-none px-4 py-3 rounded-full transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg ${
                  scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                }`}
              >
                <FaMale className="h-6 w-6" />
                <span className="font-medium">Эрэгтэй</span>
                <FaChevronDown className={`h-3 w-3 transition-transform duration-300 ${menDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {menDropdownOpen && (
                <div className="fixed left-0 top-20 w-screen bg-white/98 backdrop-blur-xl border-t border-b border-gray-200/50 shadow-2xl z-50 py-12">
                  <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-row gap-16 justify-center">
                      {menSubcategories.map((cat) => (
                        <div key={cat.title} className="flex-1 max-w-xs">
                          <div className="font-bold text-gray-900 mb-6 text-2xl border-b-2 border-blue-500 pb-4">{cat.title}</div>
                          <ul className="space-y-3">
                            {cat.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="block px-6 py-4 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-300 font-medium hover:shadow-md hover:scale-105"
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

            {/* Эмэгтэй dropdown */}
            <div id="women-dropdown-parent" className="relative">
              <button
                onClick={() => setWomenDropdownOpen((v) => !v)}
                className={`flex items-center gap-2 group focus:outline-none px-4 py-3 rounded-full transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg ${
                  scrolled ? 'text-gray-700 hover:text-pink-600' : 'text-white hover:text-pink-200'
                }`}
              >
                <FaFemale className="h-6 w-6" />
                <span className="font-medium">Эмэгтэй</span>
                <FaChevronDown className={`h-3 w-3 transition-transform duration-300 ${womenDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {womenDropdownOpen && (
                <div className="fixed left-0 top-20 w-screen bg-white/98 backdrop-blur-xl border-t border-b border-gray-200/50 shadow-2xl z-50 py-12">
                  <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-row gap-16 justify-center">
                      {womenSubcategories.map((cat) => (
                        <div key={cat.title} className="flex-1 max-w-xs">
                          <div className="font-bold text-gray-900 mb-6 text-2xl border-b-2 border-pink-500 pb-4">{cat.title}</div>
                          <ul className="space-y-3">
                            {cat.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="block px-6 py-4 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 hover:text-pink-700 transition-all duration-300 font-medium hover:shadow-md hover:scale-105"
                                  onClick={() => setWomenDropdownOpen(false)}
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

            {/* Хүүхэд dropdown */}
            <div id="kids-dropdown-parent" className="relative">
              <button
                onClick={() => setKidsDropdownOpen((v) => !v)}
                className={`flex items-center gap-2 group focus:outline-none px-4 py-3 rounded-full transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg ${
                  scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white hover:text-purple-200'
                }`}
              >
                <FaChild className="h-6 w-6" />
                <span className="font-medium">Хүүхэд</span>
                <FaChevronDown className={`h-3 w-3 transition-transform duration-300 ${kidsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {kidsDropdownOpen && (
                <div className="fixed left-0 top-20 w-screen bg-white/98 backdrop-blur-xl border-t border-b border-gray-200/50 shadow-2xl z-50 py-12">
                  <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-row gap-16 justify-center">
                      {kidsSubcategories.map((cat) => (
                        <div key={cat.title} className="flex-1 max-w-xs">
                          <div className="font-bold text-gray-900 mb-6 text-2xl border-b-2 border-purple-500 pb-4">{cat.title}</div>
                          <ul className="space-y-3">
                            {cat.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="block px-6 py-4 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 transition-all duration-300 font-medium hover:shadow-md hover:scale-105"
                                  onClick={() => setKidsDropdownOpen(false)}
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
          </div>

          {/* Төв лого */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className={`text-3xl font-black tracking-tight transition-all duration-300 hover:scale-110 ${
              scrolled 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600' 
                : 'text-white hover:text-yellow-200'
            }`}>
              <span className="drop-shadow-lg">My E-Shop</span>
            </Link>
          </div>

          {/* Баруун icon-ууд */}
          <div className={`hidden sm:flex gap-2 items-center ${scrolled ? 'text-gray-700' : 'text-white'}`}>
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
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                      scrolled 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-white/20 backdrop-blur-sm text-white'
                    }`}>
                      {userName && 'Админ'}
                    </div>
                  </>
                )}
                <button 
                  onClick={handleLogout} 
                  title="Гарах" 
                  className="p-2 rounded-full transition-all duration-300 hover:bg-red-500/20 hover:backdrop-blur-sm hover:shadow-lg hover:scale-110"
                >
                  <FaSignOutAlt className="h-6 w-6 hover:text-red-400" />
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
        <div className={`sm:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-8 space-y-6 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="grid grid-cols-3 gap-6">
              <Link href="/men" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105">
                <FaMale className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Эрэгтэй</span>
              </Link>
              <Link href="/women" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all duration-300 hover:scale-105">
                <FaFemale className="h-8 w-8 text-pink-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Эмэгтэй</span>
              </Link>
              <Link href="/kids" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-105">
                <FaChild className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Хүүхэд</span>
              </Link>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-4 gap-4">
                <IconLink href="/products" Icon={FaBoxOpen} tooltip="Бүтээгдэхүүн" className="text-gray-700" />
                {isLoggedIn && role !== 'admin' && (
                  <>
                    <IconLink href="/cart" Icon={FaShoppingCart} tooltip="Сагс" className="text-gray-700" />
                    <IconLink href="/orders" Icon={FaClipboardList} tooltip="Миний захиалгууд" className="text-gray-700" />
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <IconLink href="/profile" Icon={FaUser} tooltip="Профайл" className="text-gray-700" />
                    {role === 'admin' && (
                      <>
                        <IconLink href="/admin/dashboard" Icon={FaTachometerAlt} tooltip="Админ самбар" className="text-gray-700" />
                        <IconLink href="/admin/orders" Icon={FaClipboardList} tooltip="Захиалгууд" className="text-gray-700" />
                        <IconLink href="/categories/add" Icon={FaBoxes} tooltip="Ангилал нэмэх" className="text-gray-700" />
                      </>
                    )}
                    <button 
                      onClick={handleLogout} 
                      title="Гарах" 
                      className="p-2 rounded-full hover:bg-red-50 transition-all duration-300 text-gray-700 hover:text-red-600"
                    >
                      <FaSignOutAlt className="h-6 w-6" />
                    </button>
                  </>
                )}
                {!isLoggedIn && (
                  <>
                    <IconLink href="/login" Icon={FaSignInAlt} tooltip="Нэвтрэх" className="text-gray-700" />
                    <IconLink href="/register" Icon={FaUserPlus} tooltip="Бүртгүүлэх" className="text-gray-700" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}