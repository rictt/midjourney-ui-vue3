import { $http } from '../utils/axios'

interface IUser {
  username: string;
  password?: string;
  rePassword?: string;
}

export const registerUserAPI = (data: IUser) => {
  return $http.post('/user/register', data)
}

export const loginUserAPI = (data: IUser) => {
  return $http.post('/user/login', data)
}
