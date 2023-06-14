import sha256 from 'crypto-js/sha256'

export const encrypt = (str: string) => {
  return sha256(str).toString()
}