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
  <img v-if="trueUrl" v-lazy="trueUrl" class="my-1 w-[100%]" loading="lazy" alt="" @loadstart="onLoadStart" @error="onLoadError" @load="onLoad">
</template>