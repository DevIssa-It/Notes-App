/**
 * Encryption Manager
 * Encrypt sensitive notes
 */

class EncryptionManager {
  constructor() {
    this.algorithm = 'AES-GCM';
  }

  async generateKey(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return crypto.subtle.importKey(
      'raw',
      hash,
      { name: this.algorithm },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(text, password) {
    try {
      const key = await this.generateKey(password);
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await crypto.subtle.encrypt(
        { name: this.algorithm, iv },
        key,
        data
      );

      return {
        encrypted: this.arrayBufferToBase64(encrypted),
        iv: this.arrayBufferToBase64(iv),
      };
    } catch {
      throw new Error('Encryption failed');
    }
  }

  async decrypt(encryptedData, iv, password) {
    try {
      const key = await this.generateKey(password);
      const encrypted = this.base64ToArrayBuffer(encryptedData);
      const ivArray = this.base64ToArrayBuffer(iv);
      
      const decrypted = await crypto.subtle.decrypt(
        { name: this.algorithm, iv: ivArray },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch {
      throw new Error('Decryption failed - wrong password?');
    }
  }

  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.arrayBufferToBase64(hash);
  }
}

export default new EncryptionManager();
