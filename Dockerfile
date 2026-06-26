FROM node:24.15.0

# プロジェクトを作成
ARG APP_NAME
WORKDIR /app/${APP_NAME}

# 依存関係のインストール
COPY package.json package-lock.json ./
RUN npm ci

# 設定ファイルを配置
COPY prisma/ ./prisma/ 
COPY eslint.config.mjs next.config.ts postcss.config.mjs prisma.config.ts tsconfig.json auth.ts proxy.ts ./

# Prismaクライアントの作成
RUN npx prisma generate

CMD ["npm", "run", "dev"]