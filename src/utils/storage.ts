
import { UserType, SettingsType } from '@/interfaces/global'

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


export type ListenerCallback = (newValue: any) => void;
class FactoryStorage<T> {
  name: string;
  storage: IStorage;
  listeners: ListenerCallback[]

  constructor(name) {
    this.name = name;
    this.storage = storage;
    this.listeners = []
  }
  
  get<T1>() : T & T1 {
    return this.storage.get(this.name)
  }
  set(value: any) {
    this.storage.set(this.name, value)
    this.listeners.forEach(listener => listener(value))
  }
  remove() {
    return this.storage.remove(this.name)
  }
  addChangeListener(listener: ListenerCallback) {
    this.listeners.push(listener)
  }
}

export const tokenStorage = new FactoryStorage('TTTOOOOKKKKKK')
export const userStorage = new FactoryStorage<UserType | null>('UUUUUSSSSEEERR')
export const settingsStorage = new FactoryStorage<SettingsType>('SETTINGS')
export const limitStorage = new FactoryStorage('LLLIMITTT')

export default storage
