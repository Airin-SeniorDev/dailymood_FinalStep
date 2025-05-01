import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-100 to-purple-300 text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        🌈 DailyMood
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        บันทึกอารมณ์ของคุณทุกวัน พร้อมรับคำแนะนำดี ๆ และเพลงให้กำลังใจ ✨
      </p>

      <Link href="/mood">
        <button className="px-8 py-3 bg-purple-600 text-white rounded-full text-lg shadow-md hover:bg-purple-700 transition">
          😊 เริ่มบันทึกอารมณ์วันนี้
        </button>
      </Link>
    </div>
  )
}
