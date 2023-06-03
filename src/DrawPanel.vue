<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { Message } from './interfaces/message'
import MessageItem from './Message.vue'
import { getMessagesCache, setMessagesCache } from './utils/storage'
import * as uuid from 'uuid'
import { ImagineAPI, UpscaleAPI } from './api/midjourney'

const contentWrap = ref<HTMLDivElement>()
const data = reactive<{
  messages: Message[],
  prompt: string
}>({
  prompt: '',
  messages: getMessagesCache() as Message[]
})

const onClickSend = () => {
  sendPrompt()
}

const onKeyDown = (event: Event) => {
  event.stopPropagation()
  event.preventDefault()
  sendPrompt()
}

const sendPrompt = () => {
  data.prompt = data.prompt.trim()
  if (!data.prompt) return
  const msgObj: Message = {
    prompt: data.prompt,
    createTime: Date.now(),
    uri: "",
    uuid: uuid.v1()
  }
  console.log(msgObj.uuid);

  data.messages.push(msgObj)
  data.prompt = ''
  createImagine(msgObj)
  scrollToBottom()
  setMessagesCache(data.messages)

}

const findOneAndUpdate = (uuid: string, msg: Partial<Message>) => {
  if (!uuid) {
    return
  }
  const index = data.messages.findIndex(item => item.uuid === uuid)
  if (index === -1) {
    return
  }
  const target: Message = data.messages[index]
  Object.keys(msg).forEach((key: string) => {
    const value = msg[key as keyof Message]
    target[key] = value
  })
}

const createImagine = (msg: Message) => {
  const { uuid } = msg
  if (!uuid) return
  ImagineAPI(JSON.stringify({ prompt: msg.prompt }), (resData) => {
    findOneAndUpdate(uuid, {
      ...resData,
      msgId: resData.id,
      msgHash: resData.hash
    })
    if (resData && resData.progress === 'done') {
      findOneAndUpdate(uuid, {
        done: true,
        msgId: resData.id,
        msgHash: resData.hash
      })
    }
  })
  setMessagesCache(data.messages)
}

const onUpscale = (msg: Message) => {
  const { index, msgId, msgHash, prompt } = msg
  console.log('upscale: ', msg)
  if (!msgHash || !msgId || !index || !prompt) {
    return
  }

  const id = uuid.v1()
  const newMsg: Message = {
    uuid: id,
    prompt,
    index,
    createTime: Date.now(),
    generateText: `生成第 ${index} 张图片（Upscale）`,
  }

  data.messages.push(newMsg)
  setMessagesCache(data.messages)
  scrollToBottom()

  UpscaleAPI({
    index,
    msgHash,
    msgId,
    prompt
  }, (resData) => {
    findOneAndUpdate(id, {
      ...resData,
      msgId: resData.id,
      msgHash: resData.hash
    })
    if (resData && resData.progress === 'done') {
      findOneAndUpdate(id, {
        done: true,
        msgId: resData.id,
        msgHash: resData.hash
      })
    }
    setMessagesCache(data.messages)
  })
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (contentWrap.value) {
      contentWrap.value.scrollTop = contentWrap.value.scrollHeight
    }
  })
}

onMounted(() => {
  scrollToBottom()
})

</script>

<template>
  <div class="h-full py-4">
    <div class="relative h-full max-w-[980px] m-auto bg-gray-600 text-white px-10 py-4 rounded-xl">
      <div id="contentWrap" ref="contentWrap" class="h-full pb-[120px] overflow-auto m-auto">
        <div class="border-b-2 border-purple-400" v-for="(item, index) in data.messages" :key="index">
          <MessageItem :message="item" @on-upscale="onUpscale" />
        </div>
      </div>
      <div class="absolute left-10 right-10 bottom-6 flex-row items-center justify-between px-2 py-2 bg-gray-100 border-gray-400 rounded-[4px]">
        <!-- 快捷/帮助区域 -->
        <div class="flex w-full pb-1 text-sm">
          <p class="underline text-orange-400 pr-1 cursor-pointer">垫图</p>
          <p class="underline text-orange-400 pr-1 cursor-pointer">帮我想一个</p>
          <p class="flex-1"></p>
          <p class="underline text-orange-400 pr-1 cursor-pointer">微信交流群</p>
          <p class="underline text-orange-400 cursor-pointer">使用说明</p>
        </div>
        <!-- 输入框 -->
        <div class="w-full bg-white flex items-center">
          <textarea 
            v-model="data.prompt"
            class="flex-1 px-4 py-2 rounded-[8px] outline-none text-sm text-gray-500" 
            autofocus 
            placeholder="输入图片描述，例如'可爱的橘黄色的猫咪, 迪士尼风格'、'海边，机器人，小女孩，吉卜力风格'等" 
            type="textarea"
            :rows="2"
            @keydown.enter.prevent.stop="onKeyDown"
          />
          <img @click="onClickSend" class="mx-4 w-[36px] h-[36px] cursor-pointer" src="/src/assets/send.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>