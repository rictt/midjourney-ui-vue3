
const PREFIX_KEY = 'STORAGE_'

const getFullKey = (key: string) => {
  return PREFIX_KEY + key
}

interface IStorage {
  get: (key: string) => any;
  set: (key: string, value: any) => any;
  remove: (key: string) => boolean;
  clear: () => void;
}

export const storage: IStorage = {
  get(key: string) {
    const _key = getFullKey(key)
    let value = localStorage.getItem(_key);
    if (!value) return ''
    try {
      value = JSON.parse(value)
    } catch (error) {
      console.log(error)
      return ''
    }
    return value
  },
  set(key: string, value: any) {
    const _key = getFullKey(key)
    return localStorage.setItem(_key, JSON.stringify(value));
  },
  remove(key: string) {
    const _key = getFullKey(key)
    localStorage.removeItem(_key)
    return true
  },
  clear() {
    localStorage.clear()
  }
}

class FactoryStorage<T> {
  name: string;
  storage: IStorage;

  constructor(name) {
    this.name = name;
    this.storage = storage;
  }
  
  get<T>() : T {
    return this.storage.get(this.name)
  }
  set(value: any) {
    return this.storage.set(this.name, value)
  }
  remove() {
    return this.storage.remove(this.name)
  }
  clear() {
    return this.storage.clear()
  }
}

export const tokenStorage = new FactoryStorage('TTTOOOOKKKKKK')
export const userStorage = new FactoryStorage('UUUUUSSSSEEERR')
export const settingsStorage = new FactoryStorage('SETTINGS')
export const limitStorage = new FactoryStorage('LLLIMITTT')

export default storage
