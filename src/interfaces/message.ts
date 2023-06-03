export interface Message {
  prompt: string
  uuid?: string
  done?: boolean
  uri?: string
  msgId?: string
  msgHash?: string
  index?: number
  status?: string
  createTime?: string | number
  // 生成描述，比如我是upscale第四张
  generateText?: string
}