'use client';
import { useState } from 'react';
import Link from 'next/link';

const SECTIONS = [
  {
    id: 'overview',
    label: '平台介紹',
    emoji: '🌏',
    content: [
      {
        title: 'CityEnglish 是什麼？',
        body: 'CityEnglish 是一個結合旅遊與英語學習的平台。透過真實的台灣城市景點情境，讓你在出發前就學好實用旅遊英語。',
      },
      {
        title: '適合誰使用？',
        items: [
          { icon: '🧳', label: '旅遊者', desc: '出發前練習景點、餐廳、問路等實用英語' },
          { icon: '🏪', label: '店家業者', desc: '入駐平台，讓外國旅客提前學習你店裡的英語' },
          { icon: '👨‍🏫', label: '英語學習者', desc: '透過課程、腳本、錄音練習提升口說能力' },
        ],
      },
    ],
  },
  {
    id: 'practice',
    label: '語音練習',
    emoji: '🎤',
    content: [
      {
        title: '如何開始練習？',
        steps: [
          { step: '1', text: '從首頁或導覽列點選「探索城市」' },
          { step: '2', text: '選擇台東、台南或花蓮其中一個城市' },
          { step: '3', text: '點選任一景點進入練習頁面' },
          { step: '4', text: '點擊麥克風按鈕開始錄音' },
          { step: '5', text: 'AI 會即時評分你的發音，並顯示每個單字的表現' },
        ],
      },
      {
        title: '評分說明',
        items: [
          { icon: '🟢', label: '85 分以上', desc: '發音很棒，繼續保持！' },
          { icon: '🟡', label: '60–84 分', desc: '大致正確，可以再練習幾次' },
          { icon: '🔴', label: '60 分以下', desc: '建議先聽一遍範例再跟著念' },
        ],
      },
      {
        title: '練習技巧',
        tips: [
          '先點「聽發音」按鈕聽清楚正確發音',
          '在安靜的環境錄音效果更好',
          '不用擔心口音，重點是清楚發音每個單字',
          '同一句多練幾次，分數會越來越高',
        ],
      },
    ],
  },
  {
    id: 'courses',
    label: '課程',
    emoji: '🎬',
    content: [
      {
        title: '課程怎麼用？',
        body: '課程提供教學影片 + 腳本 + 練習句 + 句型三合一學習體驗，適合從零開始的旅遊英語學習者。',
      },
      {
        title: '課程頁面功能',
        items: [
          { icon: '📜', label: '腳本', desc: '影片對話腳本，每行都可以點擊播放音訊' },
          { icon: '💬', label: '練習句', desc: '精選實用句子，附中文翻譯與使用提示' },
          { icon: '📐', label: '句型', desc: '核心句型結構，學會一個句型舉一反三' },
        ],
      },
      {
        title: '學習建議',
        tips: [
          '先看完影片再練習，效果最好',
          '腳本頁可以逐句播放，試著跟著念',
          '練習句的「開口練習」模式可以強化記憶',
        ],
      },
    ],
  },
  {
    id: 'progress',
    label: '進度與排行榜',
    emoji: '🏆',
    content: [
      {
        title: '積分系統',
        body: '每次語音練習後都會獲得積分。積分計算公式：',
        formula: '基礎 10 分 + 分數的一半（例：得 80 分 → 10 + 40 = 50 積分）',
      },
      {
        title: '我的進度',
        items: [
          { icon: '📊', label: '各城市練習記錄', desc: '查看你在台東、台南、花蓮的練習次數和最高分' },
          { icon: '💎', label: '總積分', desc: '所有城市累積的積分總和' },
          { icon: '✏️', label: '修改顯示名稱', desc: '點擊名字旁的編輯按鈕可以修改顯示名稱（保護隱私）' },
        ],
      },
      {
        title: '排行榜',
        items: [
          { icon: '🌍', label: '全球排行', desc: '與所有用戶比較積分排名' },
          { icon: '🏙️', label: '城市排行', desc: '查看各城市的頂尖練習者' },
        ],
      },
    ],
  },
  {
    id: 'shops',
    label: '英語店家',
    emoji: '🏪',
    content: [
      {
        title: '什麼是英語友善店家？',
        body: '英語友善店家是願意讓旅客用英語溝通的在地商家。店家提供專屬的英語練習句和詞彙，讓旅客出發前就做好準備。',
      },
      {
        title: '如何使用店家頁面？',
        steps: [
          { step: '1', text: '點選導覽列「英語店家」' },
          { step: '2', text: '依城市或類型（餐廳、咖啡廳、商店等）篩選' },
          { step: '3', text: '進入店家頁面練習該店專屬的英語對話' },
          { step: '4', text: '出發前練習，到了現場就能自信開口' },
        ],
      },
      {
        title: '我是店家業者',
        items: [
          { icon: '📝', label: '申請入駐', desc: '前往「申請入駐」填寫店家資訊和英語練習句' },
          { icon: '⏳', label: '等待審核', desc: '管理員審核通過後，店家會顯示在列表中（1-3 個工作天）' },
          { icon: '🛠️', label: '管理後台', desc: '登入後前往「店家後台」可隨時更新資訊和練習內容' },
        ],
      },
    ],
  },
  {
    id: 'account',
    label: '帳號功能',
    emoji: '👤',
    content: [
      {
        title: '為什麼要登入？',
        body: '未登入也可以使用語音練習功能，但登入後可以享有更多功能：',
        items: [
          { icon: '💾', label: '儲存練習記錄', desc: '每次練習自動儲存，隨時查看進步幅度' },
          { icon: '🏆', label: '參與排行榜', desc: '積分累積後可以出現在排行榜上' },
          { icon: '🏪', label: '申請店家入駐', desc: '需要登入才能申請成為英語友善店家' },
        ],
      },
      {
        title: '如何登入？',
        steps: [
          { step: '1', text: '點選右上角「登入」按鈕' },
          { step: '2', text: '使用 Google 帳號一鍵登入（最方便）' },
          { step: '3', text: '或使用 Email / 密碼註冊' },
        ],
      },
      {
        title: '保護隱私',
        tips: [
          '在「我的進度」頁面可以修改顯示名稱，用暱稱代替真實姓名',
          '排行榜上顯示的是你設定的顯示名稱',
        ],
      },
    ],
  },
];

function StepItem({ step, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {step}
      </span>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

function IconItem({ icon, label, desc }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function TipItem({ text }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-blue-400 shrink-0 mt-0.5">▸</span>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}

export default function TutorialPage() {
  const [active, setActive] = useState('overview');
  const section = SECTIONS.find(s => s.id === active);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">使用教學</h1>
          <p className="text-gray-400">了解如何使用 CityEnglish 的所有功能</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-48 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-2 md:sticky md:top-20">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    active === s.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{s.emoji}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-5">
            {/* Section header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{section.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold">{section.label}</h2>
                </div>
              </div>
            </div>

            {/* Content blocks */}
            {section.content.map((block, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4">{block.title}</h3>

                {block.body && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{block.body}</p>
                )}

                {block.formula && (
                  <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4">
                    <p className="text-sm font-mono text-blue-800">{block.formula}</p>
                  </div>
                )}

                {block.steps && (
                  <div className="space-y-3">
                    {block.steps.map((s, j) => <StepItem key={j} {...s} />)}
                  </div>
                )}

                {block.items && (
                  <div className="space-y-4">
                    {block.items.map((item, j) => <IconItem key={j} {...item} />)}
                  </div>
                )}

                {block.tips && (
                  <div className="space-y-2">
                    {block.tips.map((t, j) => <TipItem key={j} text={t} />)}
                  </div>
                )}
              </div>
            ))}

            {/* Navigation between sections */}
            <div className="flex justify-between items-center pt-2">
              {SECTIONS.findIndex(s => s.id === active) > 0 ? (
                <button
                  onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s => s.id === active) - 1].id)}
                  className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 transition"
                >
                  ← 上一章節
                </button>
              ) : <div />}
              {SECTIONS.findIndex(s => s.id === active) < SECTIONS.length - 1 ? (
                <button
                  onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s => s.id === active) + 1].id)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition font-medium"
                >
                  下一章節 →
                </button>
              ) : (
                <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition">
                  開始使用 →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
