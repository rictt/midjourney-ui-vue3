
const PREFIX_KEY = 'STORAGE_'

const getFullKey = (key: string) => {
  return PREFIX_KEY + key
}
export const storage = {
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
  },
  clear() {
    localStorage.clear()
  }
}

const MESSAGE_KEY = 'MESSAGES'
export const getMessagesCache = () => {
  return storage.get(MESSAGE_KEY) || []
}
export const setMessagesCache = (value: any) => {
  storage.set(MESSAGE_KEY, value)
}

export default storage
