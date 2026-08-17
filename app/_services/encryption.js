import CryptoJS from 'crypto-js';

const secretKey = 'SDJHFGSDJHFGSLKADGDSFG';

export const encrypt = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
    return encryptedData;
};

export const decrypt = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
};
