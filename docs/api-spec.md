# CityEnglish API 規格書

**版本：** v1.0.0
**Base URL：** `http://localhost:3001` (開發) / `https://api.cityenglish.app` (正式)
**Content-Type：** `application/json`

---

## 認證

目前 v1 使用無狀態 API（無需認證）。使用者識別透過 `userId` 欄位傳入。
未來版本將加入 JWT Bearer Token。

---

## Endpoints

### 1. 健康檢查

```
GET /health
```

**Response 200**
```json
{
  "status": "ok",
  "timestamp": "2026-04-03T10:00:00.000Z"
}
```

---

### 2. 語音評估

```
POST /api/evaluate-speech
```

評估使用者的英文口說發音，回傳辨識結果與逐字信心分數。

**Request Body**

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `audioBase64` | string | ✅ | Base64 編碼的音訊資料 |
| `encoding` | string | ❌ | 音訊格式（預設 `WEBM_OPUS`）。可選：`LINEAR16`, `FLAC`, `MP3`, `OGG_OPUS` |
| `sampleRateHertz` | number | ❌ | 取樣率（預設 `48000`）|
| `targetPhrase` | string | ✅ | 目標發音短語，例如 `"Tiehua Music Village"` |
| `locationId` | string | ❌ | 景點 ID，例如 `"taitung_tiehua"` |
| `userId` | string | ❌ | 使用者 UUID（有值時會儲存練習記錄）|

**Request 範例**
```json
{
  "audioBase64": "UklGRiQAAABXQVZFZm10IBAAAA...",
  "encoding": "WEBM_OPUS",
  "sampleRateHertz": 48000,
  "targetPhrase": "Tiehua Music Village",
  "locationId": "taitung_tiehua",
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response 200**

| 欄位 | 類型 | 說明 |
|------|------|------|
| `transcript` | string | STT 辨識出的文字 |
| `confidence` | number | 整體信心分數（0–1）|
| `wordConfidence` | array | 逐字信心分數 |
| `wordConfidence[].word` | string | 單字 |
| `wordConfidence[].confidence` | number | 該單字信心分數（0–1）|
| `missedWords` | array | 信心分數低於 0.6 或未辨識到的目標單字 |
| `score` | number | 綜合評分（0–100）|
| `sessionId` | string \| null | 練習記錄 UUID（僅在有 userId 時回傳）|

**Response 範例**
```json
{
  "transcript": "Tiehua Music Village",
  "confidence": 0.92,
  "wordConfidence": [
    { "word": "Tiehua", "confidence": 0.88 },
    { "word": "Music",  "confidence": 0.97 },
    { "word": "Village","confidence": 0.91 }
  ],
  "missedWords": [],
  "score": 90,
  "sessionId": "f7g8h9i0-j1k2-3456-lmno-pq7890123456"
}
```

**Error Responses**

| 狀態碼 | 說明 |
|--------|------|
| 400 | 請求參數驗證失敗 |
| 500 | 伺服器內部錯誤（含 Google STT 呼叫失敗）|

---

### 3. 使用者練習歷程

```
GET /api/user-progress/:userId
```

**Path Parameters**

| 參數 | 說明 |
|------|------|
| `userId` | 使用者 UUID |

**Response 200**
```json
{
  "sessions": [
    {
      "id": "...",
      "location_id": "taitung_tiehua",
      "name_en": "Tiehua Music Village",
      "target_phrase": "Tiehua Music Village",
      "transcript": "Tiehua Music Village",
      "score": 90,
      "created_at": "2026-04-03T10:00:00.000Z"
    }
  ],
  "wordProgress": [
    {
      "word": "village",
      "best_confidence": 0.91,
      "attempt_count": 5,
      "mastered": true,
      "last_practiced": "2026-04-03T10:00:00.000Z"
    }
  ]
}
```

---

## 評分演算法

```
avgWordConf  = average(wordConfidence[].confidence)
coverageRate = (targetWords.length - missedWords.length) / targetWords.length
score        = round((avgWordConf × 0.5 + coverageRate × 0.5) × 100)
```

- 單字信心分數 < 0.6 視為「發音錯誤」
- 單字信心分數 ≥ 0.85 標記為「已掌握（mastered）」

---

## 音訊格式建議

| 平台 | 建議格式 | 取樣率 |
|------|----------|--------|
| iOS (React Native) | `WEBM_OPUS` | 48000 Hz |
| Android | `WEBM_OPUS` | 48000 Hz |
| Web (MediaRecorder) | `WEBM_OPUS` | 48000 Hz |

---

## 景點 ID 對照表

| ID | 城市 | 中文名稱 | 英文名稱 |
|----|------|----------|----------|
| `taitung_tiehua` | 台東 | 鐵花村 | Tiehua Music Village |
| `taitung_forest` | 台東 | 台東森林公園 | Taitung Forest Park |
| `taitung_zhiben` | 台東 | 知本溫泉 | Zhiben Hot Springs |
| `taitung_green_island` | 台東 | 綠島 | Green Island |
| `taitung_sanxiantai` | 台東 | 三仙台 | Sanxiantai |
