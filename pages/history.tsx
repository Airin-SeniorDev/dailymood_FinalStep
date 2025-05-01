import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const currentUserId = 'user123'

type MoodRecord = {
  id: string
  mood: string
  comment: string
  createdAt: Timestamp
}

type Feedback = {
  id: string
  userId: string
  moodId: string
  text: string
}

const moodLabels: Record<string, string> = {
  happy: '😄 มีความสุข',
  sad: '😢 เศร้า',
  angry: '😠 โกรธ',
  stressed: '😰 เครียด',
  tired: '😴 เหนื่อยล้า',
  calm: '😌 สงบ',
}

export default function HistoryPage() {
  const [history, setHistory] = useState<MoodRecord[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [commentInput, setCommentInput] = useState<Record<string, string>>({})
  const [editInput, setEditInput] = useState<Record<string, string>>({})
  const [editingStates, setEditingStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      const moodSnap = await getDocs(query(collection(db, 'moods'), orderBy('createdAt', 'desc')))
      const feedbackSnap = await getDocs(collection(db, 'feedbacks'))

      const moods = moodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoodRecord))
      const fb = feedbackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback))

      setHistory(moods)
      setFeedbacks(fb)
    }
    fetchData()
  }, [])

  const moodCounts = history.reduce((acc: Record<string, number>, item) => {
    acc[item.mood] = (acc[item.mood] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: moodLabels[mood] || mood,
    count,
  }))

  const handleSaveComment = async (moodId: string) => {
    const text = commentInput[moodId]?.trim()
    if (!text) {
      alert('กรุณาเขียนข้อความก่อนส่งนะ!')
      return
    }

    const newFb = await addDoc(collection(db, 'feedbacks'), {
      moodId,
      userId: currentUserId,
      text,
    })

    setFeedbacks(prev => [...prev, { id: newFb.id, moodId, userId: currentUserId, text }])
    setCommentInput(prev => ({ ...prev, [moodId]: '' }))
  }

  const handleEditComment = async (feedbackId: string) => {
    const newText = editInput[feedbackId]?.trim()
    if (!newText) {
      alert('กรุณาเขียนข้อความก่อนแก้ไขนะ!')
      return
    }

    await updateDoc(doc(db, 'feedbacks', feedbackId), { text: newText })

    setFeedbacks(prev =>
      prev.map(fb => fb.id === feedbackId ? { ...fb, text: newText } : fb)
    )

    setEditingStates(prev => ({ ...prev, [feedbackId]: false }))
    setEditInput(prev => ({ ...prev, [feedbackId]: '' }))
  }

  const handleDeleteComment = async (feedbackId: string) => {
    await deleteDoc(doc(db, 'feedbacks', feedbackId))
    setFeedbacks(prev => prev.filter(f => f.id !== feedbackId))
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">📊 ประวัติอารมณ์</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#a78bfa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {history.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded shadow mb-4 border">
          <p className="text-sm text-gray-500">
            📅 {item.createdAt?.toDate().toLocaleDateString('th-TH')} — {moodLabels[item.mood] || item.mood}
          </p>
          <p className="mt-1 text-green-600 italic">💬 {item.comment || 'ไม่มีคำอธิบาย'}</p>

          <div className="mt-2">
            {feedbacks.filter(f => f.moodId === item.id).map((fb) => (
              <div key={fb.id} className="flex items-center gap-2 mt-1">
                {editingStates[fb.id] ? (
                  <>
                    <input
                      className="flex-1 border px-2 py-1 rounded"
                      value={editInput[fb.id] || ''}
                      onChange={e => setEditInput(prev => ({ ...prev, [fb.id]: e.target.value }))}
                      placeholder="แก้ไขข้อความของคุณ"
                      aria-label="Edit comment"
                    />
                    <button
                      className="text-green-600"
                      onClick={() => handleEditComment(fb.id)}
                    >
                      ✅ บันทึก
                    </button>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-blue-600">{fb.text}</p>
                    {fb.userId === currentUserId && (
                      <>
                        <button
                          className="text-sm text-yellow-600"
                          onClick={() => {
                            setEditingStates(prev => ({ ...prev, [fb.id]: true }))
                            setEditInput(prev => ({ ...prev, [fb.id]: fb.text }))
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          className="text-sm text-red-600"
                          onClick={() => handleDeleteComment(fb.id)}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex mt-3 gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded"
              placeholder="พิมพ์ข้อความให้กำลังใจ..."
              value={commentInput[item.id] || ''}
              onChange={(e) =>
                setCommentInput((prev) => ({ ...prev, [item.id]: e.target.value }))
              }
            />
            <button
              onClick={() => handleSaveComment(item.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition"
            >
              💬 ให้กำลังใจ
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
