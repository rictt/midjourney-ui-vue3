<template>
  <div class="toast-box">
    <p class="toast-value" :style="{ background: background, color: color }">
      {{ value }}
    </p>
  </div>
</template>    
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Toast',
  props: {
    value: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 3000
    },
    background: {
      type: String,
      default: '#000'
    },
    color: {
      type: String,
      default: '#fff'
    }
  }
})
</script>
  
<style>
.toast-box {
  /* position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-value {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  max-width: 200px;
  background: rgb(8, 8, 8);
  padding: 10px 20px;
  border-radius: 6px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  animation: anim 0.5s;
}

@keyframes anim {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.toast-value.reomve {
  animation: reomve 0.5s;
}

@keyframes reomve {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}</style>
  