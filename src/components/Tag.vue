<script setup lang="ts">
import { computed } from 'vue';


enum SizeEnum {
  Normal = "normal",
  Small = "small",
  Medium = "medium",
  Large = "large"
}

enum TypeEnum {
  Plain = 'plain',
  Primary = 'primary'
}

const props = withDefaults(defineProps<{
  text?: String,
  type?: TypeEnum,
  size?: SizeEnum
}>(), {
  type: TypeEnum.Primary,
  size: SizeEnum.Normal
})

const sizeClass = computed(() => {
  if (props.size === SizeEnum.Medium) {
    return 'text-md px-1.5  py-0.75 mr-2'
  }
  if (props.size === SizeEnum.Large) {
    return 'text-lg px-2  py-1 mr-2'
  }
  if (props.size === SizeEnum.Small) {
    return 'text-sm px-1  py-0.5 mr-2'
  }
  return 'text-md px-1  py-0.5 mr-2'
})

const typeClass = computed(() => {
  if (props.type === TypeEnum.Plain) {
    return 'bg-transparent border-orange-400 border border-orange-500 text-orange-500'
  }
  return 'text-white bg-orange-400'
})

</script>

<template>
  <div :class="`inline-flex min-w-[50px] justify-center mb-2 text-center rounded border border-orange-400 cursor-pointer transition ${typeClass} ${sizeClass}`">
    <slot v-if="!text" />
    {{ text }}
  </div>
</template>