<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: ""
  }
})
</script>

<template>
  <div class="inline-flex text-sm text-white bg-orange-400 rounded px-1 py-0.5 mr-1 mt-2 cursor-pointer">
    {{ text }}
  </div>
</template>