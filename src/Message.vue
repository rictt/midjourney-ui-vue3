<script setup lang="ts">
import { Message } from './interfaces/message';
import { copyString } from './utils/clipboard';
import Tag from './components/Tag.vue';

const props = defineProps({
  message: {
    type: Object as () => Message
  }
})

const emits = defineEmits(['on-upscale'])

const clickToCopy = (str: string) => {
  copyString(str)
}

const getTimeStr = (timestamp: number | string) => {
  return new Date(timestamp).toLocaleString()
}

const onClickUV = (index: number) => {
  emits('on-upscale', {
    ...props.message,
    index
  })
}
</script>

<template>
  <div class="flex max-w-[500px] py-4">
    <div class="w-[50px] h-[50px] mr-4 rounded-full bg-gray-300"></div>
    <div class="flex-col flex-1">
      <div v-if="message?.generateText">{{ message?.generateText }}</div>
      <div class="flex flex-row w-full items-start">
        <div class="flex-1 leading-relaxed font-bold break-all mr-1">{{ message?.prompt }}</div>
        <div @click.stop="clickToCopy(message?.prompt!)" class="text-sm px-2 py-1 border-orange-400 bg-orange-400 cursor-pointer text-white border rounded">复制咒语</div>
      </div>
      <div class="text-sm text-slate-300 pt-1">状态：{{ message?.done ? '已完成' : '进行中' }}</div>
      <div class="text-sm text-slate-300">时间：{{ message?.createTime ? getTimeStr(message?.createTime) : '2023/6/2 下午6:06:32' }}</div>
      <div v-if="!message?.uri" class="flex flex-col items-center mt-2 p-4 bg-[#999] w-[140px] h-[140px] rounded-lg justify-center">
        <!-- <img class="block w-[100px]" src="/src/assets/image.png" alt=""> -->
        <img class="block w-[50px]" src="/src/assets/image.png" alt="">
        <p class="pt-4 text-sm">正在排队生成中</p>
      </div>
      <div v-else class="flex-col w-full mt-2">
        <img class="block" :src="message.uri" alt="">
      </div>
      <!-- upscale area -->
      <div v-if="message?.done && !message.index">
        <Tag text="U1" @click="onClickUV(1)" />
        <Tag text="U2" @click="onClickUV(2)" />
        <Tag text="U3" @click="onClickUV(3)" />
        <Tag text="U4" @click="onClickUV(4)" />
      </div>
    </div>
  </div>
</template>