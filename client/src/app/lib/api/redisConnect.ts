import {createClient, RedisClientType} from 'redis';

let client : RedisClientType | null = null;
const url = process.env.REDIS_URI;

export async function redisConnect():Promise<RedisClientType|null|undefined>{
    if(!url){
        throw new Error("Database not reachable.")
    }
    if(client){
        return client;
    }
    try {
        client = createClient({
            url
        })
        
        client.on("error",(err)=>{
            console.log(err);
            return null;
        })
        
        await client.connect(); 
        return client;
    } catch (error) {
        console.log(error)
        throw error;
    }
      
}