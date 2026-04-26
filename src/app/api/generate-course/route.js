import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic } = await req.json();
    if (!topic?.trim()) {
      return Response.json({ error: '請輸入課程主題' }, { status: 400 });
    }

    const message = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `你是一位旅遊英語課程設計師，專門設計適合台灣旅客的實用英語課程。
請根據以下主題，生成一份完整的旅遊英語課程內容。

主題：${topic.trim()}

請嚴格以下列 JSON 格式回傳，不要加任何說明文字：
{
  "title": "課程中文標題（10字以內，以「旅遊英語：」開頭）",
  "titleEn": "Course English title (concise, under 8 words)",
  "description": "課程描述（中文，40字以內，說明學到什麼）",
  "objectives": ["學習目標1（5字以內）", "學習目標2", "學習目標3"],
  "script": "英語對話腳本（8至10行，每行一句，模擬真實旅遊情境對話，角色為旅客與當地人）",
  "phrases": [
    {"en": "英文句子", "zh": "中文翻譯", "tip": "使用時機說明（15字以內）"},
    {"en": "...", "zh": "...", "tip": "..."},
    {"en": "...", "zh": "...", "tip": "..."},
    {"en": "...", "zh": "...", "tip": "..."},
    {"en": "...", "zh": "...", "tip": "..."}
  ],
  "keyPatterns": [
    {"pattern": "核心句型（如 I'd like + noun）", "example": "例句", "zh": "中文說明"},
    {"pattern": "...", "example": "...", "zh": "..."},
    {"pattern": "...", "example": "...", "zh": "..."}
  ]
}`
      }]
    });

    const text = message.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: 'AI 回傳格式錯誤，請重試' }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return Response.json(data);
  } catch (err) {
    console.error('generate-course error:', err);
    return Response.json({ error: err.message || '生成失敗，請重試' }, { status: 500 });
  }
}
