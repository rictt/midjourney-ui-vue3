<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useUser } from '@/hooks/use-user'
import { getUserInfo } from '@/api/user'

const { userInfo, isLogin } = useUser();

const props = defineProps({
  close: {
    type: Function
  }
})

const data = reactive({
  loading: false,
  times: 0
})

const onClickCancel = () => {
  props.close?.()
}

onMounted(() => {
  data.loading = true
  getUserInfo().then((res: any) => {
    data.times = res.times
  }).finally(() => {
    data.loading = false;
  })
})

</script>

<template>
  <div class="max-w-[600px] px-8 py-4 min-w-[420px] max-sm:min-w-[auto]" todayUsed="form.loading" v-loading="data.loading">
    <img class="block m-auto pb-4" src="/src/assets/coffee.png" alt="">
    <p class="py-1 pb-4 text-center text-orange-100 font-bold">你好，{{ userInfo.username }}</p>

    <div class="py-2 text-white">
      <div class="flex justify-between items-center">
        <div class="text-sm">剩余绘画次数：</div>
        <div class="flex-1 text-center text-orange-200 font-bold">{{ data.times }}</div>
      </div>
    </div>

    <div class="flex flex-col justify-center text-center pt-6 text-sm">
      <!-- <div class="px-4 py-2 cursor-pointer rounded text-gray bg-orange-500 hover:bg-orange-600 mb-4" @click="onClickSave">保存</div>
      <div class="px-4 py-2 cursor-pointer rounded text-gray border border-orange-500 text-orange-400" @click="onClickCancel">取消</div> -->
      <div class="px-4 py-2 cursor-pointer rounded text-gray border border-orange-500 text-orange-400"
        @click="onClickCancel">关闭</div>
    </div>
  </div>
</template>