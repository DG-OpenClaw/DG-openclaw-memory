# ホームページ制作 見積システム 開発仕様書

## 1. プロジェクト概要

### 1.1 システム名
ホームページ制作 見積システム（仮称: Web Estimate App）

### 1.2 目的
Web制作案件の概算見積・正式見積作成業務を効率化するため、ページ数・CMS・デザイン方式・オプション機能などの入力条件に応じて見積金額を自動算出し、保存・再編集・PDF出力できる管理画面付きWebアプリを構築する。

### 1.3 想定利用者
- 営業担当
- 制作ディレクター
- 管理者

### 1.4 開発方針
- まずは社内利用向けMVPを構築する
- 金額算出ロジックはマスタ管理可能な形で実装する
- 将来的に顧客向け見積フォームへ拡張可能な構造にする

---

## 2. 技術構成

### 2.1 採用技術
- フロントエンド: Next.js 16 / React / TypeScript
- UI: Tailwind CSS 4
- バックエンド: Next.js App Router Route Handlers
- DB / Auth: Supabase
- 帳票: HTMLベースの見積書表示 + 将来的にPDF出力
- デプロイ候補: Vercel

### 2.2 初期MVP対象
- ログイン（将来導入、MVP初期段階では仮実装可）
- 見積作成
- 自動金額計算
- 見積内訳表示
- 見積保存
- 見積一覧
- 見積詳細 / 複製
- 料金マスタ管理

---

## 3. 業務要件

### 3.1 対象案件
以下の制作案件を対象とする。
- コーポレートサイト
- ランディングページ（LP）
- 採用サイト
- サービスサイト
- ECサイト

### 3.2 金額算出の基本思想
見積金額は以下で構成する。

`合計 = 基本料金 + ページ制作費 + CMS関連費 + フォーム費 + オプション費 + 追加調整費 - 値引き + 税額`

### 3.3 想定する見積条件
- サイト種別
- デザイン方式
- CMS導入有無
- CMS種別
- CMS管理対象数
- ページ数（テンプレ/オリジナル）
- フォーム数
- フォーム追加機能数
- オプションの有無
- 短納期・高難度などの係数
- 値引き

---

## 4. 機能要件

## 4.1 見積作成機能
利用者が案件条件を入力し、リアルタイムで概算金額を確認できること。

### 入力項目
#### 基本情報
- 案件名
- 顧客名
- 担当者名
- サイト種別
- 納期メモ
- 備考

#### 制作条件
- デザイン方式（テンプレート / セミオーダー / フルオリジナル）
- レスポンシブ対応有無
- アニメーション有無
- SEO初期設定有無
- 原稿作成有無
- サーバー / ドメイン設定有無

#### ページ構成
- トップページ数
- 下層テンプレページ数
- 下層オリジナルページ数
- ブログ一覧テンプレート有無
- ブログ詳細テンプレート有無
- プライバシーポリシー等の共通ページ数

#### CMS設定
- CMS導入有無
- CMS種別（なし / WordPress / microCMS / Headless / その他）
- 投稿タイプ数
- 管理画面カスタマイズ有無

#### フォーム設定
- 問い合わせフォーム数
- 確認画面数
- 自動返信設定数
- ファイル添付対応数

#### 追加オプション
- 写真撮影
- 多言語対応
- 保守契約
- 予約機能
- 検索機能
- API連携

#### 値引き・税
- 値引き種別（固定額 / 率）
- 値引き値
- 税率

### 機能仕様
- 入力変更時に自動再計算すること
- 小計 / 税額 / 合計を表示すること
- 見積内訳をカテゴリ別に表示すること
- エラーメッセージを分かりやすく表示すること

---

## 4.2 見積保存機能
- 作成した見積を保存できること
- 保存後に再編集できること
- 複製して別案件に流用できること
- ステータス管理ができること
  - 下書き
  - 提案中
  - 成約
  - 失注

---

## 4.3 見積一覧機能
- 保存済み見積の一覧表示
- 案件名検索
- 顧客名検索
- ステータス絞り込み
- 作成日 / 更新日ソート

表示項目:
- 見積ID
- 案件名
- 顧客名
- サイト種別
- ステータス
- 合計金額
- 更新日

---

## 4.4 見積詳細機能
- 保存済み見積の詳細表示
- 入力条件確認
- 内訳確認
- 編集導線
- 複製導線
- 将来的なPDF出力導線

---

## 4.5 料金マスタ管理機能
料金マスタを管理者が変更できること。

### 管理対象カテゴリ
- 基本料金
- デザイン料金
- ページ単価
- CMS導入料金
- 投稿タイプ追加料金
- フォーム料金
- オプション料金
- 係数設定

### 要件
- マスタの一覧表示
- 単価の編集
- 有効 / 無効の切り替え
- 将来的に履歴保存可能な構成にする

---

## 5. 非機能要件

- デスクトップ表示を優先
- 入力に対する見積計算は1秒以内を目標
- 数千件規模の見積データ保存を想定
- マスタ更新でコード変更なしに価格調整可能な構成
- 主要画面はレスポンシブ対応
- TypeScriptで型安全を担保

---

## 6. 金額計算仕様

## 6.1 基本単価（初期値）
### サイト種別基本料金
- corporate: 150000円
- lp: 100000円
- recruit: 180000円
- service: 200000円
- ec: 300000円

### デザイン加算
- template: 0円
- semi_order: 80000円
- full_custom: 200000円

### ページ制作費
- top_page: 0円（基本料金込み）
- template_page: 10000円 / ページ
- custom_page: 20000円 / ページ
- blog_index_template: 20000円
- blog_detail_template: 30000円

### CMS関連費
- wordpress_base: 80000円
- microcms_base: 100000円
- headless_base: 120000円
- custom_post_type: 25000円 / 件
- admin_customization: 30000円

### フォーム関連費
- contact_form: 20000円 / 件
- form_confirm: 10000円 / 件
- auto_reply: 5000円 / 件
- file_upload: 10000円 / 件

### オプション費
- seo_setup: 20000円
- server_domain_setup: 30000円
- photo_shoot: 50000円
- maintenance: 30000円
- multilingual: 80000円 / 言語
- reservation: 80000円
- search_function: 50000円
- api_integration: 100000円
- copywriting: 15000円 / ページ
- animation: 30000円

## 6.2 計算ルール
1. サイト種別に応じた基本料金を加算
2. デザイン方式に応じた加算を適用
3. ページ数に応じてページ制作費を加算
4. CMS導入時のみCMS関連費を加算
5. フォーム関連項目の数量に応じて加算
6. オプション選択に応じて加算
7. 値引きを適用
8. 税率に応じて税額を算出

### 税計算式
- `taxAmount = max(subtotal - discountAmount, 0) * taxRate`
- `total = max(subtotal - discountAmount, 0) + taxAmount`

### 値引き計算式
- 固定額: 入力額そのまま
- 率: `subtotal * discountRate`
- 値引き後小計が0円未満にならないよう制御する

---

## 7. 画面仕様

## 7.1 ダッシュボード
### 表示内容
- 総見積件数
- 下書き件数
- 提案中件数
- 最近更新した見積一覧
- 「新規見積作成」導線

## 7.2 見積作成画面
### レイアウト
- 左: 入力フォーム
- 右: 見積サマリー / 内訳

### セクション
- 基本情報
- 制作条件
- ページ構成
- CMS設定
- フォーム設定
- オプション
- 値引き / 税

### アクション
- 保存
- 下書き保存
- 複製保存

## 7.3 見積一覧画面
- テーブル表示
- 検索フォーム
- ステータスフィルタ

## 7.4 見積詳細画面
- 入力条件サマリー
- 見積内訳
- 合計金額
- 編集 / 複製

## 7.5 料金マスタ画面
- カテゴリ別一覧
- 単価編集フォーム
- 有効状態切替

---

## 8. データ設計

## 8.1 estimates
- id: uuid
- estimate_number: string
- project_name: string
- client_name: string
- contact_person: string | null
- site_type: enum
- design_type: enum
- cms_type: enum
- status: enum
- note: text | null
- subtotal: integer
- discount_type: enum | null
- discount_value: numeric
- discount_amount: integer
- taxable_amount: integer
- tax_rate: numeric
- tax_amount: integer
- total_amount: integer
- created_by: uuid | null
- created_at: timestamp
- updated_at: timestamp

## 8.2 estimate_inputs
- id: uuid
- estimate_id: uuid
- top_page_count: integer
- template_page_count: integer
- custom_page_count: integer
- blog_index_count: integer
- blog_detail_count: integer
- cms_enabled: boolean
- cms_post_type_count: integer
- admin_customization: boolean
- contact_form_count: integer
- confirm_page_count: integer
- auto_reply_count: integer
- file_upload_count: integer
- seo_setup: boolean
- server_domain_setup: boolean
- photo_shoot: boolean
- maintenance: boolean
- multilingual_count: integer
- reservation: boolean
- search_function: boolean
- api_integration: boolean
- copywriting_page_count: integer
- animation: boolean
- raw_payload: jsonb

## 8.3 estimate_items
- id: uuid
- estimate_id: uuid
- category: string
- item_code: string
- item_name: string
- unit_price: integer
- quantity: integer
- amount: integer
- note: text | null
- sort_order: integer

## 8.4 pricing_master
- id: uuid
- category: string
- code: string
- label: string
- unit_price: integer
- unit_type: string
- is_active: boolean
- description: text | null
- updated_at: timestamp

---

## 9. API / サーバー処理設計（初期想定）

### GET /api/estimates
- 見積一覧を取得

### POST /api/estimates
- 見積作成
- 入力値から内訳と合計をサーバー側でも再計算して保存

### GET /api/estimates/:id
- 見積詳細を取得

### PUT /api/estimates/:id
- 見積更新

### POST /api/estimates/:id/duplicate
- 見積複製

### GET /api/pricing
- 料金マスタ取得

### PUT /api/pricing/:id
- 料金マスタ更新

---

## 10. バリデーション要件

- 案件名必須
- 顧客名必須
- サイト種別必須
- デザイン方式必須
- 数量項目は0以上の整数
- 値引き率は0〜100
- 税率は0〜1の範囲で管理（画面上は%表示可）
- CMS未導入時はCMS関連項目を0/falseで扱う

---

## 11. 権限要件

### 管理者
- 全見積の閲覧 / 編集
- 料金マスタ更新
- ステータス変更

### 営業担当
- 見積作成 / 編集
- 見積閲覧
- 値引き上限は将来的に制限可能な設計にする

---

## 12. MVP実装タスク

### Phase 1: 基盤
- Next.js初期セットアップ
- 共通レイアウト作成
- 型定義・定数定義
- ダミーデータ作成

### Phase 2: 見積UI
- 見積フォーム実装
- リアルタイム計算ロジック実装
- サマリー / 内訳表示

### Phase 3: 管理UI
- ダッシュボード
- 見積一覧
- 見積詳細
- 料金マスタ画面

### Phase 4: 永続化
- Supabaseスキーマ作成
- API接続
- 保存 / 更新 / 複製処理

### Phase 5: 帳票
- 見積書レイアウト
- PDF出力

---

## 13. 今回の実装スコープ
今回の初期実装では以下を含める。
- 仕様書作成
- Next.jsプロジェクト作成
- 画面モック作成
- 金額計算ロジックの実装
- ダミーデータベース前提での一覧 / 詳細 / マスタUI作成

Supabase接続と認証は次フェーズで追加する。
