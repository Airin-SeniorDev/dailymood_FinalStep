import type { NextApiRequest, NextApiResponse } from 'next'

type Song = {
  title: string
  url: string
}

type Recommendation = {
  mood: string
  quote: string
  songs: Song[]
}

const moodMap: Record<string, Recommendation> = {
  happy: {
    mood: '😄 มีความสุข',
    quote: 'จงมีความสุขกับสิ่งที่มี และทำสิ่งที่ดีที่สุดกับสิ่งที่ขาดไป',
    songs: [
      { title: 'Billie Eilish - BIRDS OF A FEATHER ', url: 'https://youtu.be/V9PVRfjEBTI?si=Qk099iiIZaL4dnJR' },
      { title: 'Billie Eilish - Happier Than Ever ', url: 'https://youtu.be/5GJWxDKyk3A?si=DlXToeSkVC20uuqW' },
      { title: 'Post Malone, Swae Lee - Sunflower', url: 'https://youtu.be/ApXoWvfEYVU?si=OKyYsM3OuGoOpBl1' },
    ],
  },
  sad: {
    mood: '😢 เศร้า',
    quote: 'แม้ความเงียบ ดังกว่าคำพูดเป็นพันคำ',
    songs: [
      { title: 'Part Time Musicians - Message In A Bottle', url: 'https://youtu.be/ZTwd7kekzTs?si=GVHzNx5Qegs556dz' },
      { title: 'Miki Matsubara - Stay With Me', url: 'https://youtu.be/moR4uw-NWLY?si=6wGWKQAPUJK_JM7R' },
      { title: 'Happier - Marshmello ft. Bastille', url: 'https://youtu.be/m7Bc3pLyij0?si=L457pGfXU-qEDrR0' },
    ],
  },
  angry: {
    mood: '😠 โกรธ',
    quote: 'หายใจลึก ๆ แล้วปล่อยวาง',
    songs: [
      { title: 'ทนได้ทุกที - TaitosmitH', url: 'https://youtu.be/Z6PQtPL0I6A?si=HKXMan-FdOpeHS0P' },
      { title: 'ไม่มีเธอ - Retrospect', url: 'https://youtu.be/BYOFWdOHpjI?si=tllkl_gQQdILRLS2' },
      { title: 'โง่ - Silly Fools', url: 'https://youtu.be/6d1xoV_cyf4?si=Ri249-VeNDfc88j5' },
    ],
  },
  stressed: {
    mood: '😰 เครียด',
    quote: 'พักก่อน แล้วค่อยไปต่อ',
    songs: [
      { title: 'Hello Mama - TaitosmitH', url: 'https://youtu.be/uefcQzHmA_Y?si=ZTUzregnc9ffQDWd' },
      { title: 'ถ้าเราเจอกันอีก - Tilly Birds', url: 'https://youtu.be/_ivYh1FakjE?si=xxGeFby_j7dvoUdM' },
      { title: 'ระหว่างที่รอเขา - ป๊อบ ปองกูล Feat. ธีร์ ไชยเดช', url: 'https://youtu.be/P1g99XOn5VY?si=fuJxVENxOQl7Ez40' },
    ],
  },
  tired: {
    mood: '😴 เหนื่อยล้า',
    quote: 'การพักผ่อนก็เป็นส่วนหนึ่งของความสำเร็จ',
    songs: [
      { title: 'Greasy Cafe - ความหมายของการมีลมหายใจ', url: 'https://youtu.be/u233DxkQtwc?si=BmJHDs8dPJfJ3V1b' },
      { title: 'โลกที่แบกไว้ - มนัสวีร์', url: 'https://youtu.be/RiZ2N3A5siI?si=Ft06zU5MklxzSmfI' },
      { title: 'Slot Machine - จันทร์เจ้า', url: 'https://youtu.be/CMbYwYYFI3Y?si=n81weJV4J7bnucWN' },
    ],
  },
  calm: {
    mood: '😌 สงบ',
    quote: 'ความสงบคือพลังที่ยิ่งใหญ่ที่สุด',
    songs: [
      { title: 'JVKE - golden hour', url: 'https://youtu.be/PEM0Vs8jf1w?si=MdMmLlpe2okdiKvl' },
      { title: 'Lady Gaga, Bruno Mars - Die With A Smile', url: 'https://youtu.be/kPa7bsKwL-c?si=HxpYch5N57d23LIS' },
      { title: 'Fujii Kaze - Michi Teyu Ku', url: 'https://youtu.be/ptiK8U4WlSc?si=gbjWxVKDFq7yN74Z' },
    ],
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const mood = req.query.mood as string

  if (!mood || !moodMap[mood]) {
    return res.status(400).json({ error: 'Invalid or missing mood' })
  }

  const recommendation = moodMap[mood]
  return res.status(200).json(recommendation)
}
