import { $http } from '../utils/axios'
import { userStorage } from '@/utils/storage';

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

export const getUserInfo = () => {
  return $http.post('/user/' + userStorage.get().id)
}