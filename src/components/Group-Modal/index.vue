<script setup lang="ts">
const props = defineProps({
  close: {
    type: Function
  }
})

const onClickCancel = () => {
  props.close?.()
}

</script>

<template> 
  <div class="max-w-[400px]">
    <img class="w-full" src="/src/assets/group.jpg" alt="">
  </div>
</template>