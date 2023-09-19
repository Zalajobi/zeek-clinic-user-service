// const encryptionKey = process.env.ENCRYPTION_DATA_KEY as string;
// const algorithm = process.env.ENCRYPTION_ALGORITHM as string;
// const iv = Buffer.from('1234567890123456', 'utf8');

export const excludeKeys = (object: any, keys: string[]) => {
  for (let key of keys) {
    delete object[key];
  }

  return object;
};

// export const encryptString = (value: string):string => {
//   console.log(value)
//   // const key = createHash('sha256').update(encryptionKey, 'utf8').digest();
//   // const cipher = createCipheriv(algorithm, key, iv);
//   // let encrypted = cipher.update(value, 'utf8', 'base64')
//   // encrypted += cipher.final('base64')
//
//   const cipher = createCipher(algorithm, encryptionKey);
//   const encrypted = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
//
//   return encrypted
// };
//
//
// export const decryptString = (value:string):string => {
//   // const key = createHash('sha256').update(encryptionKey, 'utf8').digest();
//   // const decipher = createDecipheriv(algorithm, key, iv);
//   //
//   // let decrypted = decipher.update(value, 'base64', 'utf8');
//   // decrypted += decipher.final('utf8');
//
//   const decipher = createDecipher(algorithm, encryptionKey);
//   const decrypted = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
//
//   return decrypted;
// }
