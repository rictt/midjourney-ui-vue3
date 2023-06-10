import { set } from "@vueuse/core";
import { ISettings } from "../interfaces/global";
import { getSettings } from "./storage"

const prompts = [
  "A running dog, cute, cartoon style",
  "Giant cats, walking around the city, cyberpunk style",
  "Tiger in the Jungle, National Geographic Photography",
  "Peony painting, Chinese painting",
  "Shape city, science fiction, concept art",
  "A pixel game about astronaut life in space, art style, complex underwater world, isometric",
  "Black hair, black eyes, fair skin, attractive, pretty, young woman, ID photo, white background",
  "Zongzi, physical shooting",
  "A teenager in a light blue long-sleeved shirt with the front on the side",
  "One Piece Nami, Chinese style",
  "Sailor Moon",
  "Apocalyptic streets, dark clouds, sunshine, alien warships, realistic style",
  "Texture, tough guy, realistic style",
  "pokemon characters, white background, pixel art, minimal",
  "spaceship isometric, 3d, soft shadows, white background, soft lighting"
]

export const drawStyles = [
  { value: "", label: "无" },
  { value: "cartoon style", label: "卡通" },
  { value: "realistic style", label: "写实" },
  { value: "minimalism style", label: "极简" },
  { value: "classicism style", label: "古典" },
  { value: "pencil style", label: "铅笔" },
  { value: "pixel style", label: "像素" },
  { value: "digital style", label: "数码" },
  { value: "old altitude style", label: "旧版海拔" },
  { value: "cyberpunk style", label: "赛博朋克" },
]

export const getJointPrompt = (prompt: string) => {
  const settings = getSettings<ISettings>();
  let params = ''
  if (settings.currentStyle && prompt.indexOf('style') === -1) {
    params += `, ${settings.currentStyle} `
  }
  if (settings.seed && prompt.indexOf('--seed') === -1) {
    params += `--seed ${settings.seed} `
  }
  if (settings.widthRadio && settings.heightRadio && prompt.indexOf('--ar') === -1) {
    params += `--ar ${settings.widthRadio}:${settings.heightRadio} `
  }
  if (settings.model && prompt.indexOf('--v') === -1 && prompt.indexOf('--version') === -1) {
    params += `--v ${settings.model.replace('v', '')}`
  }
  return prompt + params
}

export const randomPrompt = () => {
  const length = prompts.length
  return prompts[Math.floor(Math.random() * length)]
}