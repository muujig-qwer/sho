import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaLinkedinIn } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-2">Холбоо барих</h3>
          <p className="text-sm text-gray-600">
            Улаанбаатар, Сүхбаатар 1-р хороо,<br />
            Инженерүүдийн эргэн тойронд, 17, Сонс<br />
            Амралтын хүрзээлзэн, Централ парк,<br />
            14-р давхар
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Холбоо барих</h3>
          <p className="text-sm text-gray-600">
            7777-5020<br />
            9:00 - 22:00 (эхлээд бүр)<br />
            info@
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Тусламж</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Түгээмэл асуултууд</li>
            <li>Түгээмэл асуултууд</li>
            <li>Үйлчилгээний нөхцөл</li>
            <li>Нууцлалын бодлого</li>
          </ul>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0 text-gray-500 text-2xl">
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="Youtube"><FaYoutube /></a>
          <a href="#" aria-label="TikTok"><FaTiktok /></a>
          <a href="#" aria-label="Linkedin"><FaLinkedinIn /></a>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-gray-500 bg-gray-50">
        <p>©2025 Бүх эрх хуулиар хамгаалагдсан.</p>
        <p>Powered by 111111</p>
      </div>
    </footer>
  );
}