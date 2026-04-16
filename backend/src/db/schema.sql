-- CityEnglish PostgreSQL Schema
-- 在 Supabase SQL Editor 執行此檔案

-- =====================
-- 城市景點表
-- =====================
CREATE TABLE IF NOT EXISTS locations (
  id          TEXT        PRIMARY KEY,   -- e.g. 'taitung_tiehua'
  city        TEXT        NOT NULL,
  name_zh     TEXT        NOT NULL,
  name_en     TEXT        NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- 練習 session 表
-- user_id 直接對應 Supabase auth.users.id
-- =====================
CREATE TABLE IF NOT EXISTS practice_sessions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  location_id     TEXT        REFERENCES locations(id) ON DELETE SET NULL,
  target_phrase   TEXT        NOT NULL,
  transcript      TEXT,
  score           SMALLINT    CHECK (score BETWEEN 0 AND 100),
  word_confidence JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_location   ON practice_sessions(location_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON practice_sessions(created_at DESC);

-- =====================
-- 單字進度表（每個使用者 × 每個單字）
-- =====================
CREATE TABLE IF NOT EXISTS word_progress (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word            TEXT        NOT NULL,
  location_id     TEXT        REFERENCES locations(id) ON DELETE SET NULL,
  attempt_count   INT         NOT NULL DEFAULT 0,
  best_confidence FLOAT       CHECK (best_confidence BETWEEN 0 AND 1),
  last_practiced  TIMESTAMPTZ,
  mastered        BOOLEAN     NOT NULL DEFAULT FALSE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, word)
);

CREATE INDEX IF NOT EXISTS idx_word_progress_user    ON word_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_word_progress_mastered ON word_progress(user_id, mastered);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_word_progress_updated_at ON word_progress;
CREATE TRIGGER trg_word_progress_updated_at
  BEFORE UPDATE ON word_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- Row Level Security
-- =====================
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_progress ENABLE ROW LEVEL SECURITY;

-- 使用者只能讀寫自己的資料
DROP POLICY IF EXISTS "own sessions" ON practice_sessions;
CREATE POLICY "own sessions" ON practice_sessions
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "own word progress" ON word_progress;
CREATE POLICY "own word progress" ON word_progress
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- locations 表公開讀取
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read locations" ON locations;
CREATE POLICY "public read locations" ON locations FOR SELECT USING (true);

-- =====================
-- 景點初始資料
-- =====================
INSERT INTO locations (id, city, name_zh, name_en, description) VALUES
  -- 台東
  ('taitung_tiehua',        '台東', '鐵花村',         'Tiehua Music Village',     '台東最具特色的文創音樂聚落'),
  ('taitung_forest',        '台東', '台東森林公園',   'Taitung Forest Park',      '市區內的珍貴綠肺，擁有琵琶湖'),
  ('taitung_zhiben',        '台東', '知本溫泉',       'Zhiben Hot Springs',       '台東知名溫泉度假區'),
  ('taitung_green_island',  '台東', '綠島',           'Green Island',             '浮潛與海底溫泉著名離島'),
  ('taitung_sanxiantai',    '台東', '三仙台',         'Sanxiantai',               '以八拱橋連接的珊瑚礁島嶼景點'),
  -- 台南
  ('tainan_chihkan',        '台南', '赤崁樓',         'Chihkan Tower',            '荷蘭東印度公司1653年建造的歷史堡壘'),
  ('tainan_anping',         '台南', '安平古堡',       'Anping Fort',              '台灣最古老的堡壘，建於1624年'),
  ('tainan_shennong',       '台南', '神農街',         'Shennong Street',          '保存完整的清朝老街，紅燈籠點綴'),
  ('tainan_confucius',      '台南', '台南孔廟',       'Tainan Confucius Temple',  '台灣首學，建於1665年'),
  ('tainan_garden_night_market', '台南', '花園夜市', 'Garden Night Market',       '台灣最大夜市之一，逾400個攤位'),
  -- 花蓮
  ('hualien_taroko',        '花蓮', '太魯閣國家公園', 'Taroko National Park',     '立霧溪侵蝕大理石峽谷的自然奇觀'),
  ('hualien_qixingtan',     '花蓮', '七星潭',         'Qixingtan Beach',          '新月形礫石海灘，太平洋壯闊景色'),
  ('hualien_pine_garden',   '花蓮', '松園別館',       'Pine Garden',              '日式殖民別墅，百年松林環繞'),
  ('hualien_dongdamen',     '花蓮', '東大門夜市',     'Dongdamen Night Market',   '花蓮最大夜市，原住民風味小吃'),
  ('hualien_liyu_lake',     '花蓮', '鯉魚潭',         'Liyu Lake',                '台灣東部最大淡水湖，山水倒影如畫')
ON CONFLICT (id) DO UPDATE
  SET name_zh = EXCLUDED.name_zh,
      name_en = EXCLUDED.name_en,
      description = EXCLUDED.description;

-- =====================
-- 使用者 Profile 表
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT,
  display_name TEXT        NOT NULL DEFAULT '',
  avatar_url   TEXT        NOT NULL DEFAULT '',
  is_admin     BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 新用戶自動建立 profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 判斷目前用戶是否為管理員（避免 RLS 循環）
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 本人可讀寫自己的 profile
DROP POLICY IF EXISTS "own profile" ON profiles;
CREATE POLICY "own profile" ON profiles
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 管理員可讀取所有 profile
DROP POLICY IF EXISTS "admin read all profiles" ON profiles;
CREATE POLICY "admin read all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- 管理員可更新任意 profile（包含 is_admin 欄位）
DROP POLICY IF EXISTS "admin update profiles" ON profiles;
CREATE POLICY "admin update profiles" ON profiles
  FOR UPDATE USING (is_admin())
  WITH CHECK (is_admin());

-- 將現有用戶補建 profile（初次執行用）
INSERT INTO profiles (id, email, display_name, avatar_url)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'display_name', raw_user_meta_data->>'full_name', ''),
  COALESCE(raw_user_meta_data->>'avatar_url', '')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- =====================
-- 課程表
-- =====================
CREATE TABLE IF NOT EXISTS courses (
  id           TEXT        PRIMARY KEY,
  title        TEXT        NOT NULL,
  title_en     TEXT        NOT NULL DEFAULT '',
  level        TEXT        NOT NULL DEFAULT 'beginner',
  emoji        TEXT        NOT NULL DEFAULT '📚',
  gradient     TEXT        NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  description  TEXT        NOT NULL DEFAULT '',
  youtube_id   TEXT        NOT NULL DEFAULT '',
  duration     TEXT        NOT NULL DEFAULT '10 分鐘',
  objectives   JSONB       NOT NULL DEFAULT '[]',
  script       TEXT        NOT NULL DEFAULT '',
  phrases      JSONB       NOT NULL DEFAULT '[]',
  key_patterns JSONB       NOT NULL DEFAULT '[]',
  published    BOOLEAN     NOT NULL DEFAULT false,
  sort_order   INT         NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_courses_updated_at ON courses;
CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 公開讀取已發布課程
DROP POLICY IF EXISTS "public read courses" ON courses;
CREATE POLICY "public read courses" ON courses
  FOR SELECT USING (published = true);

-- 已登入使用者可讀取所有課程（管理員需要看到草稿）
DROP POLICY IF EXISTS "auth read all courses" ON courses;
CREATE POLICY "auth read all courses" ON courses
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- 已登入使用者可寫入（前端再做 email 驗證）
DROP POLICY IF EXISTS "auth write courses" ON courses;
CREATE POLICY "auth write courses" ON courses
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 課程初始資料（從靜態檔案遷移）
INSERT INTO courses (id, title, title_en, level, emoji, gradient, description, youtube_id, duration, objectives, script, phrases, key_patterns, published, sort_order) VALUES
(
  'beginner_greetings',
  '旅遊英語：問候與自我介紹',
  'Travel English: Greetings & Introductions',
  'beginner', '👋', 'from-blue-500 to-cyan-500',
  '學習最基本的問候語和自我介紹，讓你在旅遊時能輕鬆開口說英文。',
  '', '10 分鐘',
  '["問候陌生人", "自我介紹", "詢問對方名字"]',
  'Hello! My name is Sarah.
Nice to meet you!
Where are you from?
I''m from Taiwan.
How long are you staying?
I''m here for three days.
Do you have any recommendations?
You should definitely visit the night market!',
  '[{"en":"Nice to meet you!","zh":"很高興認識你！","tip":"第一次見面時使用"},{"en":"Where are you from?","zh":"你來自哪裡？","tip":"詢問對方的國籍或城市"},{"en":"How long are you staying?","zh":"你要待多久？","tip":"詢問旅遊行程長度"},{"en":"Do you have any recommendations?","zh":"你有什麼建議嗎？","tip":"向當地人詢問建議"}]',
  '[{"pattern":"I''m from + place","example":"I''m from Taipei.","zh":"我來自...（地點）"},{"pattern":"I''m here for + time","example":"I''m here for a week.","zh":"我在這裡待...（時間）"},{"pattern":"You should + verb","example":"You should try the hot springs!","zh":"你應該去...（建議）"}]',
  true, 1
),
(
  'beginner_directions',
  '旅遊英語：問路與指引',
  'Travel English: Asking for Directions',
  'beginner', '🗺️', 'from-emerald-500 to-green-600',
  '學習如何問路、看懂指引，讓你在陌生城市也能找到目的地。',
  '', '12 分鐘',
  '["詢問方向", "理解地點描述", "感謝對方幫助"]',
  'Excuse me, can you help me?
I''m looking for the train station.
Go straight ahead for two blocks.
Then turn left at the traffic light.
It''s on your right side.
How far is it from here?
It''s about a ten-minute walk.
Thank you so much!
You''re welcome. Have a nice day!',
  '[{"en":"Excuse me, can you help me?","zh":"打擾一下，你能幫我嗎？","tip":"開口問路的禮貌方式"},{"en":"I''m looking for the train station.","zh":"我在找火車站。","tip":"說明你要找的地方"},{"en":"How far is it from here?","zh":"從這裡有多遠？","tip":"詢問距離"},{"en":"It''s about a ten-minute walk.","zh":"大約走路十分鐘。","tip":"描述距離的常用說法"}]',
  '[{"pattern":"I''m looking for + noun","example":"I''m looking for a convenience store.","zh":"我在找...（地方）"},{"pattern":"Go straight / Turn left / Turn right","example":"Turn right at the corner.","zh":"直走 / 左轉 / 右轉"},{"pattern":"It''s about + time/distance + walk","example":"It''s about five minutes walk.","zh":"步行大約...（時間）"}]',
  true, 2
),
(
  'beginner_ordering',
  '旅遊英語：點餐與購物',
  'Travel English: Ordering & Shopping',
  'beginner', '🍜', 'from-amber-500 to-orange-500',
  '學習如何在餐廳點餐和在商店購物，不再比手畫腳！',
  '', '15 分鐘',
  '["在餐廳點餐", "詢問價格", "表達喜好"]',
  'Welcome! How many people?
Just two, please.
Can I see the menu?
What do you recommend?
I''d like the beef noodles, please.
Would you like anything to drink?
Just water, please.
How much is this?
That comes to two hundred dollars.
Can I pay by credit card?',
  '[{"en":"I''d like the beef noodles, please.","zh":"我想要牛肉麵，謝謝。","tip":"點餐的禮貌說法"},{"en":"What do you recommend?","zh":"你推薦什麼？","tip":"詢問推薦菜色"},{"en":"How much is this?","zh":"這個多少錢？","tip":"詢問價格最基本的句子"},{"en":"Can I pay by credit card?","zh":"我可以用信用卡付款嗎？","tip":"詢問付款方式"}]',
  '[{"pattern":"I''d like + noun, please","example":"I''d like a coffee, please.","zh":"我想要...（點餐/購物）"},{"pattern":"Can I + verb?","example":"Can I have the bill?","zh":"我可以...嗎？（請求）"},{"pattern":"How much is/are + noun?","example":"How much are these shoes?","zh":"...多少錢？（詢問價格）"}]',
  true, 3
)
ON CONFLICT (id) DO NOTHING;
