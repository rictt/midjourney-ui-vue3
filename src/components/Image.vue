<script setup lang="ts">
import { computed, reactive } from 'vue';

const props = defineProps({
  url: {
    type: String,
    default: ""
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  loadText: {
    type: String,
    default: "加载中"
  },
  errorText: String,
})

const cdnHost = 'cdn.discordapp.com'
const cdnHost2 = 'midjourney.cdn.zhishuyun.com'
const trueUrl = computed(() => {
  if (props.url && props.url.indexOf(cdnHost) !== -1) {
    return props.url.replace(cdnHost, cdnHost2)
  }
  return props.url
})

const data = reactive({
  loading: false,
  loaded: false,
  loadError: false
})

const onLoadStart = (event: Event) => {
  console.log('load start: ', event)
  data.loading = true
}
const onLoadError = (event: Event) => {
  console.log('load eroor: ', event)
  data.loadError = true
}
const onLoad = () => {
  data.loading = false
  data.loaded = true
}
</script>

<template>
  <div class="relative w-full bg-gray-500 rounded my-2 h-0 pb-[100%]">
    <el-image style="position: absolute !important;" class="absolute w-[100%] h-[100%] object-contain" v-if="trueUrl"
      fit="contain" :src="trueUrl" lazy :preview-src-list="[trueUrl]" hide-on-click-modal>
      <template #placeholder>
        <div class="w-full h-full" v-loading="true" element-loading-text="正在加载图片"></div>
      </template>
      <template #error>
        <div class="w-full h-full flex items-center justify-center" v-loading="false" element-loading-text="加载失败">加载失败</div>
      </template>
    </el-image>
    <!-- <img v-if="trueUrl" v-lazy="trueUrl" class="absolute top-0 left-0 w-[100%] h-[100%] object-contain" loading="lazy" alt="" @loadstart="onLoadStart" @error="onLoadError" @load="onLoad"> -->
  </div>
</template>