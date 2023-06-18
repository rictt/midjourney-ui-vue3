<script setup lang="ts">
import { reactive, ref, onMounted, createVNode } from 'vue';
import { Message, MessageStatus } from './interfaces/message'
import MessageItem from './Message.vue'
import { getMessagesAPI, createMessageAPI, upscaleMessageAPI } from './api/midjourney'
import { createWebsocket } from './utils/websocket'
import { useDebounceFn, } from '@vueuse/core'
import Toast from './components/Toast/index'
import UseModal from './components/Use-Modal/index.vue'
import SettingsModal from './components/Settings-Modal/index.vue'
import { showModal } from './components/Modal';
import { drawStyles, randomPrompt, getJointPrompt } from './utils/index'
import { useLimitHook } from '@/hooks/use-limit-hook';
import { userStorage } from '@/utils/storage';
import { useUser } from '@/hooks/use-user'
import GroupModal from '@/components/Group-Modal/index.vue'
import UserModal from '@/components/User-Modal/index.vue'


const { isLogin, showLoginModal, userLogout } = useUser()
const showUseModal = () => {
  showModal(UseModal, {
    title: "使用说明"
  })
}

const showSettingsModal = () => {
  showModal(SettingsModal, {
    title: "设置",
    closeOnClickModal: true
  })
}

createWebsocket({
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
const data = reactive({
  prompt: '',
  messages: [],
  pageNum: 1,
  pageSize: 5,
  initLoading: true,
  loading: false,
  loaded: false,
  useModalVisible: false,
  styles: [...drawStyles],
  currentStyle: '',
  onlyCurrentUser: false
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

const onKeyDown = useDebounceFn((event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey || event.shiftKey) {
    return;
  }
  event.stopPropagation()
  event.preventDefault()
  sendPrompt()
})

const getList = (params: any) => {
  return new Promise((resolve, reject) => {
    if (data.loading || data.loaded) return
    getMessagesAPI(params).then((resData) => {
      data.messages = data.messages.concat(resData)

      data.loaded = !resData || !(resData as any).length
    }).finally(() => {
      data.loading = false
      data.initLoading = false
      resolve(undefined)
    })
  })
}

const sendPrompt = async () => {
  data.prompt = data.prompt.trim()
  if (!data.prompt) {
    Toast({
      value: '描述不能为空'
    })
    return
  }

  const { isExceedFreeTimesByDay, recordTimeUse } = useLimitHook()
  if (isExceedFreeTimesByDay()) {
    Toast({ value: "今日免费次数已用尽，请先登录" })
    setTimeout(() => {
      showLoginModal()
    }, 2000)
    return
  }
  if (data.prompt.length > 500) {
    return Toast({ value: "描述过长，最多500个字符，包括标点符号" })
  }
  const newPmt = getJointPrompt(data.prompt)
  const msgId = await createMessageAPI(newPmt) as any;
  console.log("msgId: ", msgId)
  const msgObj: Message = {
    prompt: newPmt,
    createTime: Date.now(),
    uri: "",
    id: msgId,
    status: MessageStatus.INIT
  }

  data.messages.unshift(msgObj)
  data.prompt = ''
  recordTimeUse()
  // scrollToBottom()
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
    msgId,
    flags: msg.flags || 0
  }) as any;
  console.log("newId: ", newId);
  const newMsg: Message = {
    id: newId,
    prompt,
    index,
    status: MessageStatus.INIT,
  }
  // data.messages.push(newMsg)
  data.messages.unshift(newMsg)
  scrollToBottom()
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (contentWrap.value) {
      // contentWrap.value.scrollTop = contentWrap.value.scrollHeight
    }
  })
}

const onContentWrapScroll = useDebounceFn((event: Event) => {
  if (data.loading || data.loaded) return
  const el = contentWrap.value
  if (el.scrollTop <= 100) {
    getList({ pageNum: ++data.pageNum, pageSize: data.pageSize })
  }
}, 500)

const helpThink = () => {
  const p = randomPrompt()
  data.prompt = p
}

const onlyForMe = () => {
  setTimeout(() => {
    const user = userStorage.get();
    const isForUser = data.onlyCurrentUser
    const queries: any = {
      pageNum: 1,
      pageSize: data.pageSize,
    }
    if (isForUser) {
      if (!user) {
        data.onlyCurrentUser = false;
        return showLoginModal()
      }
      if (user && user.username) {
        queries.username = user.username
      }
    }
    data.loaded = false
    data.initLoading = true;
    data.messages = []
    data.pageNum = 1
    getList(queries)
    data.loading = true
  })
}

const showGroupModal = () => {
  showModal(GroupModal, {
    closeOnClickModal: true,
    closeOnPressEscape: true
  })
}

const showUserModal = () => {
  showModal(UserModal, {
    closeOnClickModal: true,
    closeOnPressEscape: true
  })
}

onMounted(() => {
  getList({ pageNum: 1, pageSize: data.pageSize }).finally(() => {
    data.initLoading = false
    setTimeout(() => {
      contentWrap.value.addEventListener('scroll', onContentWrapScroll)
      scrollToBottom()
    }, 32)
  })

  return () => {
    contentWrap.value.removeEventListener('scroll', onContentWrapScroll)
  }
})

</script>

<template>
  <!-- <div class="h-full w-full max-sm:py-0 bg-gray-600" v-loading:[title]="true"> -->
  <div class="h-full w-full max-sm:py-0 bg-gray-600">
    <div
      class="relative h-full max-w-[980px] bg-gray-700 m-auto text-white px-10 py-4 sm:py-0 max-sm:py-2 max-sm:px-4 rounded-none">
      <div v-loading="data.initLoading" id="contentWrap" ref="contentWrap"
        class="h-[calc(100%-150px)]  overflow-auto m-auto flex flex-col-reverse">
        <div class="border-b-2 border-purple-400" v-for="(item, index) in data.messages" :key="item.id">
          <MessageItem :key="item.id" :message="item" @on-upscale="onUpscale" />
        </div>
      </div>
      <div
        class="absolute left-10 right-10 max-sm:left-2 max-sm:right-2 bottom-4 max-sm:bottom-2 flex-row items-center justify-between px-2 py-2 bg-gray-100 border-gray-400 rounded-[4px]">
        <!-- 快捷/帮助区域 -->
        <div class="flex w-full px-2 pb-2 pt-1 text-md select-none flex-wrap">
          <p class="underline text-orange-400 pr-4 cursor-pointer max-sm:text-sm max-sm:pr-1" @click.stop="helpThink">想一个
          </p>
          <p class="underline text-orange-400 pr-4 cursor-pointer max-sm:text-sm max-sm:pr-1"
            @click.stop="showSettingsModal">设置</p>
          <p class="underline text-orange-400 cursor-pointer max-sm:text-sm max-sm:pr-1" @click.stop="showUseModal">使用说明
          </p>
          <p class="underline text-orange-400 pr-4 ml-4 max-sm:text-sm max-sm:pr-1 max-sm:ml-1" @click.stop="onlyForMe">
            <input id="onlyMe" v-model="data.onlyCurrentUser" type="checkbox" class="cursor-pointer max-sm:pl-1">
            <label for="onlyMe" class="cursor-pointer">只看自己</label>
          </p>
          <p class="flex-1"></p>
          <p class="underline text-orange-400 pr-4 cursor-pointer max-sm:text-sm max-sm:pr-1" @click="showGroupModal">交流群
          </p>
          <p v-if="!isLogin" class="underline text-orange-400 pr-4 cursor-pointer font-bold max-sm:text-sm max-sm:pr-1"
            @click.stop="showLoginModal">我的</p>
          <p v-if="isLogin" class="underline text-orange-400 pr-4 cursor-pointer max-sm:text-sm max-sm:pr-1"
            @click.stop="showUserModal">我的</p>
        </div>
        <!-- 输入框 -->
        <div class="w-full bg-white flex items-center">
          <textarea v-model="data.prompt"
            class="flex-1 px-4 py-2 resize-none rounded-[8px] outline-none max-sm:text-sm text-md text-gray-500" autofocus
            placeholder="输入图片描述，例如'可爱的橘黄色的猫咪, 迪士尼风格'、'海边，机器人，小女孩，吉卜力风格'等" type="textarea" :rows="2"
            @keydown.enter.prevent.stop="onKeyDown" />
          <img @click="onClickSend" class="mx-4 w-[36px] h-[36px] cursor-pointer" src="/src/assets/send.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style>#contentWrap .el-loading-mask {
  background-color: transparent;
}</style>