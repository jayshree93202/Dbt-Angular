import * as CryptoJS from 'crypto-js';

export class Aes256CbcEncryptDecrypt {



  // =========================
  // Base64 URL helpers
  // =========================
  private static base64UrlEncode(str: string): string {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private static base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return str;
  }

  // =========================
  // HMAC SHA256
  // =========================
  private static hmacSHA256(data: string, key: string): string {
    const hash = CryptoJS.HmacSHA256(
      data,
      CryptoJS.enc.Utf8.parse(key)
    );
    return hash.toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
      .toLowerCase();
  }

  // =========================
  // ENCRYPT (Same as Java)
  // =========================
  static encrypt(plainText: string, key: string): string {

    const keyBytes = CryptoJS.enc.Utf8.parse(key);

    // Java cipher.getIV() → random IV
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(
      plainText,
      keyBytes,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    // value (cipher text)
    const encryptedText = this.base64UrlEncode(
      encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    );

    // iv
    const ivBase64 = iv.toString(CryptoJS.enc.Base64);

    // MAC = HMAC(Base64(iv) + value)
    const mac = this.hmacSHA256(ivBase64 + encryptedText, key);

    const payload = {
      iv: ivBase64,
      value: encryptedText,
      mac: mac,
      ts: new Date().toISOString()
    };

    // Final Base64(JSON)
    return this.base64UrlEncode(
      btoa(JSON.stringify(payload))
    );
  }

  // =========================
  // DECRYPT (Same as Java)
  // =========================
  static decrypt(cipherText: string, key: string): string {

    const keyBytes = CryptoJS.enc.Utf8.parse(key);

    // Decode Base64 URL
    const decodedJson = atob(
      this.base64UrlDecode(cipherText)
    );

    const payload = JSON.parse(decodedJson);

    // IV
    const iv = CryptoJS.enc.Base64.parse(payload.iv);

    // Cipher text
    const encryptedWordArray = CryptoJS.enc.Base64.parse(
      this.base64UrlDecode(payload.value)
    );

    // Required for TypeScript
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedWordArray
    });

    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      keyBytes,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
