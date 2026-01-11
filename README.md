<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 貝戈戈會計系統 (Bigogo Accounting System)

員工出缺勤與獎金池管理系統 - Mario Edition 🎮

## 技術棧

- **前端框架**: React 19 + TypeScript
- **建置工具**: Vite 6
- **圖表庫**: Recharts
- **樣式**: Tailwind CSS (CDN)

## 本地開發

### 前置需求

- Node.js 18+ (建議 20.x)
- npm 或 yarn

### 安裝與啟動

```bash
# 1. 安裝依賴套件
npm install

# 2. 設定環境變數（如需使用 Gemini API）
# 建立 .env.local 檔案並設定：
# GEMINI_API_KEY=your_api_key_here

# 3. 啟動開發伺服器
npm run dev
```

開發伺服器將在 http://localhost:3000 啟動

### 可用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 建置生產版本 |
| `npm run preview` | 預覽生產版本 |
| `npm run type-check` | TypeScript 型別檢查 |

## 部署到 GitHub Pages

本專案已設定 GitHub Actions 自動部署：

### 設定步驟

1. **啟用 GitHub Pages**
   - 到 Repository → Settings → Pages
   - Source 選擇 "GitHub Actions"

2. **設定 Secrets（如需使用 Gemini API）**
   - 到 Repository → Settings → Secrets and variables → Actions
   - 新增 `GEMINI_API_KEY` secret

3. **推送到 main 分支**
   - 推送後會自動觸發部署
   - 可在 Actions 頁面查看部署狀態

### 部署網址

部署完成後，可在以下網址存取：
```
https://<your-username>.github.io/bigogo1/
```

## 專案結構

```
bigogo1/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 部署設定
├── components/
│   └── AttendanceRow.tsx   # 出缺勤列表元件
├── services/               # 服務層
├── App.tsx                 # 主應用程式
├── index.tsx               # React 進入點
├── index.html              # HTML 模板
├── types.ts                # TypeScript 型別定義
├── constants.ts            # 常數定義
├── vite.config.ts          # Vite 設定
├── tsconfig.json           # TypeScript 設定
├── package.json            # 專案設定與依賴
└── .gitignore              # Git 忽略檔案設定
```

## 授權

Private Project

---

*View in AI Studio: https://ai.studio/apps/drive/14T0y8ZaCbacFCrqUNUDqMr4BXJOq3tOV*
