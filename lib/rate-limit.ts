import redis from "./redis";

async function getCount(ip: string): Promise<number> {
    const key = ip;
    const value = await redis.get(key);
    const count = value ? parseInt(value) : 0;
    return count;
}

async function setCount(ip: string, count: number, windowsMs: number): Promise<"OK"> {
    const key = ip;
    const value = count;
    const option = "PX";
    const expireTime = windowsMs;
    const result = redis.set(key, value, option, expireTime);
    // console.log(result);
    return result;
}

type RateLimitResponse = {
    isOk: boolean,
    remaining: number,
};
export async function checkRateLimit(ip: string, limit: number, windowMs: number): Promise<RateLimitResponse> {
    const count = await getCount(ip);
    const newCount = Math.min(count + 1, limit);
    const hasRemainingCount = count < limit;
    if (hasRemainingCount) {
        await setCount(ip, newCount, windowMs);
    }
    const isOk = hasRemainingCount;
    const remaining = limit - newCount;
    return { isOk, remaining };
}