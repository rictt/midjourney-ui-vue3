import axios from 'axios'
import Toast from '../components/Toast/index'

// export const host = "http://localhost:8999";
export const host = "http://43.153.50.34:8999";

export const $http = axios.create({
  baseURL: host + '/api'
});

$http.interceptors.response.use(function onFulfilled(value) {
  if ([200, 201].includes(value.status)) {
    if (value.data && [200].includes(value.data.code)) {
      return value.data.data;
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