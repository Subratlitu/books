"use strict";

const asyncRedis = require("async-redis");

class RedisClient {
    static async connect() {
        const client = asyncRedis.createClient({
            port: process.env.REDIS_PORT || "6379",
            host: process.env.REDIS_HOST || "localhost",
            password: process.env.REDIS_PASSWORD || ""
        });

        client.on("connect", () => {
            console.log("Connected to Redis...");
        });

        client.on("ready", () => {
            console.log("Redis client is ready...");
        });

        client.on("reconnecting", (params) => {
            console.log("Reconnecting to Redis...", params);
        });

        client.on("error", (err) => {
            console.error("Error connecting to Redis", err);
        });

        return client;
    }

    static async store(item, val, time) {
        const client = await this.connect();  
        await client.setex(item, time, val);
    }

    static async retrieve(item) {
        const client = await this.connect();  
        return await client.get(item);
    }
}

module.exports = RedisClient;
