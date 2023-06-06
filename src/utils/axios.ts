import axios from 'axios'

// export const host = "http://localhost:8999";
export const host = "http://43.153.50.34:8999";

export const $http = axios.create({
  baseURL: host + '/api'
});

$http.interceptors.response.use(function onFulfilled(value) {
  if ([200, 201].includes(value.status)) {
    return value.data;
  }
  return value;
}, function onRejected(error) {
  console.log(error);
})


export default $http;