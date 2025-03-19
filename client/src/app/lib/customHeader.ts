import { generateCustomToken } from "./api/GenerateToken";

export const generateHeader =async()=>{
     const token = await generateCustomToken();
    const headers = {
        "X-Request-Token":token
    }
    return headers;
}