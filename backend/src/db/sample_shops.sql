-- 範例店家資料（在 Supabase SQL Editor 執行）
-- approved=true, published=true 讓它們直接顯示在列表

INSERT INTO shops (name_zh, name_en, city, category, description_zh, description_en, address, phone, instagram, image_url, phrases, key_vocabulary, approved, published, sort_order) VALUES

-- ===== 台東 =====
(
  '鐵花咖啡',
  'Tiehua Coffee',
  'taitung',
  'cafe',
  '位於鐵花村文創聚落內的咖啡廳，提供精品手沖咖啡和在地農產果汁，是台東旅遊必訪的放鬆角落。',
  'A specialty coffee shop inside Tiehua Music Village, serving pour-over coffee and local fruit juices. A must-visit relaxation spot in Taitung.',
  '台東縣台東市新生路 135 號（鐵花村內）',
  '089-310-818',
  '@tiehua_taitung',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  '[
    {"en": "I would like a pour-over coffee, please.", "zh": "我想要一杯手沖咖啡，謝謝。", "tip": "點手沖咖啡的標準說法"},
    {"en": "What beans do you use today?", "zh": "你們今天用什麼豆子？", "tip": "詢問咖啡豆產地"},
    {"en": "Can I have an iced latte?", "zh": "我可以要一杯冰拿鐵嗎？", "tip": "點冰飲的禮貌問法"},
    {"en": "Is this seat taken?", "zh": "這個位子有人坐嗎？", "tip": "詢問座位是否空著"}
  ]',
  '[
    {"word": "pour-over", "phonetic": "/pɔːr ˈoʊvər/", "zh": "手沖咖啡", "example": "The pour-over takes about 4 minutes."},
    {"word": "single origin", "phonetic": "/ˈsɪŋɡəl ˈɒrɪdʒɪn/", "zh": "單一產區", "example": "This is a single origin from Ethiopia."},
    {"word": "oat milk", "phonetic": "/oʊt mɪlk/", "zh": "燕麥奶", "example": "Can I substitute oat milk?"},
    {"word": "cold brew", "phonetic": "/koʊld bruː/", "zh": "冷泡咖啡", "example": "The cold brew is steeped for 12 hours."}
  ]',
  true, true, 1
),

(
  '都蘭糖廠咖啡屋',
  'Dulan Sugar Factory Café',
  'taitung',
  'cafe',
  '日治時代糖廠改建的複合式空間，保留老建築風情。提供咖啡、甜點，以及來自都蘭部落的手作商品。',
  'A multi-purpose space converted from a Japanese-era sugar factory. Retains the charm of old architecture with coffee, desserts, and handmade indigenous crafts.',
  '台東縣東河鄉都蘭村 61-1 號',
  '089-530-011',
  '@dulan_sugar',
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
  '[
    {"en": "Do you have any local specialties?", "zh": "你們有什麼在地特色嗎？", "tip": "詢問當地特色食物或商品"},
    {"en": "What is this made of?", "zh": "這個是用什麼做的？", "tip": "詢問食材或材料"},
    {"en": "Can I take a photo here?", "zh": "我可以在這裡拍照嗎？", "tip": "拍照前禮貌詢問"},
    {"en": "How much is this handmade item?", "zh": "這個手工藝品多少錢？", "tip": "詢問商品價格"}
  ]',
  '[
    {"word": "handmade", "phonetic": "/ˈhændmeɪd/", "zh": "手工製作", "example": "All jewelry here is handmade."},
    {"word": "indigenous", "phonetic": "/ɪnˈdɪdʒɪnəs/", "zh": "原住民的", "example": "This is traditional indigenous craft."},
    {"word": "specialty", "phonetic": "/ˈspeʃəlti/", "zh": "特色/招牌", "example": "The specialty here is millet wine cake."},
    {"word": "souvenir", "phonetic": "/ˌsuːvəˈnɪr/", "zh": "紀念品", "example": "I am looking for a souvenir."}
  ]',
  true, true, 2
),

(
  '台東慢食節市集',
  'Taitung Slow Food Market',
  'taitung',
  'attraction',
  '每週末在鐵道藝術村舉辦的市集，匯聚台東在地農夫、手作職人和美食攤位，感受最真實的台東慢活文化。',
  'A weekend market held at the Railway Art Village, gathering local Taitung farmers, artisans, and food stalls. Experience the authentic slow-living culture of Taitung.',
  '台東縣台東市鐵道藝術村',
  '',
  '@taitung_slowfood',
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
  '[
    {"en": "What time does the market open?", "zh": "市集幾點開始？", "tip": "詢問市集開放時間"},
    {"en": "Is this organic?", "zh": "這是有機的嗎？", "tip": "詢問食材是否有機"},
    {"en": "Can I try a sample?", "zh": "我可以試吃嗎？", "tip": "請求試吃的禮貌說法"},
    {"en": "Where is this produce from?", "zh": "這個農產品來自哪裡？", "tip": "詢問食材產地"}
  ]',
  '[
    {"word": "organic", "phonetic": "/ɔːrˈɡænɪk/", "zh": "有機的", "example": "All vegetables here are organic."},
    {"word": "artisan", "phonetic": "/ˈɑːrtɪzən/", "zh": "工匠/職人", "example": "This bread is made by a local artisan."},
    {"word": "free-range", "phonetic": "/friː reɪndʒ/", "zh": "放養的", "example": "These are free-range eggs."},
    {"word": "seasonal", "phonetic": "/ˈsiːzənəl/", "zh": "當季的", "example": "We only sell seasonal fruits."}
  ]',
  true, true, 3
),

-- ===== 台南 =====
(
  '神農街老宅咖啡',
  'Shennong Street Heritage Café',
  'tainan',
  'cafe',
  '藏身於神農街百年老宅中的特色咖啡館，保留清代建築格局，提供精選咖啡與台南傳統甜點，是感受老台南氛圍的絕佳場所。',
  'A specialty café hidden inside a century-old building on Shennong Street. The Qing-dynasty architecture is preserved, serving curated coffee and traditional Tainan desserts.',
  '台南市中西區神農街',
  '',
  '@shennong_cafe',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
  '[
    {"en": "Do you have any traditional Tainan desserts?", "zh": "你們有台南傳統甜點嗎？", "tip": "詢問在地特色甜點"},
    {"en": "How old is this building?", "zh": "這棟建築有多少年歷史？", "tip": "詢問建築歷史"},
    {"en": "Can I sit by the window?", "zh": "我可以坐靠窗的位置嗎？", "tip": "指定座位的說法"},
    {"en": "I would like something cold, please.", "zh": "我想要喝點冰涼的，謝謝。", "tip": "天氣熱時點冷飲"}
  ]',
  '[
    {"word": "heritage", "phonetic": "/ˈherɪtɪdʒ/", "zh": "文化遺產/古蹟", "example": "This is a heritage building."},
    {"word": "courtyard", "phonetic": "/ˈkɔːrtjɑːrd/", "zh": "庭院/中庭", "example": "We can sit in the courtyard."},
    {"word": "mung bean", "phonetic": "/mʌŋ biːn/", "zh": "綠豆", "example": "The mung bean dessert is very refreshing."},
    {"word": "tofu pudding", "phonetic": "/ˈtoʊfuː ˈpʊdɪŋ/", "zh": "豆花", "example": "I would like the tofu pudding."}
  ]',
  true, true, 4
),

(
  '安平豆花老店',
  'Anping Traditional Tofu Pudding',
  'tainan',
  'restaurant',
  '創立超過五十年的安平老字號豆花店，傳承三代的古早味，使用天然黃豆製作，搭配多種配料，是外國旅客必嚐的台南小吃。',
  'A 50-year-old tofu pudding shop in Anping, passed down through three generations. Made with natural soybeans and served with various toppings — a must-try Tainan snack for foreign visitors.',
  '台南市安平區安平路',
  '',
  '@anping_tofu',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
  '[
    {"en": "What toppings do you have?", "zh": "你們有哪些配料？", "tip": "詢問可以加的料"},
    {"en": "I would like it warm, please.", "zh": "我想要熱的，謝謝。", "tip": "點熱食的說法"},
    {"en": "Is it sweet or savory?", "zh": "是甜的還是鹹的？", "tip": "詢問口味"},
    {"en": "Can I have extra taro balls?", "zh": "可以多加芋圓嗎？", "tip": "加料的說法"}
  ]',
  '[
    {"word": "toppings", "phonetic": "/ˈtɒpɪŋz/", "zh": "配料", "example": "Which toppings would you like?"},
    {"word": "taro balls", "phonetic": "/ˈtɑːroʊ bɔːlz/", "zh": "芋圓", "example": "The taro balls are chewy and delicious."},
    {"word": "red bean", "phonetic": "/red biːn/", "zh": "紅豆", "example": "I would like red bean as a topping."},
    {"word": "savory", "phonetic": "/ˈseɪvəri/", "zh": "鹹的/鮮味的", "example": "The savory version has soy sauce."}
  ]',
  true, true, 5
),

-- ===== 花蓮 =====
(
  '七星潭衝浪學校',
  'Qixingtan Surf School',
  'hualien',
  'attraction',
  '位於七星潭礫石海灘旁的衝浪教學基地，提供專業英語衝浪課程，教練具備國際執照，適合初學者和進階學員。',
  'A surf school located next to Qixingtan Beach. Offers professional English surf lessons by internationally certified instructors, suitable for beginners and advanced surfers.',
  '花蓮縣新城鄉七星潭',
  '0912-345-678',
  '@qixingtan_surf',
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
  '[
    {"en": "I am a complete beginner. Is that okay?", "zh": "我是完全的初學者，這樣可以嗎？", "tip": "表明自己是初學者"},
    {"en": "How long is the lesson?", "zh": "課程多長時間？", "tip": "詢問課程長度"},
    {"en": "Is the equipment included?", "zh": "包含設備嗎？", "tip": "詢問是否含裝備"},
    {"en": "Is it safe to surf here today?", "zh": "今天在這裡衝浪安全嗎？", "tip": "詢問海況安全性"}
  ]',
  '[
    {"word": "surfboard", "phonetic": "/ˈsɜːrfbɔːrd/", "zh": "衝浪板", "example": "You will be given a beginner surfboard."},
    {"word": "wetsuit", "phonetic": "/ˈwetsuːt/", "zh": "防寒衣", "example": "Please wear the wetsuit before entering the water."},
    {"word": "wave", "phonetic": "/weɪv/", "zh": "海浪", "example": "Wait for the right wave before paddling."},
    {"word": "current", "phonetic": "/ˈkɜːrənt/", "zh": "水流", "example": "Be careful of the strong current."}
  ]',
  true, true, 6
),

(
  '太魯閣嚮導服務',
  'Taroko Gorge Guided Tours',
  'hualien',
  'attraction',
  '專業雙語導覽服務，帶領旅客深入太魯閣峽谷探索大理石地形、布農族文化及生態。提供全英語解說，適合外籍旅客和想練習英語的台灣旅客。',
  'Professional bilingual guide service leading visitors deep into Taroko Gorge to explore marble formations, Bunun tribal culture, and local ecology. Full English commentary available.',
  '花蓮縣秀林鄉太魯閣國家公園',
  '03-862-1100',
  '@taroko_guide',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '[
    {"en": "How difficult is the hike?", "zh": "健行難度如何？", "tip": "詢問步道難易度"},
    {"en": "How long does the tour take?", "zh": "導覽需要多長時間？", "tip": "詢問行程時長"},
    {"en": "Do I need to bring anything?", "zh": "我需要帶什麼嗎？", "tip": "詢問需要準備的物品"},
    {"en": "Is this trail suitable for elderly people?", "zh": "這條步道適合老年人嗎？", "tip": "詢問步道適合對象"}
  ]',
  '[
    {"word": "gorge", "phonetic": "/ɡɔːrdʒ/", "zh": "峽谷", "example": "Taroko is famous for its marble gorge."},
    {"word": "marble", "phonetic": "/ˈmɑːrbəl/", "zh": "大理石", "example": "The marble cliffs are millions of years old."},
    {"word": "trail", "phonetic": "/treɪl/", "zh": "步道", "example": "The Shakadang Trail is 4.4 km long."},
    {"word": "suspension bridge", "phonetic": "/səˈspenʃən brɪdʒ/", "zh": "吊橋", "example": "Cross the suspension bridge carefully."}
  ]',
  true, true, 7
),

(
  '花蓮港海鮮餐廳',
  'Hualien Port Seafood Restaurant',
  'hualien',
  'restaurant',
  '緊鄰花蓮漁港的新鮮海鮮料理餐廳，每日直送漁獲，提供現點現煮服務。外籍旅客可指著展示水箱選魚，輕鬆點餐。',
  'A fresh seafood restaurant right next to Hualien Fishing Harbor with daily catch delivered straight from the boats. Foreign visitors can point to the display tanks to order.',
  '花蓮縣花蓮市漁港路',
  '03-823-5678',
  '@hualien_seafood',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
  '[
    {"en": "What is fresh today?", "zh": "今天什麼最新鮮？", "tip": "詢問當天最新鮮的食材"},
    {"en": "I would like to order the fish in that tank.", "zh": "我想要點那個水箱裡的魚。", "tip": "指著水箱點魚"},
    {"en": "How would you like it cooked?", "zh": "你想要怎麼烹調？", "tip": "店家詢問烹調方式時的回應"},
    {"en": "Steamed, please. Keep it simple.", "zh": "請清蒸，簡單就好。", "tip": "選擇清蒸的說法"},
    {"en": "Can we share a dish?", "zh": "我們可以點一份分著吃嗎？", "tip": "詢問是否可以合點"}
  ]',
  '[
    {"word": "steamed", "phonetic": "/stiːmd/", "zh": "清蒸的", "example": "Steamed fish is the healthiest option."},
    {"word": "stir-fried", "phonetic": "/stɜːr fraɪd/", "zh": "炒的", "example": "I prefer stir-fried clams."},
    {"word": "catch of the day", "phonetic": "/kætʃ əv ðə deɪ/", "zh": "今日鮮魚", "example": "What is the catch of the day?"},
    {"word": "shellfish", "phonetic": "/ˈʃelfɪʃ/", "zh": "貝類", "example": "Are you allergic to shellfish?"}
  ]',
  true, true, 8
)

ON CONFLICT DO NOTHING;
