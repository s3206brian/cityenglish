'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('courses')
      .select('id, title, title_en, emoji, gradient, description, duration, objectives, youtube_id, published')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => { setCourses(data || []); setLoading(false); });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">初階課程</h1>
          <p className="text-gray-400 text-sm">觀看影片、跟著腳本練習發音，快速建立旅遊英語基礎</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}
                className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
                <div className={`bg-gradient-to-r ${course.gradient} p-5 flex items-center gap-4`}>
                  <span className="text-4xl">{course.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">初階</span>
                      <span className="text-white/70 text-xs">{course.duration}</span>
                    </div>
                    <h2 className="text-white font-bold text-base leading-tight">{course.title}</h2>
                    <p className="text-white/70 text-xs mt-1">{course.title_en}</p>
                  </div>
                  <svg className="w-5 h-5 text-white/70 shrink-0 group-hover:translate-x-1 transition-transform"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                  {Array.isArray(course.objectives) && course.objectives.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {course.objectives.map((obj) => (
                        <span key={obj} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          ✓ {obj}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
          <p className="text-sm text-blue-700 font-medium mb-1">更多課程即將推出</p>
          <p className="text-xs text-blue-500">包含中級、進階旅遊英語，以及城市主題課程</p>
        </div>
      </div>
    </main>
  );
}
