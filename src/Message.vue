<script setup lang="ts">
import { Message, MessageStatus } from './interfaces/message';
import { copyString } from './utils/clipboard';
import Tag from './components/Tag.vue';
import Image from './components/Image.vue';
import { useDebounceFn } from '@vueuse/core'
import { onMounted, ref, computed } from 'vue'
import Toast from './components/Toast';
import { useUser } from '@/hooks/use-user'

const { isLogin, userInfo } = useUser()
const imageRef = ref<any>()
const props = defineProps({
  message: {
    type: Object as () => Message
  }
})

const emits = defineEmits(['on-upscale'])

const clickToCopy = (str: string) => {
  copyString(str)
  Toast({
    value: "复制成功"
  })
}

const getTimeStr = (timestamp: number | string) => {
  return new Date(timestamp).toLocaleString()
}

const onClickUV = useDebounceFn((index: number) => {
  emits('on-upscale', {
    ...props.message,
    index
  })
})

const getMessageStatus = (status: number) => {
  switch (status) {
    case MessageStatus.INIT:
      return '排队中'
    case MessageStatus.START:
      return '绘制中'
    case MessageStatus.DONE:
      return '已完成'
    case MessageStatus.TIMEOUT:
      return '已超时'
    case MessageStatus.FAILED:
      return '服务错误'
    case MessageStatus.SENSITIVE:
      return '输入错误，敏感词汇'
    default:
      return '初始化'
  }
}

</script>

<template>
  <div class="flex max-w-[500px] py-4">
    <div class="w-[50px] h-[50px] mr-4 rounded-full bg-gray-300 max-sm:w-[35px] max-sm:h-[35px]"></div>
    <div class="flex-col flex-1">
      <div v-if="message?.index">升级第 {{ message?.index }} 张图片</div>
      <div class="flex flex-row w-full items-start" v-if="message.prompt">
        <div class="flex-1 leading-relaxed font-bold break-all mr-1">{{ message?.prompt }}</div>
        <div @click.stop="clickToCopy(message?.prompt!)" class="text-sm px-2 py-1 border-orange-400 bg-orange-400 cursor-pointer text-white border rounded">复制咒语</div>
      </div>
      <div class="text-sm text-slate-300 pt-1">状态：{{ getMessageStatus(message.status) }}</div>
      <div class="text-sm text-slate-300">时间：{{ message?.createTime ? getTimeStr(message?.createTime) : '2023/6/2 下午6:06:32' }}</div>

      <Image v-if="message.uri" ref="imageRef" loadText="排队生成中" :url="message.uri" />

      <!-- upscale area 升级区域 -->
      <div v-if="!isLogin && message?.status == MessageStatus.DONE && !message.index">
        <p class=" text-gray-400 text-sm leading-6">请登录进行Upscale升级</p>
      </div>
      <div v-else-if="isLogin && userInfo.username === message?.creator && message?.status == MessageStatus.DONE && !message.index">
        <Tag text="U1" @click="onClickUV(1)" />
        <Tag text="U2" @click="onClickUV(2)" />
        <Tag text="U3" @click="onClickUV(3)" />
        <Tag text="U4" @click="onClickUV(4)" />
      </div>
    </div>
  </div>
</template>