// Edge Function "Chat":รับข้อความจากหน้าแชท ส่งต่อให้ Typhoon แล้วส่งคำตอบกลับ
// key ของ Typhoon อยู่ใน Supabase Secrets ชื่อ TYPHOON_API_KEY จึงไม่หลุดไปถึงเบราว์เซอร์

// header ที่ supabase-js ส่งมา (ตามไฟล์ @supabase/supabase-js/cors)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MODEL = 'typhoon-v2.5-30b-a3b-instruct'
const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 2000

const SYSTEM_PROMPT = `คุณคือ CheckRoke ผู้ช่วยประเมินอาการเจ็บป่วยเบื้องต้น
- ตอบเป็นภาษาเดียวกับข้อความล่าสุดของผู้ใช้เสมอ เช่น ผู้ใช้พิมพ์ไทยตอบไทย พิมพ์อังกฤษตอบอังกฤษ (Always reply in the same language as the user's latest message.)
- ถ้าต้องใช้ศัพท์เฉพาะ เช่น ชื่อโรค ชื่อยา หรือศัพท์ทางการแพทย์ ปนภาษาอังกฤษได้ โดยใส่ในวงเล็บ เช่น ไข้หวัดใหญ่ (Influenza) หรืออุณหภูมิร่างกาย (body temperature)
- ภาษาที่ปนได้มีแค่ภาษาอังกฤษเท่านั้น ห้ามมีคำหรือตัวอักษรภาษาจีน ญี่ปุ่น หรือเกาหลีเด็ดขาด ยกเว้นผู้ใช้พิมพ์ภาษานั้นมาเอง
- ถ้าตอบภาษาไทย ให้แทนตัวเองว่า "ผม" และลงท้ายด้วย "ครับ" ทุกครั้ง ห้ามใช้ "ค่ะ" หรือ "คะ"
- สุภาพ เป็นกันเอง เข้าใจง่าย ใช้ข้อความธรรมดา ไม่ใช้ Markdown เช่น ** หรือ #
- ถ้าข้อมูลยังไม่พอ ให้ถามเพิ่มทีละ 1-3 คำถาม เช่น เป็นมากี่วัน มีไข้ไหม อายุ โรคประจำตัว ยาที่แพ้
- เมื่อข้อมูลพอ ให้บอกโรคหรือภาวะที่อาจเป็นได้ พร้อมเหตุผลสั้น ๆ และวิธีดูแลตัวเองเบื้องต้น
- ห้ามวินิจฉัยแบบฟันธง และห้ามแนะนำยาที่ต้องให้แพทย์สั่งหรือบอกขนาดยาเอง
- ถ้ามีอาการอันตราย เช่น เจ็บแน่นหน้าอก หายใจลำบาก ชัก หมดสติ ปากเบี้ยวหรือแขนขาอ่อนแรงซีกเดียว เลือดออกมาก ให้แนะนำโทร 1669 หรือไปโรงพยาบาลทันที
- ทุกครั้งที่ให้ผลวิเคราะห์อาการ ให้ปิดท้ายด้วยข้อความเตือนว่า ผลนี้มาจาก AI อาจไม่ถูกต้อง 100% ควรไปพบแพทย์เพื่อตรวจวินิจฉัยที่แน่นอน โดยเฉพาะถ้าอาการไม่ดีขึ้นหรือแย่ลง
- ถ้าคำถามไม่เกี่ยวกับสุขภาพ ให้ตอบสั้น ๆ ว่าช่วยได้เฉพาะเรื่องอาการเจ็บป่วย`

// ตัวอักษรจีน ญี่ปุ่น เกาหลี (โมเดลชอบหลุดคำจีนออกมาปนในคำตอบภาษาไทย)
const CJK_PATTERN = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/

async function askTyphoon(history: { role: string; content: string }[], temperature: number) {
  const res = await fetch('https://api.opentyphoon.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('TYPHOON_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      temperature,
      top_p: 0.95,
      max_tokens: 1024,
      repetition_penalty: 1.05,
    }),
    signal: AbortSignal.timeout(60_000),
  })

  // ดูรายละเอียด error ได้ที่ Dashboard → Edge Functions → Chat → Logs
  if (!res.ok) {
    console.error('typhoon error', res.status, await res.text())
    return { error: res.status === 429 ? 'rate_limited' : 'ai_unavailable' }
  }

  const data = await res.json()
  const reply: string | undefined = data.choices?.[0]?.message?.content
  return reply ? { reply } : { error: 'ai_unavailable' }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  // ใช้ได้เฉพาะคนที่ล็อกอินแล้ว: ส่ง token ไปถาม Supabase Auth ว่าเป็นผู้ใช้จริงไหม
  const authorization = req.headers.get('Authorization')
  const apikey = req.headers.get('apikey')
  if (!authorization || !apikey) return json({ error: 'unauthorized' }, 401)

  const userRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, {
    headers: { Authorization: authorization, apikey },
  })
  if (!userRes.ok) return json({ error: 'unauthorized' }, 401)

  // รับแค่ข้อความ user/assistant, เก็บแค่ข้อความล่าสุด และตัดข้อความที่ยาวเกินไป
  let messages: unknown
  try {
    ;({ messages } = await req.json())
  } catch {
    return json({ error: 'bad_request' }, 400)
  }
  if (!Array.isArray(messages)) return json({ error: 'bad_request' }, 400)

  const history = messages
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return json({ error: 'bad_request' }, 400)
  }

  try {
    // temperature ต่ำ = ตอบตรงประเด็นและหลุดภาษาอื่นน้อยลง
    let result = await askTyphoon(history, 0.3)

    // ผู้ใช้ไม่ได้พิมพ์จีน/ญี่ปุ่น/เกาหลี แต่คำตอบมีปน → ถามใหม่อีกครั้งด้วย temperature ต่ำกว่าเดิม
    const userWroteCJK = CJK_PATTERN.test(history[history.length - 1].content)
    if (result.reply && !userWroteCJK && CJK_PATTERN.test(result.reply)) {
      console.warn('reply contained CJK characters, retrying')
      const retry = await askTyphoon(history, 0.1)
      if (retry.reply) result = retry
    }

    if (!result.reply) return json({ error: result.error }, 502)
    return json({ reply: result.reply })
  } catch (err) {
    console.error('typhoon request failed', err)
    return json({ error: 'ai_unavailable' }, 502)
  }
})
