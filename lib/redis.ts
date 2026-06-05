import { Redis } from "ioredis";

const url = process.env.REDIS_URL as unknown as string;
const redis = new Redis(url);

export default redis;