<script setup lang="ts">
import Modal from '../Modal/index.vue'
import { reactive, ref, watch } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  }
})

const data = reactive({
  list: [
    "每个人最多同时有两个等待中的任务",
    // "AI只识别英文描述，系统会自动对中文进行翻译",
    "建议使用英文进行描述，效果会比较理想",
    "每个描述最多包含500个字符，包括标点符号",
    "请勿输入色情、暴力、政治等敏感词汇，一经发现永久禁止使用",
    "每天免费使用2次绘画次数，登录后送10次绘画次数"
  ]
})
</script>

<template>
  <div class="px-2 py-3 leading-6">
    <p v-for="(item, index) in data.list" :key="index">
      {{ index + 1 }}.{{ item }}
    </p>
  </div>
</template>