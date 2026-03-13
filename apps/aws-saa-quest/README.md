# AWS SAA Quest

AWS Certified Solutions Architect - Associate (SAA) 向けの、
**学習ゲーム風スマホアプリ** のプロトタイプです。

## 現在のフェーズ

- Phase 1: Expo / React Native ひな形作成 ✅
- Phase 2: AWS学習クイズ MVP 実装 ✅
- Phase 3: ゲームっぽさの核を追加 ✅

## いま入っている要素

- ダークテーマのホーム画面
- デイリーミッション
- AWS SAA ミニクイズ
- EXP / レベル
- 連勝コンボ
- ハート制
- ボス戦っぽい最終問題
- 苦手分野を次の討伐対象として表示
- 結果画面とバトルログ

## 次の伸びしろ

- 問題数を 50〜100 問以上に増やす
- 分野別ステージ
- 保存機能（ローカルストレージ）
- streak / ログイン報酬
- 復習専用モード
- 本物の模試モード
- 図解つき解説

## 起動

```bash
cd apps/aws-saa-quest
npm install
npm start
```

Web で見る場合:

```bash
cd apps/aws-saa-quest
npm run web
```

## 補足

web 用依存 (`react-dom`, `react-native-web`) は導入済みです。

## ソース取得

この workspace から持ち出すか、あとで GitHub に push して clone してください。
