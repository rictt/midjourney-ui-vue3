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
  <div class="">
    <img src="/src/assets/group.jpg" alt="">
  </div>
</template>