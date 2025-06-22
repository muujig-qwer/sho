'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'

export default function CategorySlider({ categories }) {
  return (
    <div className="w-full py-6">
      <Swiper
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 7 },
        }}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat._id}>
            <Link href={`/category/${cat._id}`}>
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow group-hover:scale-105 transition">
                  <img
                    src={cat.image || '/placeholder.png'}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-black text-center">
                  {cat.name}
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}