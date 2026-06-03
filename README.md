これは以下を利用したプロジェクトであり、テンプレートとして利用することを想定しています。  
Docker + React + Next.js + TypeScript + TailwindCSS + PostgreSQL(Prisma経由) + Redis

[Prisma公式ドキュメント](https://www.prisma.io/docs/guides/frameworks/nextjs)を参考に作成しました。  
リンクの追加や、Redisによるキャッシュ(トップページのみ)など、若干の変更を加えています。

## 始め方

1. example.envをコピーし、.envを作成してください。
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

## VSCodeのCodeIntelliSense対応

プロジェクトルートで以下を実行すると、node_modulesやPrisma Clientが作成され、VS Codeでの依存関係を解決できます。

```bash
npm install
npx prisma generate
```

## DB操作

プロジェクトルートで以下を実行してください。
```bash
docker compose exec postgres psql -U postgres -d my_db
```

```sql
select * from "User";
select * from "Post";
```