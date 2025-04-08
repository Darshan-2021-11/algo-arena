export const generateCustomToken =async(userAgent:string | null) : Promise<string|undefined>=>{
    try {
        if(!userAgent){
            return ;
        }
        const timestamp = Date.now();
        const data = `${userAgent}-${timestamp}`;
        const hashBuffer = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(data));
        const hash = Array.from(new Uint16Array(hashBuffer))
        .map((b)=>b.toString(16).padStart(2,'0'))
        .join('');
        console.log(hash)
        return hash;
    } catch (error) {
        console.log(error)
    }
}