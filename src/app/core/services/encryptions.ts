

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';
import { Aes256CbcEncryptDecrypt } from '../utils/crypto.util';
import { rsaEncrypt } from '../utils/rsa.util';

/** Shape returned by the bootstrap/key endpoint. */
interface PublicKeyEntry {
  publicKey: string;      // PEM-encoded RSA public key
}

interface PublicKeyResponse {
  status: string | boolean;
  message: string;
  keyDetails: PublicKeyEntry[];  
}

/** Shape of the encrypted login body sent to the server. */
export interface EncryptedLoginPayload {
  userid: string;         // AES-encrypted, Base64URL payload
  password: string;       // AES-encrypted, Base64URL payload
  clientKey: string;      // RSA-encrypted ClientAES, Base64URL
}

/** Endpoints that must never be encrypted / decrypted. */
const EXCLUDED_PATHS: RegExp[] = [
  /\/Register\/user-login$/i,            // login itself (we handle manually)
  /\/Officer\/login-officer$/i,          // officer login (we handle manually)
  /\/Register\/save-user$/i,             // registration (multipart/form-data)
  /\/get-public-key$/i,                  // RSA public key bootstrap
  /\/get-publickey$/i,                   // RSA public key (Officer endpoint)
  /\/key\/bootstrap$/i,                  // alternate key endpoint
  /\/(send-otp|verify-otp|check-user)$/i,  // pre-registration OTP flow (public)
  /\/captcha/i,                          // captcha endpoints
  /\/Master\//i,                         // all Master lookups are public

];

const SESSION_KEY_STORAGE = 'iswms_session_key_v1';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  decrypt(encryptedRoleId: string | undefined) {
    throw new Error('Method not implemented.');
  }

  
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  private sessionKey: string | null = null;

  private publicKey: string | null = null;

 
  generateAesKey(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const random = new Uint32Array(32);
    crypto.getRandomValues(random);
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars[random[i] % chars.length];
    }
    return key;
  }

  setSessionKey(keyBase64: string): void {
    this.sessionKey = keyBase64;
    try {
      sessionStorage.setItem(SESSION_KEY_STORAGE, keyBase64);
    } catch {
      // Private mode / storage disabled — the in-memory copy still serves this page load.
    }
  }

  clearSessionKey(): void {
    this.sessionKey = null;
    try {
      sessionStorage.removeItem(SESSION_KEY_STORAGE);
    } catch {
      // Ignore storage error
    }
  }

  private readStoredKey(): string | null {
    try {
      return sessionStorage.getItem(SESSION_KEY_STORAGE);
    } catch {
      return null;
    }
  }

  hasSessionKey(): boolean {
    return this.getSessionKey() !== null;
  }

  
  getSessionKey(): string | null {
    if (this.sessionKey === null) {
      this.sessionKey = this.readStoredKey();
    }
    return this.sessionKey;
  }

  
  async getPublicKey(): Promise<string> {debugger
    if (this.publicKey) return this.publicKey;

    const resp = await firstValueFrom(
      this.http.get<PublicKeyResponse>(
        `${this.baseUrl}/get-publickey`,
      ),
    );

    const entries = resp?.keyDetails;
    const pem = Array.isArray(entries) && entries.length > 0
      ? entries[0].publicKey
      : null;

    if (!pem) {
      throw new Error('Backend did not return an RSA public key.');
    }
    this.publicKey = pem;
    return pem;
  }



  async buildEncryptedLoginPayload(
    userName: string,
    password: string,
  ): Promise<EncryptedLoginPayload> {debugger
    const publicKey = await this.getPublicKey();

    const clientAesKey = this.generateAesKey();

    const [encryptedUserid, encryptedPassword, encryptedClientKey] = await Promise.all([
      Aes256CbcEncryptDecrypt.encrypt(userName.trim(), clientAesKey),
      Aes256CbcEncryptDecrypt.encrypt(password, clientAesKey),
      rsaEncrypt(clientAesKey, publicKey),
    ]);

    this.setSessionKey(clientAesKey);

    return {
      userid: encryptedUserid,
      password: encryptedPassword,
      clientKey: encryptedClientKey,
    };
  }


  async encryptField(value: string): Promise<string> {
    const key = this.requireSessionKey();
    return Aes256CbcEncryptDecrypt.encrypt(value, key);
  }

 
  async decryptField(value: string): Promise<string> {
    const key = this.requireSessionKey();
    return Aes256CbcEncryptDecrypt.decrypt(value, key);
  }

 
  isExcludedUrl(url: string): boolean {
    return EXCLUDED_PATHS.some((re) => re.test(url));
  }


  private requireSessionKey(): string {
    const key = this.getSessionKey();
    if (!key) {
      throw new Error(
        'EncryptionService: no session key — user may not be logged in.',
      );
    }
    return key;
  }
}