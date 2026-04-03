# CityEnglish 城市英語學習平台

基於台東在地場景的情境式英語發音練習平台，結合 Google Speech-to-Text 提供即時語音評分。

## 專案結構

```
cityEnglish/
├── backend/          # Node.js + Express API 後端
├── frontend-web/     # Next.js 14 前端網頁
├── ai-models/        # AI 提示詞與模型設定
├── docs/             # API 文件與詞彙資料
└── Dockerfile        # 根目錄 Dockerfile（後端用）
```

## 技術架構

- **後端**：Node.js 18 + Express + PostgreSQL + Google Cloud Speech API
- **前端**：Next.js 14 (standalone) + React 18 + Tailwind CSS
- **部署**：Zeabur（後端 + 前端 + PostgreSQL）

## 本地開發

### 後端

```bash
cd backend
cp .env.example .env   # 填入環境變數
npm install
npm run dev            # 啟動於 http://localhost:3001
```

### 前端

```bash
cd frontend-web
npm install
npm run dev            # 啟動於 http://localhost:3000
```

### 資料庫初始化

```bash
cd backend
npm run migrate        # 執行 schema.sql
```

## 環境變數

### 後端必要變數

| 變數名稱 | 說明 |
|---------|------|
| `PORT` | 伺服器埠號（預設 3001）|
| `DATABASE_URL` | PostgreSQL 連線字串 |
| `GOOGLE_APPLICATION_CREDENTIALS` | Google Cloud 服務帳號 JSON 路徑 |
| `GOOGLE_CLOUD_PROJECT_ID` | GCP 專案 ID |
| `ALLOWED_ORIGINS` | 允許的 CORS 來源 |

### 前端必要變數

| 變數名稱 | 說明 |
|---------|------|
| `NEXT_PUBLIC_API_URL` | 後端 API URL |

## Zeabur 部署

1. 在 Zeabur 建立新專案
2. 新增 **PostgreSQL** 服務（資料庫）
3. 新增 **後端服務**：選擇 Git 倉庫，指定 `backend/` 目錄或使用根目錄 Dockerfile
4. 新增 **前端服務**：選擇 Git 倉庫，指定 `frontend-web/` 目錄
5. 設定各服務的環境變數

## API 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/health` | 健康檢查 |
| POST | `/api/evaluate-speech` | 語音評分 |
| GET | `/api/user-progress/:userId` | 使用者進度 |
