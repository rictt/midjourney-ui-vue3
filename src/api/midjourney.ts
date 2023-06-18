import { $http, host } from '../utils/axios'
interface IUpscaleAPI {
  prompt: string
  msgHash: string
  msgId: string
  index: number
  flags?: number
}

export const getMessagesAPI = (params?: any) => {
  return $http.get('/messages', {
    params
  })
}

export const createMessageAPI = (prompt: string) => {
  return $http.post('/mj/imagine', {
    prompt
  })
}

export const upscaleMessageAPI = (body: IUpscaleAPI) => {
  return $http.post('/mj/upscale', body)
}


const decoder = () => {
  const encoder = new TextEncoder();
  const data = [
    {
      uri: "https://cdn.discordapp.com/attachments/1113454381338210306/1113817653295976550/grid_0.webp",
      progress: "0%"
    },
    {
      id: '1113817853808885831',
      hash: '7369e1c1-fc43-40b3-bc84-b4a216a3c83a',
      progress: 'done',
      uri: 'https://cdn.discordapp.com/attachments/1113454381338210306/1113817853624328262/zzjoey_a_cute_girl_7369e1c1-fc43-40b3-bc84-b4a216a3c83a.png',
      content: '**a cute girl --seed 9214** - <@1069879298003042365> (fast)',
    },
  ]
  const responseData = []
  responseData.push(encoder.encode(JSON.stringify(data[0])))
  responseData.push(encoder.encode(JSON.stringify(data[1])))

  console.log(responseData)

  let d = new TextDecoder("utf-8").decode(responseData[1])
  console.log(d)
  console.log(JSON.parse(d))
}

type LoadingHandleData = {
  uri: string
  progress: string
  id?: string
  hash?: string
  content?: string
}
type LoadingHandle = (data: LoadingHandleData) => void;

const streamFetch = async (url: string, body: string, loadingHandler?: LoadingHandle) => {
  const response = await fetch(host + url, {
    method: "POST", headers: {
      "content-type": "application/json"
    }, body
  })

  const reader = response.body?.getReader();
  let buffer = "";
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      console.log("read value: ", value)
      if (done) {
        break;
      }
      const text = new TextDecoder("utf-8").decode(value);
      console.log("read text: ", text)
      buffer += text;

      try {
        const json = JSON.parse(text)
        loadingHandler && loadingHandler(json)
      } catch (error) {
        console.error("Error parsing JSON: ", error);
      }
    }
  } else {
    console.log("[Response body is null]")
  }
}

export const ImagineAPI = (body) => {
  return streamFetch("/api/imagine", body)
}


export const UpscaleAPI = (body: IUpscaleAPI, loadingHandler?: LoadingHandle) => {
  return streamFetch("/api/upscale", JSON.stringify(body), loadingHandler)
}
