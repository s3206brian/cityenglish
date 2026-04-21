/**
 * 課程資料
 * 每堂課包含：YouTube 影片 ID、腳本、練習句、學習目標
 * 管理人員可直接新增課程到此檔案
 */
export const COURSES = [
  {
    id: 'beginner_greetings',
    title: '旅遊英語：問候與自我介紹',
    titleEn: 'Travel English: Greetings & Introductions',
    level: 'beginner',
    emoji: '👋',
    gradient: 'from-blue-500 to-cyan-500',
    description: '學習最基本的問候語和自我介紹，讓你在旅遊時能輕鬆開口說英文。',
    youtubeId: '', // 管理員填入 YouTube 影片 ID（例：dQw4w9WgXcQ）
    duration: '10 分鐘',
    objectives: ['問候陌生人', '自我介紹', '詢問對方名字'],
    script: `Hello! My name is Sarah.
Nice to meet you!
Where are you from?
I'm from Taiwan.
How long are you staying?
I'm here for three days.
Do you have any recommendations?
You should definitely visit the night market!`,
    phrases: [
      { en: 'Nice to meet you!', zh: '很高興認識你！', tip: '第一次見面時使用' },
      { en: 'Where are you from?', zh: '你來自哪裡？', tip: '詢問對方的國籍或城市' },
      { en: 'How long are you staying?', zh: '你要待多久？', tip: '詢問旅遊行程長度' },
      { en: 'Do you have any recommendations?', zh: '你有什麼建議嗎？', tip: '向當地人詢問建議' },
    ],
    keyPatterns: [
      { pattern: 'I\'m from + place', example: 'I\'m from Taipei.', zh: '我來自...（地點）' },
      { pattern: 'I\'m here for + time', example: 'I\'m here for a week.', zh: '我在這裡待...（時間）' },
      { pattern: 'You should + verb', example: 'You should try the hot springs!', zh: '你應該去...（建議）' },
    ],
  },
  {
    id: 'beginner_directions',
    title: '旅遊英語：問路與指引',
    titleEn: 'Travel English: Asking for Directions',
    level: 'beginner',
    emoji: '🗺️',
    gradient: 'from-emerald-500 to-green-600',
    description: '學習如何問路、看懂指引，讓你在陌生城市也能找到目的地。',
    youtubeId: '',
    duration: '12 分鐘',
    objectives: ['詢問方向', '理解地點描述', '感謝對方幫助'],
    script: `Excuse me, can you help me?
I'm looking for the train station.
Go straight ahead for two blocks.
Then turn left at the traffic light.
It's on your right side.
How far is it from here?
It's about a ten-minute walk.
Thank you so much!
You're welcome. Have a nice day!`,
    phrases: [
      { en: 'Excuse me, can you help me?', zh: '打擾一下，你能幫我嗎？', tip: '開口問路的禮貌方式' },
      { en: 'I\'m looking for the train station.', zh: '我在找火車站。', tip: '說明你要找的地方' },
      { en: 'How far is it from here?', zh: '從這裡有多遠？', tip: '詢問距離' },
      { en: 'It\'s about a ten-minute walk.', zh: '大約走路十分鐘。', tip: '描述距離的常用說法' },
    ],
    keyPatterns: [
      { pattern: 'I\'m looking for + noun', example: 'I\'m looking for a convenience store.', zh: '我在找...（地方）' },
      { pattern: 'Go straight / Turn left / Turn right', example: 'Turn right at the corner.', zh: '直走 / 左轉 / 右轉' },
      { pattern: 'It\'s about + time/distance + walk', example: 'It\'s about five minutes walk.', zh: '步行大約...（時間）' },
    ],
  },
  {
    id: 'beginner_ordering',
    title: '旅遊英語：點餐與購物',
    titleEn: 'Travel English: Ordering & Shopping',
    level: 'beginner',
    emoji: '🍜',
    gradient: 'from-amber-500 to-orange-500',
    description: '學習如何在餐廳點餐和在商店購物，不再比手畫腳！',
    youtubeId: '',
    duration: '15 分鐘',
    objectives: ['在餐廳點餐', '詢問價格', '表達喜好'],
    script: `Welcome! How many people?
Just two, please.
Can I see the menu?
What do you recommend?
I'd like the beef noodles, please.
Would you like anything to drink?
Just water, please.
How much is this?
That comes to two hundred dollars.
Can I pay by credit card?`,
    phrases: [
      { en: 'I\'d like the beef noodles, please.', zh: '我想要牛肉麵，謝謝。', tip: '點餐的禮貌說法' },
      { en: 'What do you recommend?', zh: '你推薦什麼？', tip: '詢問推薦菜色' },
      { en: 'How much is this?', zh: '這個多少錢？', tip: '詢問價格最基本的句子' },
      { en: 'Can I pay by credit card?', zh: '我可以用信用卡付款嗎？', tip: '詢問付款方式' },
    ],
    keyPatterns: [
      { pattern: 'I\'d like + noun, please', example: 'I\'d like a coffee, please.', zh: '我想要...（點餐/購物）' },
      { pattern: 'Can I + verb?', example: 'Can I have the bill?', zh: '我可以...嗎？（請求）' },
      { pattern: 'How much is/are + noun?', example: 'How much are these shoes?', zh: '...多少錢？（詢問價格）' },
    ],
  },
];
