import crypto from 'crypto';
import { PASSWORD_HASH_SECRET } from '../util/config';

class CryptoClient {
  private static instance: any;

  private constructor() {}

  static getInstance() {
    if (!CryptoClient.instance) {
      CryptoClient.instance = new CryptoClient();
    }

    return CryptoClient.instance;
  }

  generatePasswordHash(password: string) {
    return crypto
      .pbkdf2Sync(password, PASSWORD_HASH_SECRET, 1000, 64, 'sha512')
      .toString('hex');
  }

  validatePassword(reqPassword: string, comparePassword: string) {
    const generatedPasswordHash = crypto
      .pbkdf2Sync(reqPassword, PASSWORD_HASH_SECRET, 1000, 64, 'sha512')
      .toString('hex');

    return generatedPasswordHash === comparePassword;
  }
}

const cryptoClient = CryptoClient.getInstance();
export default cryptoClient;
