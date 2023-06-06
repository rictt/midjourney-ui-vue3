export interface Message {
  id: string
  prompt: string
  done?: boolean
  uri?: string
  msgId?: string
  msgHash?: string
  index?: number
  status?: number
  createTime?: string | number
  // 生成描述，比如我是upscale第四张
  generateText?: string
}

export enum MessageStatus {
  INIT = 10,
  START = 11,
  DONE = 12,
  TIMEOUT = 13,
}