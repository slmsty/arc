import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getUserInfo() {
  return {
    [httpApi]: {
      url: '/account/getCurrentAccount',
      types: ['GET_USER_INFO_SUCCESS'],
      options: {
        method: 'POST',
      },
    },
  }
}

export function getPermission() {
  return {
    [httpApi]: {
      url: '/arc/common/getFuncCode',
      types: ['GET_PERMISSION_SUCCESS'],
      options: {},
    },
  }
}
