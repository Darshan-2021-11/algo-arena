import { currentId, generateId } from "./api/tokenStore";

export const generateHeader =async()=>{
    generateId()
    const headers = {
        "X-Request-Id":currentId
    }
    return headers;
}