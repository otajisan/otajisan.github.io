# otajisan.github.io

otajisan の GitHub Pages 用リポジトリです。

GitHub のプロフィール（https://github.com/otajisan）に表示される README は、このリポジトリではなく [otajisan/otajisan](https://github.com/otajisan/otajisan) で管理しています。

## 公開しているページ

| パス | 内容 |
|---|---|
| [`/history/`](https://otajisan.github.io/history/) | 📜 自分と技術の歩み — これまでのリポジトリ、Qiita・Zenn の記事、connpass で運営してきた勉強会から、時期ごとに取り組んできた技術をまとめたページ |

## 構成

```
history/
├── index.html  # ページ本体（静的 HTML）
├── main.js     # テーマ切り替え・フェードイン・チャートのツールチップ
└── style.css
.githooks/      # otajisan 以外のコミット・push を止めるフック
```

ビルドは不要です。`main` ブランチに push すると、そのまま GitHub Pages に公開されます。
