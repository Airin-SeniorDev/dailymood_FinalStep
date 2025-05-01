// ✅ pages/mood.tsx – ส่ง mood ไปยัง Firestore และพาไปหน้า recommend.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import Link from 'next/link'

const moods = [
  { label: '😄 มีความสุข', value: 'happy' },
  { label: '😢 เศร้า', value: 'sad' },
  { label: '😠 โกรธ', value: 'angry' },
  { label: '😰 เครียด', value: 'stressed' },
  { label: '😴 เหนื่อยล้า', value: 'tired' },
  { label: '😌 สงบ', value: 'calm' },
]

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!selectedMood) return

    const moodData = {
      mood: selectedMood,
      comment: note || '',
      createdAt: Timestamp.now(),
      feedback: '',
    }

    await addDoc(collection(db, 'moods'), moodData)

    localStorage.setItem('todayMood', selectedMood)
    router.push('/recommend') // ✅ ไปหน้า recommend
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        วันนี้คุณเป็นยังไงบ้าง บอกเราได้ไหม ☺️ ?
      </h1>

      {/* 📌 กล่องคำอธิบายความรู้สึก */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="เขียนบรรยายความรู้สึก เช่น เหตุการณ์วันนี้ ชื่อ หรืออีโมจิ 😊"
        className="w-full max-w-md mb-6 p-3 rounded border border-gray-300 text-black placeholder:text-black/60"
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`p-4 rounded-xl border-2 text-lg font-medium transition ${
              selectedMood === mood.value
                ? 'bg-purple-600 text-black border-purple-600'
                : 'bg-white text-black border-gray-300 hover:border-purple-400'
            }`}
          >
            {mood.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className="mb-4 px-6 py-3 rounded-full bg-purple-600 text-white disabled:bg-gray-400"
      >
        ให้เราช่วยคุณนะ
      </button>

      <Link href="/history">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl text-sm">
          📚 ดูประวัติอารมณ์
        </button>
      </Link>
    </div>
  )
}
