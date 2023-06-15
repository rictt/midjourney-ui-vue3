<script setup lang="ts">
import Toast from '../Toast';
import { reactive } from 'vue';
import { encrypt } from "../../utils/crypto"
import { useLoading } from '../Loading';
import { registerUserAPI, loginUserAPI } from '@/api/user'
import { tokenStorage, userStorage } from '@/utils/storage'

const vLoading = {
  ...useLoading()
}

const props = defineProps({
  close: {
    type: Function
  }
})

const FORM_TYPE = {
  LOGIN: 1,
  REGISTER: 2
}
const form = reactive({
  type: FORM_TYPE.LOGIN,
  username: 'joeytest',
  password: 'joeytest',
  rePassword: 'joeytest',
  loading: false
})

const goRegister = () => {
  form.type = FORM_TYPE.REGISTER
}
const goLogin = () => {
  form.type = FORM_TYPE.LOGIN
}

const onClickSave = () => {
  const ToastTip = (msg: string) => {
    Toast({ value: msg, duration: 3000 })
  }
  const { username, password, rePassword, type } = form
  const usernameRegex = /^[a-zA-Z0-9]+$/
  const passwordRegex = /^[a-zA-Z0-9.+-=?!@]+$/
  if (!username || username.length < 6 || username.length > 32 || !usernameRegex.test(username)) {
    return ToastTip("请设置合法的账号名称：仅限英文和数字组合，长度6-32位")
  }
  if (!password || password.length < 8 || password.length > 32 || !passwordRegex.test(password)) {
    return ToastTip("请设置合法的密码：仅限英文和数字和特殊字符.+-=?@!组合，长度8-32位")
  }
  if (type === FORM_TYPE.REGISTER && rePassword !== password) {
    return ToastTip("两次密码输入不相同")
  }

  const newForm = {
    username,
    password: encrypt(password)
  }

  const action = form.type === FORM_TYPE.LOGIN ? loginUserAPI : registerUserAPI
  form.loading = true
  action(newForm).then((res: any) => {
    console.log('res token: ', res)
    // tokenStorage.set(res.data)
    // userStorage.set(res.data)
    // onClickCancel()
    // Toast({ value: "登录成功", duration: 1500 })
    if (form.type === FORM_TYPE.REGISTER) {
      Toast({ value: "注册成功，请登录", duration: 1500 })
      form.password = ''
      form.rePassword = ''
      form.type = FORM_TYPE.LOGIN
    } else {
      Toast({ value: "登录成功", duration: 1500 })
      const { token, ...userInfo } = res
      tokenStorage.set(token)
      userStorage.set(userInfo)
      props.close?.()
    }
  }).finally(() => {
    form.loading = false
  })
}
const onClickCancel = () => {
  props.close?.()
}

</script>

<template>
  <div class="max-w-[600px] px-8 py-4 min-w-[420px]" v-loading="form.loading">
    <img class="block m-auto pb-4" src="/src/assets/coffee.png" alt="">
    <p class="py-1 pb-4 text-center text-orange-100 font-bold">欢迎使用</p>
    <div class="flex justify-between items-center py-2 text-sm mb-2" >
      <div class="pr-2 text-sm min-w-[80px]">账号：</div>
      <input v-model.trim="form.username" type="text" class="flex-1 outline-none rounded text-gray-500 px-3 py-1.5">
    </div>
    <div class="flex justify-between items-center py-2 text-sm">
      <div class="pr-2 text-sm min-w-[80px]">密码：</div>
      <input autocomplete="off" v-model.trim="form.password" type="password" style="-webkit-text-security: disc;" class="flex-1 outline-none rounded text-gray-500 px-3 py-1.5">
    </div>
    <div class="flex justify-between items-center py-2 text-sm mt-2" v-if="form.type === FORM_TYPE.REGISTER">
      <div class="pr-2 text-sm min-w-[80px]">输入密码：</div>
      <input autocomplete="off" v-model.trim="form.rePassword" type="password" class="flex-1 outline-none rounded text-gray-500 px-3 py-1.5">
    </div>

    <div class="flex justify-center py-2">
      <div v-if="form.type === FORM_TYPE.LOGIN" class="underline text-orange-400 text-sm cursor-pointer" @click="goRegister">没有账号？立即注册</div>
    </div>

    <div class="flex flex-col justify-center text-center py-4 text-sm">
      <div v-if="form.type === FORM_TYPE.LOGIN" class="px-4 py-2 cursor-pointer rounded text-gray bg-orange-500 hover:bg-orange-600 mb-4" @click="onClickSave">立即登录</div>
      <div v-if="form.type === FORM_TYPE.LOGIN" class="px-4 py-2 cursor-pointer rounded text-gray border border-orange-500 text-orange-400" @click="onClickCancel">取消</div>
      <div v-if="form.type === FORM_TYPE.REGISTER" class="px-4 py-2 cursor-pointer rounded text-gray bg-orange-500 hover:bg-orange-600 mb-4" @click="onClickSave">立即注册</div>
      <div v-if="form.type === FORM_TYPE.REGISTER" class="px-4 py-2 cursor-pointer rounded text-gray border border-orange-500 text-orange-400" @click="goLogin">返回登录</div>
    </div>
  </div>
</template>