export const metadata = {
  title: '隱私權政策 — CityEnglish',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">隱私權政策</h1>
        <p className="text-sm text-gray-400 mb-8">最後更新：2026 年 4 月</p>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-3">1. 我們收集的資訊</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            當你使用 CityEnglish 時，我們可能收集以下資訊：
          </p>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>帳號資訊：電子郵件地址、顯示名稱、大頭照（透過 Google 登入取得）</li>
            <li>練習記錄：語音練習的分數、練習次數、練習時間</li>
            <li>語音資料：錄音僅用於即時語音評分，不會永久儲存</li>
            <li>裝置資訊：作業系統版本、裝置類型（用於改善 App 相容性）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-3">2. 資訊的使用方式</h2>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>提供語音發音評分功能</li>
            <li>記錄並顯示你的學習進度</li>
            <li>計算排行榜積分</li>
            <li>改善平台功能與使用體驗</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-3">3. 資料分享</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            我們不會將你的個人資料出售給第三方。我們使用以下第三方服務：
          </p>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li><strong>Supabase</strong>：資料庫與身份驗證服務</li>
            <li><strong>OpenAI Whisper</strong>：語音轉文字（錄音僅用於即時處理）</li>
            <li><strong>Google OAuth</strong>：第三方登入</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-3">4. 麥克風使用</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            App 需要麥克風權限來錄製語音練習。錄音僅在你主動點擊錄音按鈕時進行，
            錄音資料僅用於即時語音評分，評分完成後不會保留音訊檔案。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-3">5. 資料保留</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            你的帳號資料和練習記錄會保留至你主動刪除帳號為止。
            你可以隨時聯繫我們要求刪除所有個人資料。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-3">6. 兒童隱私</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            本服務適合 13 歲以上用戶使用。我們不會故意收集 13 歲以下兒童的個人資料。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-3">7. 聯絡我們</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            如有任何隱私權相關問題，請聯繫：
            <a href="mailto:briantsai@chengxun.org" className="text-blue-600 hover:underline ml-1">
              briantsai@chengxun.org
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
