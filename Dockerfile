FROM node:24.15.0

# 参考 https://www.prisma.io/docs/guides/frameworks/nextjs
# Next.jsアプリケーションの作成
WORKDIR /app
ARG APP_NAME
RUN npx create-next-app@latest ${APP_NAME} --typescript --eslint --tailwind --app
WORKDIR /app/${APP_NAME}

# 依存関係のインストール
RUN npm install
RUN npm install prisma tsx @types/pg --save-dev
RUN npm install @prisma/client @prisma/adapter-pg dotenv pg
RUN npm install ioredis

# Prisma初期化
RUN npx prisma init --output ../app/generated/prisma

# 各種実装・設定ファイルを置き換える
RUN rm -r app/ eslint.config.mjs next.config.ts postcss.config.mjs prisma.config.ts tsconfig.json
COPY app/ ./app/
COPY lib/ ./lib/
COPY prisma/ ./prisma/ 
COPY eslint.config.mjs next.config.ts postcss.config.mjs prisma.config.ts tsconfig.json ./

# Prismaクライアントの作成
RUN npx prisma generate

CMD ["npm", "run", "dev"]