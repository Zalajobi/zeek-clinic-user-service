import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '../util/config';
import { JWTDataProperties } from '../types/index.types';

class JWTClient {
  private static instance: JWTClient;

  private constructor() {}

  static getInstance(): JWTClient {
    if (!JWTClient.instance) {
      JWTClient.instance = new JWTClient();
    }

    return JWTClient.instance;
  }

  // Verify JSON Token
  verifyJSONToken(token: string, isRefreshToken: boolean): JWTDataProperties {
    let jwtData: JWTDataProperties | null = null;

    jwt.verify(
      token,
      isRefreshToken ? JWT_REFRESH_TOKEN : JWT_ACCESS_TOKEN,
      (err: any, user: any) => {
        if (err) throw err;

        if (user) jwtData = user;
      }
    );

    return jwtData as unknown as JWTDataProperties;
  }

  // Generate JWT Access Token
  generateJWTAccessToken(data: JWTDataProperties) {
    const options: SignOptions = {
      // expiresIn: "15m",
      // expiresIn: "365d", // For Dev Purpose
      expiresIn: '1h', // For Dev Purpose
    };
    return jwt.sign(data, JWT_ACCESS_TOKEN, options);
  }

  // Generate JWT Refresh Token
  generateJWTRefreshToken = (data: JWTDataProperties) => {
    const options: SignOptions = {
      expiresIn: '1d',
    };

    return jwt.sign(data, JWT_REFRESH_TOKEN, options);
  };
}

const jwtClient = JWTClient.getInstance();
export default jwtClient;
