# 開発者向けツール統合サイト

## プロジェクト概要
開発者が日常的に使用するツールを1つのサイトにまとめた統合ツールサイト。画像変換、SVG URLエンコード、CSS clamp計算機能を提供する。

## 技術スタック
- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **ビルドツール**: Vite
- **UI**: shadcn/ui + Tailwind CSS
- **状態管理**: React hooks + localStorage
- **デプロイ**: Vercel

## 開発環境要件
- Node.js: 最新LTS版
- パッケージマネージャー: npm
- エディタ: VS Code
- Git: GitHub (main/develop ブランチ戦略)

## コード品質設定
- ESLint: Next.js + TypeScript推奨設定
- Prettier: 標準設定 (セミコロン有り、シングルクォート、80文字改行)
- 型安全性: TypeScript strict mode

## 機能仕様

### 1. 画像変換機能 (PNG/JPG → WebP)
**パス**: `/components/ImageConverter`
- ドラッグ&ドロップ + ファイル選択対応
- 複数ファイル同時処理 (最大20ファイル)
- ファイルサイズ制限: 500MB/ファイル
- 品質プリセット: 高(90%)・中(75%)・低(50%)
- 変換後プレビュー表示
- エラーハンドリング: 非対応形式、サイズ超過

**技術要件**:
- Canvas API or WebAssembly for WebP conversion
- File API for drag & drop
- 品質設定をlocalStorageに保存

### 2. SVG URLエンコード機能
**パス**: `/components/SVGEncoder`
- 入力方式: ファイルアップロード + テキストエリア直接入力
- 出力: CSS background-image用 data URI
- コピーボタン付き
- リアルタイムプレビュー

**技術要件**:
- encodeURIComponent for URL encoding
- SVG validation
- CSS-safe character escaping

### 3. CSS clamp自動計算機能
**パス**: `/components/ClampCalculator`
- 入力項目:
  - Values min/max (数値)
  - Viewport min/max (px単位)
  - 単位選択: px, rem
- 出力形式: `clamp(1rem, 0.818rem + 0.91vw, 1.5rem)`
- コピーボタン付き
- 単位選択をlocalStorageに保存

**計算ロジック**:
```
slope = (max_value - min_value) / (max_viewport - min_viewport)
y_intercept = min_value - slope * min_viewport
clamp(min_value, y_intercept + slope * 100vw, max_value)
```

## UI/UX設計

### レイアウト構成
- **メインレイアウト**: タブ切り替え形式
- **レスポンシブ**: モバイルファーストデザイン
- **テーマ**: ダークモード/ライトモード対応
- **アクセシビリティ**: ARIA対応、キーボードナビゲーション

### タブ構成
1. 画像変換 (Image Converter)
2. SVG エンコード (SVG Encoder)  
3. CSS clamp計算 (Clamp Calculator)

## ディレクトリ構造
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── ImageConverter/
│   │   ├── index.tsx
│   │   ├── FileUpload.tsx
│   │   ├── QualitySelector.tsx
│   │   └── PreviewGrid.tsx
│   ├── SVGEncoder/
│   │   ├── index.tsx
│   │   ├── FileInput.tsx
│   │   ├── TextInput.tsx
│   │   └── Output.tsx
│   ├── ClampCalculator/
│   │   ├── index.tsx
│   │   ├── InputFields.tsx
│   │   ├── UnitSelector.tsx
│   │   └── Output.tsx
│   ├── TabNavigation.tsx
│   └── ThemeProvider.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useImageConverter.ts
│   ├── useSVGEncoder.ts
│   └── useClampCalculator.ts
├── lib/
│   ├── utils.ts
│   ├── imageConverter.ts
│   ├── svgEncoder.ts
│   └── clampCalculator.ts
└── types/
    └── index.ts
```

## データ永続化
**localStorage keys**:
- `image-quality-preset`: 画像品質設定
- `clamp-unit-preference`: clamp計算単位設定
- `theme-preference`: テーマ設定

## パフォーマンス要件
- 画像変換: Web Workers使用でメインスレッドブロック回避
- ファイル処理: プログレスバー表示
- レスポンシブ: 60fps維持
- 初期読み込み: 3秒以内

## 開発フロー
1. `develop`ブランチで開発
2. 機能単位でfeatureブランチ作成
3. PR作成時に自動テスト実行
4. `main`マージで本番デプロイ (Vercel)

## セキュリティ考慮事項
- ファイル処理: クライアントサイド完結
- XSS対策: SVG入力の適切なサニタイズ
- ファイルタイプ検証: MIME type + magic number
- サイズ制限: DoS攻撃防止

## 将来の拡張計画
- 新ツール追加のためのプラグイン設計
- ユーザー設定の拡張性
- 公開版でのアナリティクス対応
- PWA対応

## 開発優先順位
1. プロジェクトセットアップ (Next.js + shadcn/ui)
2. 基本レイアウト + タブナビゲーション
3. CSS clamp計算機能 (最もシンプル)
4. SVG URLエンコード機能
5. 画像変換機能 (最も複雑)
6. UI/UX改善 + アクセシビリティ対応