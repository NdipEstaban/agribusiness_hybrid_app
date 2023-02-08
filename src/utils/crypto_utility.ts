const CryptoJS = require('crypto-js');

const secretKey = "c7a55dabb23da71bfa0903cb697zf7r4";

export const encryptResponse = (response:any) => {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(response), secretKey).toString();
    return encrypted;
}


export const decryptRequest = (request:any) => {
    const bytes = CryptoJS.AES.decrypt(request, secretKey);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted;
}