これは以下を利用したプロジェクトであり、テンプレートとして利用することを想定しています。
Docker + React + Next.js + TypeScript + TailwindCSS + PostgreSQL(Prisma経由) + Redis

[Prisma公式ドキュメント](https://www.prisma.io/docs/guides/frameworks/nextjs)を参考に作成しました。
リンクの追加や、Redisによるキャッシュ(トップページのみ)など、若干の変更を加えています。

## 始め方

1. .env.exampleのファイル名を.envに変更してください
1. プロジェクトルートで以下を実行してください

    ```bash
    docker compose build
    docker compose up
    ```
1. 別のターミナルを開き、DBを初期化してください(2回目以降は不要)
    ```bash
    docker compose exec app bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```
1. Webブラウザで[localhost:3000](http://localhost:3000)を開いてください
