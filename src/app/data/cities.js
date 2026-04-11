export const CITIES = {
  taitung: {
    id: 'taitung',
    name: '台東',
    nameEn: 'Taitung',
    tagline: 'Where mountains meet the sea',
    description: '太平洋海岸線、熱帶森林與原住民文化的完美交融',
    emoji: '🏔️',
    gradient: 'from-emerald-500 to-teal-700',
    locations: [
      {
        id: 'taitung_tiehua',
        nameZh: '鐵花村',
        nameEn: 'Tiehua Music Village',
        phonetic: '/ˌtiːeɪ.hwɑː ˈmjuːzɪk ˈvɪlɪdʒ/',
        emoji: '🎵',
        description: 'A creative arts community featuring live folk and indigenous music every weekend evening.',
        phrases: [
          {
            en: 'Tiehua Music Village is famous for live folk music performances.',
            zh: '鐵花村以現場民謠音樂演出聞名。',
          },
          {
            en: 'The village hosts live music events every Friday and Saturday evening.',
            zh: '村子每週五和週六晚上舉辦現場音樂活動。',
          },
          {
            en: 'Indigenous culture and crafts are celebrated here every weekend.',
            zh: '這裡每個週末都在慶祝原住民文化與工藝。',
          },
        ],
        keyVocabulary: [
          { word: 'village', phonetic: '/ˈvɪlɪdʒ/', difficulty: 'beginner' },
          { word: 'performance', phonetic: '/pərˈfɔːrməns/', difficulty: 'intermediate' },
          { word: 'indigenous', phonetic: '/ɪnˈdɪdʒɪnəs/', difficulty: 'advanced' },
          { word: 'folk', phonetic: '/foʊk/', difficulty: 'beginner' },
        ],
      },
      {
        id: 'taitung_forest',
        nameZh: '台東森林公園',
        nameEn: 'Taitung Forest Park',
        phonetic: '/taɪˈtʊŋ ˈfɒrɪst pɑːrk/',
        emoji: '🌲',
        description: 'A rare urban forest park featuring Pipa Lake, cycling paths, and diverse bird species.',
        phrases: [
          {
            en: 'Taitung Forest Park has beautiful cycling trails near Pipa Lake.',
            zh: '台東森林公園在琵琶湖附近有美麗的自行車道。',
          },
          {
            en: 'The park is home to hundreds of bird species and rare plants.',
            zh: '公園裡棲息著數百種鳥類和珍稀植物。',
          },
          {
            en: 'Renting a bicycle is the best way to explore the park.',
            zh: '租一輛腳踏車是探索公園的最佳方式。',
          },
        ],
        keyVocabulary: [
          { word: 'forest', phonetic: '/ˈfɒrɪst/', difficulty: 'beginner' },
          { word: 'trail', phonetic: '/treɪl/', difficulty: 'beginner' },
          { word: 'biodiversity', phonetic: '/ˌbaɪoʊdaɪˈvɜːrsɪti/', difficulty: 'advanced' },
          { word: 'lagoon', phonetic: '/ləˈɡuːn/', difficulty: 'intermediate' },
        ],
      },
      {
        id: 'taitung_zhiben',
        nameZh: '知本溫泉',
        nameEn: 'Zhiben Hot Springs',
        phonetic: '/dʒɪˈbɛn hɒt sprɪŋz/',
        emoji: '♨️',
        description: 'A famous hot spring resort area nestled in a valley with sodium bicarbonate springs.',
        phrases: [
          {
            en: 'Zhiben Hot Springs is the perfect place to relax after hiking.',
            zh: '知本溫泉是健行後放鬆的完美地點。',
          },
          {
            en: 'The hot spring water here is rich in sodium bicarbonate.',
            zh: '這裡的溫泉水富含碳酸氫鈉。',
          },
          {
            en: 'Soaking in the hot springs is a wonderful experience in winter.',
            zh: '冬天泡溫泉是一種美妙的體驗。',
          },
        ],
        keyVocabulary: [
          { word: 'hot spring', phonetic: '/hɒt sprɪŋ/', difficulty: 'beginner' },
          { word: 'resort', phonetic: '/rɪˈzɔːrt/', difficulty: 'intermediate' },
          { word: 'therapeutic', phonetic: '/ˌθerəˈpjuːtɪk/', difficulty: 'advanced' },
          { word: 'soak', phonetic: '/soʊk/', difficulty: 'beginner' },
        ],
      },
      {
        id: 'taitung_green_island',
        nameZh: '綠島',
        nameEn: 'Green Island',
        phonetic: '/ɡriːn ˈaɪlənd/',
        emoji: '🏝️',
        description: 'A volcanic island famous for snorkeling, submarine hot springs, and turquoise waters.',
        phrases: [
          {
            en: 'Green Island is famous for snorkeling and its unique submarine hot springs.',
            zh: '綠島以浮潛和獨特的海底溫泉聞名。',
          },
          {
            en: 'The coral reefs around Green Island are home to colorful tropical fish.',
            zh: '綠島周圍的珊瑚礁是五彩熱帶魚的家園。',
          },
          {
            en: 'You can take a ferry from Taitung to reach Green Island.',
            zh: '你可以從台東搭渡輪前往綠島。',
          },
        ],
        keyVocabulary: [
          { word: 'snorkeling', phonetic: '/ˈsnɔːrkəlɪŋ/', difficulty: 'beginner' },
          { word: 'submarine', phonetic: '/ˈsʌbməriːn/', difficulty: 'intermediate' },
          { word: 'coral reef', phonetic: '/ˈkɒrəl riːf/', difficulty: 'intermediate' },
          { word: 'turquoise', phonetic: '/ˈtɜːrkwɔɪz/', difficulty: 'intermediate' },
        ],
      },
      {
        id: 'taitung_sanxiantai',
        nameZh: '三仙台',
        nameEn: 'Sanxiantai',
        phonetic: '/sæn.ʃiːen.taɪ/',
        emoji: '🌉',
        description: 'A coral reef islet connected to the mainland by an iconic eight-arch bridge.',
        phrases: [
          {
            en: 'The eight-arch bridge at Sanxiantai is one of Taiwan\'s most iconic landmarks.',
            zh: '三仙台的八拱橋是台灣最具代表性的地標之一。',
          },
          {
            en: 'Sanxiantai is a small coral island connected to the shore by a footbridge.',
            zh: '三仙台是一座透過步行橋與海岸相連的珊瑚小島。',
          },
          {
            en: 'Legend says three immortals once rested on this island.',
            zh: '傳說曾有三位神仙在此島休息。',
          },
        ],
        keyVocabulary: [
          { word: 'arch bridge', phonetic: '/ɑːrtʃ brɪdʒ/', difficulty: 'intermediate' },
          { word: 'islet', phonetic: '/ˈaɪlɪt/', difficulty: 'advanced' },
          { word: 'coastline', phonetic: '/ˈkoʊstlaɪn/', difficulty: 'beginner' },
          { word: 'mythology', phonetic: '/mɪˈθɒlədʒi/', difficulty: 'advanced' },
        ],
      },
    ],
  },
  tainan: {
    id: 'tainan',
    name: '台南',
    nameEn: 'Tainan',
    tagline: 'The ancient capital of Taiwan',
    description: '400年歷史古都，廟宇、老街、小吃文化豐富',
    emoji: '🏯',
    gradient: 'from-amber-500 to-orange-700',
    locations: [],
  },
  hualien: {
    id: 'hualien',
    name: '花蓮',
    nameEn: 'Hualien',
    tagline: 'Gateway to Taroko Gorge',
    description: '太魯閣峽谷、七星潭與花蓮港',
    emoji: '🏞️',
    gradient: 'from-blue-500 to-cyan-700',
    locations: [],
  },
};

export const DIFFICULTY_COLOR = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

export const DIFFICULTY_LABEL = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '進階',
};
