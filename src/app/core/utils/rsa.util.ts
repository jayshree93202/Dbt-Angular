import { JSEncrypt } from 'jsencrypt';


export function rsaEncrypt(aesKey: string, publicKey: string): string {
  const encryptor = new JSEncrypt({
    default_key_size: '2048'
  });

  encryptor.setPublicKey(publicKey);

  const encrypted = encryptor.encrypt(aesKey);

  if (!encrypted) {
    throw new Error('RSA encryption failed');
  }

  return encrypted; 
}
