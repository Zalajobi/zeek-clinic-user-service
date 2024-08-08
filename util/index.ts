export const isObjectEmpty = (obj: Record<string, any>): boolean => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const remapObjectKeys = (
  inputObject: Record<string, any>,
  fromKeys: string[],
  toKeys: string[] = fromKeys
): Record<string, any> => {
  const resultObject: Record<string, any> = {};

  if (fromKeys.length !== toKeys.length)
    throw new Error('FromKeys and ToKeys must have the same length');

  for (let i = 0; i < fromKeys.length; i++) {
    const fromKey = fromKeys[i];
    const toKey = toKeys[i];

    if (inputObject.hasOwnProperty(fromKey))
      resultObject[toKey] = inputObject[fromKey];
  }

  return resultObject;
};

// export const generateCode = (length: number = 12): string => {
//   let result = '';
//   const characters =
//     '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
//   const charactersLength = characters.length;
//   let counter = 0;
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     counter += 1;
//   }
//   return result;
// };

export const generateTemporaryPassCode = (length: number = 12): string => {
  let result = '';
  const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const extractPerPageAndPage = (endRow: number, startRow = 10) => {
  const perPage = endRow - startRow;
  const page = Math.ceil(startRow / perPage);

  return {
    page,
    perPage,
  };
};

export const getCookieDataByKey = (cookie: string, key: string): string => {
  const cookies = cookie.split(';').map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === key) {
      return decodeURIComponent(value);
    }
  }
  return '';
};
