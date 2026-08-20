#!/bin/bash

# UserテーブルのIDを取得するSQLを発行
result=$(echo "select id from \"User\";" | npx prisma db execute --stdin 2>&1)
# echo $result

# Userテーブルが存在する(SQLが正常終了した)場合、初期化済みとみなす
# (DBにまだ何もしていない状態を検出する意図)
echo $result | grep -q "Script executed successfully."
isDBInitialized=$?
# echo $isDBInitialized

if [ "$isDBInitialized" = 0 ]; then
    # DBが初期化済みの場合、何もしない
    echo "Database has already been initialized."
else
    # DBが初期化されていない場合、テーブル作成・初期データ投入
    echo "Database has not been initialized yet."
    npx prisma migrate dev --name init
    npx prisma db seed
fi

exec "$@"