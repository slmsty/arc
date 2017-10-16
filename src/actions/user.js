import { httpApi } from '../http/reduxRequestMiddleware'

export function getUserInfo() {
  return {
    [httpApi]: {
      url: '/wenjuan/user/initInfo',
      types: ['GET_USER_INFO_SUCCESS'],
    },
  }
}
