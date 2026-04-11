'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import { CITIES } from '../../data/cities';

function findLocation(locationId) {
  for (const city of Object.values(CITIES)) {
    const loc = city.locations.find((l) => l.id === locationId);
    if (loc) return { city, loc };
  }
  return null;
}

const SCORE_COLOR = (score) => {
  if (score >= 85) return 'text-green-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
};

const WORD_COLOR = (confidence) => {
  if (confidence === undefined) return 'text-gray-400';
  if (confidence >= 0.85) return 'text-green-600 bg-green-50';
  if (confidence >= 0.6) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

export default function PracticePage() {
  const { locationId } = useParams();
  const { user, supabase } = useAuth();
  const found = findLocation(locationId);

  const [state, setState] = useState('idle'); // idle | recording | loading | result
  const [result, setResult] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  if (!found) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">找不到此景點</p>
          <Link href="/cities/taitung" className="text-blue-600 underline">返回城市列表</Link>
        </div>
      </main>
    );
  }

  const { city, loc } = found;

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = handleStop;
      mediaRef.current = recorder;
      recorder.start();
      setState('recording');
    } catch {
      alert('無法存取麥克風，請確認瀏覽器權限。');
    }
  }

  function stopRecording() {
    if (mediaRef.current && state === 'recording') {
      mediaRef.current.stop();
      mediaRef.current.stream.getTracks().forEach((t) => t.stop());
      setState('loading');
    }
  }

  async function handleStop() {
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const headers = { 'Content-Type': 'application/json' };
        // 取得 Supabase access token，傳給後端驗證身份
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
          }
        } catch { /* 未登入時略過 */ }

        const res = await fetch(`${apiUrl}/api/evaluate-speech`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            audioBase64: base64,
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            targetPhrase: loc.practicePhrase,
            locationId: loc.id,
            userId: user?.id ?? undefined,
          }),
        });
        const data = await res.json();
        setResult(data);
        setState('result');
        animateScore(data.score);
      } catch {
        alert('評分失敗，請確認後端服務是否正常。');
        setState('idle');
      }
    };
    reader.readAsDataURL(blob);
  }

  function animateScore(target) {
    setDisplayScore(0);
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayScore(current);
      if (current >= target) clearInterval(interval);
    }, 20);
  }

  function reset() {
    setResult(null);
    setDisplayScore(0);
    setState('idle');
  }

  const words = loc.practicePhrase.split(' ');

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-xl mx-auto">
        {/* Back */}
        <Link
          href={`/cities/${city.id}`}
          className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 mb-8"
        >
          ← 返回 {city.name}
        </Link>

        {/* Location info */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">{loc.emoji}</div>
          <h1 className="text-2xl font-bold text-gray-900">{loc.nameZh}</h1>
          <p className="text-gray-400 text-sm">{loc.nameEn}</p>
          <p className="text-blue-400 font-mono text-xs mt-1">{loc.phonetic}</p>
        </div>

        {/* Practice phrase */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 text-center">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">練習短語</p>
          {state === 'result' && result ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {words.map((word, i) => {
                const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
                const wc = result.wordConfidence?.find(
                  (w) => w.word.toLowerCase() === clean
                );
                return (
                  <span
                    key={i}
                    className={`text-xl font-semibold px-2 py-0.5 rounded-lg ${WORD_COLOR(wc?.confidence)}`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xl font-semibold text-gray-800 leading-relaxed">
              {loc.practicePhrase}
            </p>
          )}
        </div>

        {/* Score result */}
        {state === 'result' && result && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold count-up ${SCORE_COLOR(result.score)}`}>
                {displayScore}
              </div>
              <p className="text-gray-400 text-sm mt-1">/ 100 分</p>
            </div>

            {/* Word confidence bars */}
            <div className="space-y-3">
              {result.wordConfidence?.map((wc) => (
                <div key={wc.word}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{wc.word}</span>
                    <span className="text-gray-400">{Math.round(wc.confidence * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        wc.confidence >= 0.85
                          ? 'bg-green-500'
                          : wc.confidence >= 0.6
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.round(wc.confidence * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {result.missedWords?.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-xl">
                <p className="text-xs text-red-600 font-medium mb-1">需要加強：</p>
                <div className="flex flex-wrap gap-2">
                  {result.missedWords.map((w) => (
                    <span key={w} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Record button */}
        <div className="flex flex-col items-center gap-4">
          {state === 'idle' && (
            <button
              onMouseDown={startRecording}
              onTouchStart={startRecording}
              className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
            >
              🎙️
            </button>
          )}

          {state === 'recording' && (
            <button
              onMouseUp={stopRecording}
              onTouchEnd={stopRecording}
              className="relative w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg"
            >
              <span className="absolute inset-0 rounded-full bg-red-400 pulse-ring" />
              ⏹️
            </button>
          )}

          {state === 'loading' && (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl animate-pulse">
              ⏳
            </div>
          )}

          {state === 'result' && (
            <button
              onClick={reset}
              className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:bg-blue-700 transition"
            >
              🔄
            </button>
          )}

          <p className="text-sm text-gray-400">
            {state === 'idle' && '按住麥克風開始錄音'}
            {state === 'recording' && '放開停止錄音…'}
            {state === 'loading' && 'AI 評分中…'}
            {state === 'result' && '按重試再練習一次'}
          </p>
        </div>

        {/* Vocabulary */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">本景點關鍵詞彙</h2>
          <div className="grid grid-cols-2 gap-3">
            {loc.keyVocabulary.map((v) => (
              <div key={v.word} className="bg-white border border-gray-200 rounded-xl p-3">
                <p className="font-semibold text-gray-800 text-sm">{v.word}</p>
                <p className="text-blue-400 font-mono text-xs">{v.phonetic}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
