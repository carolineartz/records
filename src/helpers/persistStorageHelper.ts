/*
  This file exports helpers to enable type checks on data stored in localStorage.

  By creating typed serializers to wrap storage functions and only reading/writing to storage from
  these helpers we can assert that the parsed type is that with which we created the seralizer.

  example:
    To create a storage helper that stores and loads data of type `User` at the key `ca_user`

    export const UserStorage = createSerializer<User>("ca_user")

    As long as all storage manipulation is made from the imported variable `UserStorage`, we know
    that `UserStorage.load()` will return an object of type `User | null` because UserStorage.store(foo)
    will require `foo` to be of type `User`.
*/

type StorageSerializer<T> = {
  store: (obj: T) => Promise<void>
  load: () => Promise<T | null>
  remove: () => Promise<void>
  isStored: () => Promise<boolean>
}

export function createStorageSerializer<T>(key: string): StorageSerializer<T> {
  const storeFn = async (item: T) => localStorage.setItem(key, JSON.stringify(item))
  const removeFn = async () => localStorage.removeItem(key)
  const existsFn = async () => {
    const keys = Object.keys(localStorage)
    return keys.includes(key)
  }
  const loadFn = async () => {
    const result = localStorage.getItem(key)

    try {
      return result === null ? null : (JSON.parse(result) as T)
    } catch (e) {
      return null
    }
  }

  return {
    store: storeFn,
    load: loadFn,
    remove: removeFn,
    isStored: existsFn,
  }
}
