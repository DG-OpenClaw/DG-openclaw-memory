# Security Review Operations

このリポジトリに最低限の継続セキュリティレビュー体制を入れた。

## 何が有効になったか

- GitHub Actions: `.github/workflows/security-review.yml`
  - push / pull_request / 手動実行で動作
  - 秘密情報パターン検知
  - `web-estimate-app` の `npm ci`
  - `npm run lint`
  - `npm run build`
  - `npm audit --omit=dev --audit-level=high`
- ローカル hooks: `.githooks/pre-commit`, `.githooks/pre-push`
- 共通スクリプト: `scripts/security-review.sh`

## ローカルで有効化する

```bash
bash scripts/setup-git-hooks.sh
```

## 運用ルール

- commit / push 前に secrets 混入を止める
- push / PR 時に GitHub 側でも再検査する
- `npm audit` は high 以上で失敗させる
- `0.0.0.0` bind はローカル用途に限定し、公開環境で使わない

## この構成の限界

- SAST 専用ツールや CodeQL まではまだ入れていない
- Discord への自動通知は未接続
- `npm audit` は既知脆弱性DB依存で、アプリ固有のロジック欠陥は別レビューが必要

## 次の強化候補

1. GitHub branch protection で workflow 必須化
2. CodeQL 追加
3. secret scanning 専用ツール追加（gitleaks / trufflehog）
4. Discord 通知連携
5. 定期ジョブで `openclaw security audit --deep` と更新状況の報告
