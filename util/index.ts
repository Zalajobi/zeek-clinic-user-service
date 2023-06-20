export const excludeKeys = (object:any, keys: string[]) => {
  for (let key of keys) {
    delete object[key]
  }

  return object
}
