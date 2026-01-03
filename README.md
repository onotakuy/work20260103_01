# 3D Map Viewer

2次元の地図の範囲を選択すると、その3次元マップを表示するWebアプリケーションです。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **2D地図**: OpenStreetMap (Leaflet)
- **3D表示**: Three.js (@react-three/fiber)
- **データベース**: Supabase
- **認証**: Better Auth
- **ストレージ**: Cloudflare R2
- **決済**: Polar

## 機能

- OpenStreetMapを使った2D地図表示
- ドラッグによる矩形範囲選択
- 選択範囲の3Dマップ表示（地形と建物モデル）
- ユーザーによる3Dデータのアップロード
- サンプルデータの提供

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 使い方

1. 2D地図が表示されます（初期位置：東京駅付近）
2. 地図上でマウスをドラッグして矩形範囲を選択します
3. マウスを離すと、選択した範囲の3Dマップが表示されます
4. 3Dマップでは、マウスで視点を回転・ズームできます
5. 「← 2D地図に戻る」ボタンで2D地図に戻れます

## サンプルデータ

プロジェクトには、東京駅付近のサンプルデータが含まれています：
- `data/sample-terrain.json`: 地形の標高データ
- `data/sample-buildings.json`: 建物の位置・サイズデータ

サンプルデータの範囲内（35.6800-35.6820, 139.7660-139.7680）で範囲を選択すると、サンプルデータが使用されます。

## 環境変数

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudflare R2
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_PUBLIC_URL=your_r2_public_url
```

**注意**: 認証と決済機能は、他の機能の動作確認ができてから実装する予定です。現在は、環境変数を設定しなくても基本的な機能（2D地図と3Dマップ表示）は動作します。

## プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── api/               # API ルート
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # メインページ
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── Map2D.tsx         # 2D地図コンポーネント
│   ├── Map3D.tsx         # 3Dマップコンポーネント
│   ├── Terrain.tsx       # 地形コンポーネント
│   └── Buildings.tsx     # 建物コンポーネント
├── lib/                   # ユーティリティ
│   ├── leaflet-fix.ts    # Leafletアイコン修正
│   ├── supabase.ts       # Supabaseクライアント
│   └── r2.ts             # Cloudflare R2クライアント
├── types/                 # TypeScript型定義
│   └── map.ts            # 地図関連の型
└── data/                  # サンプルデータ
    ├── sample-terrain.json
    └── sample-buildings.json
```

## 今後の実装予定

- [ ] ユーザー認証（Better Auth）
- [ ] 3Dデータのアップロード機能（Cloudflare R2）
- [ ] データの保存・読み込み（Supabase）
- [ ] 決済機能（Polar）
