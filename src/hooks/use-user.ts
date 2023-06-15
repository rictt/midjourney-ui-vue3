import { userStorage, tokenStorage } from '@/utils/storage';
import { showLoginModal } from '@/utils/index'
import { ref } from 'vue';

export const useUser = () => {

  userStorage.addChangeListener((newUserValue) => {
    isLogin.value = !!newUserValue && !!tokenStorage.get()
  })

  const isLogin = ref(!!userStorage.get())

  const userLogout = () => {
    userStorage.remove()
    tokenStorage.remove()
    window.location.reload()
  }

  return {
    isLogin,
    showLoginModal,
    userLogout
  }
}