# AWS SAA Quest

スマホ向けの **AWS SAA 学習ゲーム** たたき台です。

## いま入っているもの

- Expo / React Native ベース
- ダークテーマのホーム画面
- デイリーミッション表示
- AWS SAA 向けのミニクイズ 5問
- 結果画面
- 苦手分野を次の復習テーマとして出す MVP

## 今後伸ばせる方向

- 分野別ステージ（IAM村、VPC砂漠みたいなやつ）
- 経験値 / レベルアップ
- 連続学習 streak
- 間違えた問題だけ再出題
- 模試モード
- ローカル保存 / クラウド同期
- 問題データを JSON 分離

## 起動

```bash
cd apps/aws-saa-quest
npm install
npm run web
```

iPhone シミュレータや Expo Go を使うなら:

```bash
cd apps/aws-saa-quest
npm start
```

## ソースの取り方

この workspace を後で PC から引っこ抜くか、git / GitHub 経由で取得してください。
