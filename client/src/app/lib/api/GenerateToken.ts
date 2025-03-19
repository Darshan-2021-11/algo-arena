export const generateCustomToken =async()=>{
    try {
        const userAgent = window.navigator.userAgent;
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

export const decodeCustomToken =async(hash:string)=>{
    try {
        const hasharray = hash.split("");
        
        // const userAgent = window.navigator.userAgent;
        // const timestamp = Date.now();
        // const data = `${userAgent}-${timestamp}`;
        // const hashBuffer = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(data));
        // console.log(hashBuffer)
        // const hash = Array.from(new Uint8Array(hashBuffer))
        // .map((b)=>b.toString(16).padStart(2,'0'))
        // .join('');
        return hash;
    } catch (error) {
        console.log(error)
    }
}