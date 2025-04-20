"use server"

import { RedisClientType } from "redis";
import crypto from 'crypto';
import { redisConnect } from "./redisConnect";


type BloomFilterType = {
    redisClient: RedisClientType;
    filterKey: string;
    size: number;
    numHashes: number;
    add: (value: string) => Promise<void>;
    exists: (value: string) => Promise<boolean>;
};


class RedisBloomFilter {
    redisClient: RedisClientType;
    filterKey: string;
    size: number;
    numHashes: number;

    constructor(redisClient: RedisClientType, filterKey: string, size: number, numHashes: number) {
        this.redisClient = redisClient;
        this.filterKey = filterKey;
        this.size = size;
        this.numHashes = numHashes;
    }

    generateHashes(value: string) {
        const hashes = [];
        const hash1 = parseInt(crypto.createHash("sha256").update(value).digest('hex'), 16);
        const hash2 = parseInt(crypto.createHash("md5").update(value).digest("hex"), 16);

        for (let i = 0; i < this.numHashes; i++) {
            hashes.push((hash1 + i + hash2) % this.size)
        }

        console.log(hashes)

        return hashes;
    }

    async add(value: string): Promise<void> {
        const hashes = this.generateHashes(value);
        try {
            for (const index of hashes) {
                await this.redisClient.setBit(this.filterKey, index, 1); 
            }
        } catch (error) {
            console.error(`Failed to add value '${value}' to the Bloom filter:`, error);
        }
    }

    async exists(value: string): Promise<boolean> {
        const hashes = this.generateHashes(value);
        try {
            for (const index of hashes) {
                const bit = await this.redisClient.getBit(this.filterKey, index);
                if (bit === 0) return false; 
            }
            return true;
        } catch (error) {
            console.error(`Failed to check value '${value}' in the Bloom filter:`, error);
            return false; 
        }
    }
}


let bloom: BloomFilterType

export const getBloom = async () => {
    if (!bloom) {
        const redisClient = await redisConnect();
        if (redisClient) {
            bloom = new RedisBloomFilter(redisClient, 'bloom_filter', 960000, 7);
        }
    }

    return bloom;
}

