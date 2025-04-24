export const arrayBufferToBase64 = (buffer:ArrayBuffer) : string => {
    const uint8Array = new Uint8Array(buffer);
    console.log(buffer)
    const binary = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
    const str = btoa(binary);
    return str;
};

export const base64ToArrayBuffer = (base64:string) : ArrayBuffer => {
    const binary = atob(base64); 
    const uint8Array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        uint8Array[i] = binary.charCodeAt(i);
    }
    return uint8Array.buffer; 
};