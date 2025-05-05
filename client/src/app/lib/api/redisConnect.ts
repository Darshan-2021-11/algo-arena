import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;
const url = process.env.REDIS_URI;

export async function redisConnect(): Promise<RedisClientType | null> {
    if (!url) {
        throw new Error("Database connection failed: REDIS_URI is missing.");
    }
    if (client) {
        return client;
    }

    try {
        client = createClient({ url });

        client.once("error", (err) => {
            console.error("Redis error:", err);
        });

        await client.connect(); 
        return client;
    } catch (error) {
        console.error("Redis Connection Error:", error,url);
        client = null;
        throw error;
    }
}