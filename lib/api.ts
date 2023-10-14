export const customPromiseRequest = async (requests: any[]) => {
  return await Promise.allSettled(requests);
};
