import './globals.css';
import Nav from './components/Nav';
import BottomNav from './components/BottomNav';
import AuthProvider from './components/AuthProvider';

export const metadata = {
  title: 'CityEnglish — 用旅行學英文',
  description:
    '探索台灣城市景點，同時練習英文口說。透過真實情境學習景點名稱、例句與發音，讓旅行成為最好的英語教室。',
  keywords: '英文學習, 台灣景點, 口說練習, 旅行英文, 台東, 城市英語',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'CityEnglish — 用旅行學英文',
    description: '探索台灣城市景點，練習英文口說',
    type: 'website',
    images: ['/logo.svg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        <AuthProvider>
          <Nav />
          {/* pb-16 讓內容不被底部 nav 遮住（手機） */}
          <div className="sm:pb-0 pb-16">
            {children}
          </div>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
