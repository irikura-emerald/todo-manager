import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import Link from "next/link";
import { User } from "./generated/prisma/client";

async function getUsers(): Promise<User[]> {
  const KEY = "users";
  const cache = await redis.get(KEY);
  if (cache) {
    // console.log("used redis cache");
    return JSON.parse(cache);
  } else {
    const users = await prisma.user.findMany();
    redis.set(KEY, JSON.stringify(users), "EX", 60 * 5);
    // console.log("used fresh data");
    return users;
  }
}

export default async function Home() {
  // const users = await prisma.user.findMany();
  const users = await getUsers();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        Superblog
      </h1>
      <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
          </li>
        ))}
      </ol>
      <Link href={'/posts'}>
        posts
      </Link>
    </div>
  );
}