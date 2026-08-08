これはTODOを管理するアプリです。  
ログインユーザごとにTODOを管理します。  
DB初期化時に作成されるユーザでログイン(パスワードは「password」)するか、新規登録してから利用してください。

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

## 本番環境での実行

docker-compose.ymlの「本番用」と書いてある行のコメントアウトを外し、上記手順を実行してください。

## VSCode CodeIntelliSense対応

プロジェクトルートで以下を実行すると、node_modulesが作成され、VS Codeでの依存関係を解決できます。

```bash
npm install
```

## DB操作

- Prisma Studio
    1. プロジェクトルートで以下を実行してください。
        ```bash
        docker compose exec app npx prisma studio --port 5555 --browser none
        ```
    2. [http://localhost:5555](http://localhost:5555)を開く

- psqlコマンド
    1. プロジェクトルートで以下を実行してください。
        ```bash
        docker compose exec postgres psql -U postgres -d my_db
        ```

    2. 任意のSQLを発行してください。
        ```sql
        select * from "User";
        select * from "Post";
        ```

## 環境変数AUTH_SECRETの変更

1. Auth.jsをインストールしてください
    ```bash
    npm install
    ```

1. 以下を実行後、表示された文字列で.envのAUTH_SECRETを上書きしてください。
    ```bash
    npx auth secret
    ```
