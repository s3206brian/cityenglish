'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
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

function scoreColor(score) {
  if (score >= 85) return 'text-green-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

function scoreBg(score) {
  if (score >= 85) return 'bg-green-500';
  if (score >= 60) return 'bg-amber-400';
  return 'bg-red-400';
}

function wordColor(confidence) {
  if (confidence === undefined) return 'text-gray-300';
  if (confidence >= 0.85) return 'text-green-600 bg-green-50 border-green-200';
  if (confidence >= 0.6) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-500 bg-red-50 border-red-200';
}

function speak(text) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export default function PracticePage() {
  const { locationId } = useParams();
  const { user, supabase } = useAuth();
  const found = findLocation(locationId);

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [showZh, setShowZh] = useState(false);
  const [state, setState] = useState('idle'); // idle | recording | loading | result
  const [result, setResult] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [recordSecs, setRecordSecs] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    clearInterval(timerRef.current);
  }, []);

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
  const phrases = loc.phrases ?? [{ en: loc.practicePhrase, zh: '' }];
  const currentPhrase = phrases[phraseIdx];
  const totalPhrases = phrases.length;

  function handleSpeak() {
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentPhrase.en);
    u.lang = 'en-US';
    u.rate = 0.85;
    u.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }

  async function toggleRecording() {
    if (state === 'idle') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        chunksRef.current = [];
        recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
        recorder.onstop = handleStop;
        mediaRef.current = recorder;
        recorder.start();
        setRecordSecs(0);
        timerRef.current = setInterval(() => setRecordSecs((s) => s + 1), 1000);
        setState('recording');
      } catch {
        alert('無法存取麥克風，請確認瀏覽器權限。');
      }
    } else if (state === 'recording') {
      clearInterval(timerRef.current);
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
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        } catch { /* 未登入略過 */ }

        const res = await fetch(`${apiUrl}/api/evaluate-speech`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            audioBase64: base64,
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            targetPhrase: currentPhrase.en,
            locationId: loc.id,
            userId: user?.id ?? undefined,
          }),
        });
        const data = await res.json();
        setResult(data);
        setState('result');
        animateScore(data.score ?? 0);
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
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayScore(current);
      if (current >= target) clearInterval(id);
    }, 18);
  }

  function reset() {
    setResult(null);
    setDisplayScore(0);
    setState('idle');
    setShowZh(false);
  }

  function nextPhrase() {
    reset();
    setPhraseIdx((i) => (i + 1) % totalPhrases);
  }

  function prevPhrase() {
    reset();
    setPhraseIdx((i) => (i - 1 + totalPhrases) % totalPhrases);
  }

  const words = currentPhrase.en.split(' ');

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/cities/${city.id}`}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {city.name}
          </Link>

          {/* Phrase dots */}
          <div className="flex items-center gap-1.5">
            {phrases.map((_, i) => (
              <button
                key={i}
                onClick={() => { reset(); setPhraseIdx(i); }}
                className={`rounded-full transition-all ${
                  i === phraseIdx ? 'w-5 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <span className="text-xs text-gray-400">{phraseIdx + 1} / {totalPhrases}</span>
        </div>

        {/* Location card */}
        <div className={`bg-gradient-to-br ${city.gradient} rounded-2xl p-5 text-white mb-5 flex items-center gap-4`}>
          <span className="text-4xl">{loc.emoji}</span>
          <div>
            <h1 className="font-bold text-lg leading-tight">{loc.nameZh}</h1>
            <p className="text-white/70 text-sm">{loc.nameEn}</p>
            <p className="text-white/60 font-mono text-xs mt-0.5">{loc.phonetic}</p>
          </div>
        </div>

        {/* Practice phrase card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">練習短語</p>
            <div className="flex items-center gap-2">
              {/* TTS button */}
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition ${
                  isSpeaking
                    ? 'bg-blue-50 text-blue-500 border-blue-200 animate-pulse'
                    : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                {isSpeaking ? '播放中' : '聽發音'}
              </button>
              {/* 中文 toggle */}
              <button
                onClick={() => setShowZh((v) => !v)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  showZh ? 'bg-amber-50 text-amber-600 border-amber-200' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                中文
              </button>
            </div>
          </div>

          {/* Phrase display */}
          {state === 'result' && result ? (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {words.map((word, i) => {
                const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
                const wc = result.wordConfidence?.find((w) => w.word.toLowerCase() === clean);
                return (
                  <span
                    key={i}
                    className={`text-lg font-semibold px-2 py-0.5 rounded-lg border ${wordColor(wc?.confidence)}`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xl font-semibold text-gray-800 leading-relaxed mb-3">
              {currentPhrase.en}
            </p>
          )}

          {/* Chinese translation */}
          {showZh && currentPhrase.zh && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
              {currentPhrase.zh}
            </p>
          )}
        </div>

        {/* Score result */}
        {state === 'result' && result && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            {/* Score circle */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-5xl font-bold count-up ${scoreColor(result.score)}`}>
                {displayScore}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>總分</span>
                  <span>/ 100</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${scoreBg(result.score)}`}
                    style={{ width: `${displayScore}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {result.score >= 85 ? '🎉 發音很棒！' : result.score >= 60 ? '👍 繼續加油！' : '💪 多練習幾次'}
                </p>
              </div>
            </div>

            {/* Word bars */}
            {result.wordConfidence?.length > 0 && (
              <div className="space-y-2.5 border-t border-gray-50 pt-4">
                {result.wordConfidence.map((wc) => (
                  <div key={wc.word}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{wc.word}</span>
                      <span className="text-gray-400">{Math.round(wc.confidence * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          wc.confidence >= 0.85 ? 'bg-green-500' : wc.confidence >= 0.6 ? 'bg-amber-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.round(wc.confidence * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.missedWords?.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                <p className="text-xs text-red-500 font-medium mb-1.5">需要加強：</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missedWords.map((w) => (
                    <span key={w} className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{w}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recording controls */}
        <div className="flex flex-col items-center gap-3 my-6">
          {/* Main button */}
          <button
            onClick={toggleRecording}
            disabled={state === 'loading'}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 select-none ${
              state === 'idle' ? 'bg-blue-600 hover:bg-blue-700' :
              state === 'recording' ? 'bg-red-500' :
              state === 'loading' ? 'bg-gray-300 cursor-not-allowed' :
              'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {state === 'recording' && (
              <span className="absolute inset-0 rounded-full bg-red-400 pulse-ring" />
            )}
            {state === 'idle' && (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
              </svg>
            )}
            {state === 'recording' && (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1"/>
              </svg>
            )}
            {state === 'loading' && (
              <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            )}
            {state === 'result' && (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
            )}
          </button>

          {/* Status text */}
          <p className="text-sm text-gray-500 text-center">
            {state === 'idle' && '點擊麥克風開始錄音'}
            {state === 'recording' && (
              <span className="text-red-500 font-medium">
                錄音中 {recordSecs}s… 再次點擊停止
              </span>
            )}
            {state === 'loading' && <span className="text-blue-500">AI 評分中…</span>}
            {state === 'result' && '點擊重新錄音'}
          </p>

          {/* Result action buttons */}
          {state === 'result' && (
            <div className="flex gap-3 mt-1">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                重試
              </button>
              {totalPhrases > 1 && (
                <button
                  onClick={nextPhrase}
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  下一句
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Phrase navigation */}
        {totalPhrases > 1 && state !== 'recording' && state !== 'loading' && (
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevPhrase}
              disabled={phraseIdx === 0}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              上一句
            </button>
            <button
              onClick={nextPhrase}
              disabled={phraseIdx === totalPhrases - 1}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              下一句
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Vocabulary */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">關鍵詞彙</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {loc.keyVocabulary.map((v) => (
              <button
                key={v.word}
                onClick={() => speak(v.word)}
                className="bg-white border border-gray-100 rounded-xl p-3 text-left hover:border-blue-200 hover:bg-blue-50 transition group"
              >
                <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-700">{v.word}</p>
                <p className="text-blue-400 font-mono text-xs mt-0.5">{v.phonetic}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
