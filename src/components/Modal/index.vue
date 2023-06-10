<script setup lang="ts">
import { ref, watch, VNodeTypes } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  onClose: {
    type: Function,
    default: null
  },
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)

watch(visible, (value) => {
  emit('update:modelValue', value)
})

watch(() => props.modelValue,  (value) => {
  visible.value = value
})

const onManualClose = () => {
  visible.value = false
  props.onClose?.();
}

defineExpose({
  close: onManualClose
})

</script>

<template>
    <div v-if="visible" class="fixed top-0 left-0 right-0 bottom-0 z-[2000] w-full h-full flex items-center justify-center">
      <div class="fixed top-0 right-0 bottom-0 left-0 w-full h-full z-[2001] bg-black opacity-50"></div>
      <div class="max-sm:w-[90%] text-white bg-gray-500 px-3 p-2 rounded z-[2002]">
        <div v-if="title" class="flex py-2 flex-row justify-between">
          <div class="">{{ title }}</div>
          <div class="text-orange-500 cursor-pointer" @click.stop="onManualClose">x</div>
        </div>
        <div class="py-1">
          <slot />
        </div>
      </div>
    </div>
</template>