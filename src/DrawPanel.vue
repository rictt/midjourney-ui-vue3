<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { Message, MessageStatus } from './interfaces/message'
import MessageItem from './Message.vue'
import { getMessagesAPI, createMessageAPI, upscaleMessageAPI } from './api/midjourney'
import { sendMessage, createWebsocket } from './utils/websocket'

const ws = createWebsocket({
  onMessage(data) {
    // console.log('message event: ', event)
    console.log('message event: ', data)
  },
  onOnLine(data) {
    console.log('online data: ', data)
  },
  onTaskUpdate(data: Message) {
    console.log('taskupdate data: ', data)
    const { id } = data
    findOneAndUpdate(id, data)
    setTimeout(() => {
      scrollToBottom()
    }, 32)
  }
})
const contentWrap = ref<HTMLDivElement>()
const data = reactive<{
  messages: Message[],
  prompt: string,
  pageNum: number,
  pageSize: number,
  loading: boolean,
  loaded: boolean
}>({
  prompt: '',
  messages: [],
  pageNum: 1,
  pageSize: 5,
  loading: false,
  loaded: false
})

const findOneAndUpdate = (id: number, msgData: Partial<Message>) => {
  const index = data.messages.findIndex((e) => e.id === id)
  if (index > -1) {
    const target = data.messages[index]
    Object.keys(msgData).forEach((key) => {
      target[key] = msgData[key]
    })
  }
}

const onClickSend = () => {
  sendPrompt()
}

const onKeyDown = (event: Event) => {
  event.stopPropagation()
  event.preventDefault()
  sendPrompt()
}

const getList = (params: any) => {
  if (data.loading || data.loaded) return
  getMessagesAPI(params).then((resData) => {
    // data.messages = resData as any;
    ((resData || [] as any) as []).reverse();
    data.messages = [...resData as any, ...data.messages];
    data.loaded = !resData || !(resData as any).length
    scrollToBottom()
  }).finally(() => {
    data.loading = false
  })
}

const sendPrompt = async () => {
  data.prompt = data.prompt.trim()
  if (!data.prompt) return
  const msgId = await createMessageAPI(data.prompt) as any;
  console.log("msgId: ", msgId)
  const msgObj: Message = {
    prompt: data.prompt,
    createTime: Date.now(),
    uri: "",
    id: msgId,
    status: MessageStatus.INIT
  }
  
  data.messages.push(msgObj)
  data.prompt = ''
  scrollToBottom()
}

const onUpscale = async (msg: Message) => {
  const { index, msgId, msgHash, prompt } = msg
  console.log('upscale: ', msg)
  if (!msgHash || !msgId || !index || !prompt) {
    return console.log('upscale消息体不完整')
  }
 
  const newId = await upscaleMessageAPI({
    prompt,
    index,
    msgHash,
    msgId
  }) as any;
  console.log("newId: ", newId);
  const newMsg: Message = {
    id: newId,
    prompt: data.prompt,
    index,
    status: MessageStatus.INIT,
  }
  data.messages.push(newMsg)
  scrollToBottom()
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (contentWrap.value) {
      contentWrap.value.scrollTop = contentWrap.value.scrollHeight
    }
  })
}

const onContentWrapScroll = (event: Event) => {
  if (data.loading || data.loaded) return
  const el = contentWrap.value
  if (el.scrollTop <= 100) {
    getList({ pageNum: ++data.pageNum, pageSize: data.pageSize })
  }
}

onMounted(() => {
  getList({ pageNum: 1, pageSize: data.pageSize })
  scrollToBottom()
  setTimeout(() => {
    contentWrap.value.addEventListener('scroll', onContentWrapScroll)
  })

  return () => {
    contentWrap.value.removeEventListener('scroll', onContentWrapScroll)
  }
})

</script>

<template>
  <div class="h-full py-4 max-sm:py-0">
    <div class="relative h-full max-w-[980px] m-auto bg-gray-600 text-white px-10 py-4 rounded-lg sm:py-0 max-sm:py-2 max-sm:px-4">
      <div id="contentWrap" ref="contentWrap" class="h-full pb-[120px] overflow-auto m-auto">
        <div class="border-b-2 border-purple-400" v-for="(item, index) in data.messages" :key="index">
          <MessageItem :message="item" @on-upscale="onUpscale" />
        </div>
      </div>
      <div class="absolute left-10 right-10 max-sm:left-2 max-sm:right-2 bottom-4 max-sm:bottom-2 flex-row items-center justify-between px-2 py-2 bg-gray-100 border-gray-400 rounded-[4px]">
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