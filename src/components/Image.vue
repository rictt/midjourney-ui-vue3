<script setup lang="ts">
import { reactive } from 'vue';

defineProps({
  url: {
    type: String
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
  <img v-if="url" v-lazy="url" class="my-1 w-[100%]" loading="lazy" alt="" @loadstart="onLoadStart" @error="onLoadError" @load="onLoad">
</template>