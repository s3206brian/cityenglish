'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { COURSES } from '../../data/courses';

function speak(text) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const course = COURSES.find((c) => c.id === courseId);
  const [activeTab, setActiveTab] = useState('script'); // script | phrases | patterns
  const [practicingIdx, setPracticingIdx] = useState(null);

  if (!course) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">找不到此課程</p>
          <Link href="/courses" className="text-blue-600 underline">返回課程列表</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className={`bg-gradient-to-r ${course.gradient} px-4 pt-6 pb-8`}>
        <Link href="/courses" className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          課程列表
        </Link>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{course.emoji}</span>
          <div>
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">初階 · {course.duration}</span>
            <h1 className="text-white font-bold text-xl mt-1">{course.title}</h1>
            <p className="text-white/70 text-sm mt-0.5">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* YouTube Player */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          {course.youtubeId ? (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${course.youtubeId}`}
                title={course.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center text-gray-400">
              <div className="text-5xl mb-3">🎬</div>
              <p className="text-sm font-medium text-gray-500">影片即將上線</p>
              <p className="text-xs mt-1">管理員正在準備教學影片</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl border border-gray-100 p-1 mb-5 shadow-sm">
          {[
            { id: 'script', label: '📜 腳本' },
            { id: 'phrases', label: '💬 練習句' },
            { id: 'patterns', label: '📐 句型' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Script tab */}
        {activeTab === 'script' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">影片腳本</h2>
              <button onClick={() => speak(course.script)}
                className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full">
                🔊 聽全文
              </button>
            </div>
            <div className="space-y-2">
              {course.script.split('\n').filter(Boolean).map((line, i) => (
                <div key={i} className="flex items-start gap-2 group">
                  <button onClick={() => speak(line)}
                    className="mt-0.5 text-gray-300 hover:text-blue-500 shrink-0 transition">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                  <p className="text-sm text-gray-800 leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phrases tab */}
        {activeTab === 'phrases' && (
          <div className="space-y-3">
            {course.phrases.map((phrase, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-base">{phrase.en}</p>
                    <p className="text-sm text-amber-700 mt-1">{phrase.zh}</p>
                    {phrase.tip && (
                      <p className="text-xs text-gray-400 mt-1.5 bg-gray-50 rounded-lg px-2 py-1">
                        💡 {phrase.tip}
                      </p>
                    )}
                  </div>
                  <button onClick={() => speak(phrase.en)}
                    className="shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => setPracticingIdx(practicingIdx === i ? null : i)}
                  className={`w-full text-xs py-2 rounded-xl border transition font-medium ${
                    practicingIdx === i
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500'
                  }`}
                >
                  {practicingIdx === i ? '✓ 練習中' : '開口練習'}
                </button>
                {practicingIdx === i && (
                  <div className="mt-2 bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium mb-2">跟著念：</p>
                    <p className="text-base font-semibold text-blue-800">{phrase.en}</p>
                    <button onClick={() => speak(phrase.en)}
                      className="mt-2 text-xs text-blue-500 hover:text-blue-700">
                      🔊 再聽一遍
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Patterns tab */}
        {activeTab === 'patterns' && (
          <div className="space-y-3">
            {course.keyPatterns.map((kp, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="bg-amber-50 rounded-xl px-3 py-2 mb-3">
                  <p className="text-xs text-amber-500 font-medium mb-0.5">句型</p>
                  <p className="font-mono text-amber-800 font-semibold text-sm">{kp.pattern}</p>
                  <p className="text-xs text-amber-600 mt-0.5">{kp.zh}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">例句</p>
                    <p className="text-sm font-medium text-gray-800">{kp.example}</p>
                  </div>
                  <button onClick={() => speak(kp.example)}
                    className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition shrink-0 ml-3">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
