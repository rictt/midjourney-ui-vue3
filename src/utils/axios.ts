import axios from 'axios'
import Toast from '../components/Toast/index'
import { tokenStorage, userStorage } from '@/utils/storage'
import { showLoginModal } from '@/utils/index';

// export const host = "http://localhost:8999";
// export const host = "/api";
export const host = "http://43.153.50.34:8999";

export const $http = axios.create({
  // baseURL: host + '/api'
  baseURL: host
});

$http.interceptors.request.use(function onFulfilled(config) {
  const token = tokenStorage.get()
  const user = userStorage.get()
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`
  }
  if (user) {
    config.headers["userNo"] = (user as any).id
    config.headers["username"] = (user as any).username
  }
  return config
})

$http.interceptors.response.use(function onFulfilled(value) {
  if ([200, 201].includes(value.status)) {
    if (value.data && [200].includes(value.data.code)) {
      return value.data.data;
    } else if ([401].includes(value.data.code)) {
      tokenStorage.remove()
      userStorage.remove()
      Toast({ value: "请先登录" })
      showLoginModal()
      return Promise.reject(value.data.message)
    }
    console.log(value.data.message)
    Toast({ value: value.data.message })
    return Promise.reject(value.data.message)
  }
  return value;
}, function onRejected(error) {
  console.log(error);
})


export default $http;