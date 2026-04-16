'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CourseForm from '../_components/CourseForm';

export default function EditCoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('courses').select('*').eq('id', id).single()
      .then(({ data }) => { setCourse(data); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-20 text-gray-400">找不到此課程</div>;
  }

  return <CourseForm initial={course} isEdit />;
}
