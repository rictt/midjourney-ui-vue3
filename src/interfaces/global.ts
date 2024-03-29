export interface SettingsType {
  // 模型
  model?: string
  // 宽度比例
  widthRadio?: number
  // 高度比例
  heightRadio?: number
  // 种子
  seed?: number | string
  // 风格
  currentStyle?: string

  [key: string]: any
}

export interface UserType {
  username: string;
  id: number;
  status: number;
  times: number;
  createTime: Date;
}