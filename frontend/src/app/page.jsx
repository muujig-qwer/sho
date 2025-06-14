'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import FeaturedCarousel from '@/components/FeaturedCarousel'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [openParent, setOpenParent] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
    axios.get('http://localhost:5000/api/products?featured=true')
      .then(res => setFeaturedProducts(res.data))

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const parentCategories = categories.filter(cat => !cat.parent)
  const getChildCategories = (parentId) =>
    categories.filter(cat => cat.parent === parentId)

  return (
    <div className="bg-white text-gray-800">
      {/* Hero section */}
      <section className="relative w-full h-screen bg-[url('https://images.unsplash.com/photo-1707483618680-8c13c7fc3f69?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Таны амьдралыг хялбарчлах сонголтууд
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Орчин үеийн хэв маяг, тав тухтай хэрэглээг нэг дороос. Хувцас, гутал, гэр ахуйн бараа болон бусад.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition">
              Дэлгүүр хэсэх
            </Link>
            <Link href="/about" className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition">
              Бидний тухай
            </Link>
          </div>
        </div>
      </section>

      {/* Бидний давуу тал */}
      <section className="w-full px-5 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative rounded-lg bg-cover bg-top h-[850px]" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1664201890484-a5f7109c8e56?auto=format&fit=crop&w=900&q=80')" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mt-2">Байгальд ээлтэй материал</h3>
              <p className="text-white">Эрүүл мэндэд хоргүй, дахин боловсруулсан түүхий эд</p>
            </div>
          </div>
          <div className="relative rounded-lg bg-cover bg-top h-[850px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80')" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mt-2">Хүрээлэн буй орчинд ээлтэй</h3>
              <p className="text-white">Бид нүүрстөрөгчийн ялгарлыг тэглэх бодлого баримталдаг</p>
            </div>
          </div>
          <div className="relative rounded-lg bg-cover bg-top h-[850px]" style={{ backgroundImage: "url('https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_2000/cms/7kcrYAMvgP0jeDCxEZhM7T/b872659dc6eae46319b1f61eb3ab844b/25Q1_HB_A11475_W_OnBody_KneeDown_01789.jpg')" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mt-2">Өдөржин тав тухтай</h3>
              <p className="text-white">Загвар ба чанарыг нэгтгэсэн шийдэл</p>
            </div>
          </div>
        </div>
      </section>

      {/* Уриа */}
      <section className="w-full h-[400px] bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-center text-white px-4" style={{ backgroundImage: "url('https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_2053/cms/3gaucwAUA2KXTW2QeloccX/02d479630932580eb29bc1329e0ec6fd/24Q3_AugustCore_Statement_Module_Site_Desktop_IMG_2880x720.jpg')" }}>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Бид илүү сайныг илүү зөвөөр бүтээдэг
        </h2>
        <p className="max-w-2xl text-base md:text-lg mb-4">
          Байгалийн ухаалаг шийдлээс сэдэвлэн бид тав тухтай, хэрэглэхэд таатай бүтээгдэхүүн үйлдвэрлэж байна.
        </p>
        <div className="text-xl font-bold italic">ECOshop <span className="text-sm block font-normal">БАЙГАЛИЙН УХААНААР</span></div>
      </section>

      {/* Онцлох хэсэг */}
      <section className="w-screen px-4 pt-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative min-h-[500px] rounded-xl overflow-hidden flex">
            <img src="https://images.unsplash.com/photo-1612452830710-97cd38a7b6e8?q=80&w=1974&auto=format&fit=crop" alt="Эцэгт зориулсан бэлэг" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 bg-black/40 p-8 md:p-12 text-white flex flex-col justify-center w-full">
              <h3 className="text-3xl font-bold mb-2">Танд хэрэгтэй бүх зүйл энд байна</h3>
              <p className="mb-4 text-base">Сонгосон бүтээгдэхүүн, онцгой урамшууллууд</p>
              <div className="flex gap-4">
                <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200">Онцлох бараа</button>
                <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200">Тусгай бэлгүүд</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {featuredProducts.slice(0, 4).map(product => (
              <div key={product._id} className="group">
                <Link href={`/products/${product._id}`}>
                  <div className="relative overflow-hidden rounded-xl aspect-square bg-gray-100">
                    <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium text-sm sm:text-base">{product.name}</h3>
                    <p className="text-gray-500 text-sm">{product.price?.toLocaleString()}₮</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Онцлох carousel */}
      <h2 className="text-xl font-bold mb-4 mt-12">Онцгой бүтээгдэхүүнүүд</h2>
      <FeaturedCarousel products={featuredProducts} />

      {/* Шуудангийн мэдээ */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Манай нэгдэлд нэгдээрэй</h2>
          <p className="text-gray-600 mb-6">Онцгой хямдрал, хэрэгцээт зөвлөгөө болон шинэ бүтээгдэхүүний мэдээлэл шууд танд хүрнэ.</p>
          <form className="flex max-w-md mx-auto">
            <input type="email" placeholder="И-мэйл хаяг" className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black" required />
            <button type="submit" className="bg-black text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition">Бүртгүүлэх</button>
          </form>
        </div>
      </section>
    </div>
  )
}
