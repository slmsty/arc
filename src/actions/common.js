import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getUserInfo() {
  return {
    [httpApi]: {
      url: '/sdm/getCurrentStaff',
      types: ['GET_USER_INFO_SUCCESS'],
      options: {},
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
