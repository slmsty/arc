import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getMyApplyList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/myTask',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_MYAPPLY_LIST_SUCCESS'],
    },
  }
}

export function approveSubmit(queryParam) {
  return {
    [httpApi]: {
      url: '／arc/workFlow/approve/agree',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['APPROVE_MYAPPLY_SUCCESS'],
    },
  }
}
export function approveReject(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/approve/reject',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['APPROVE_REJECT_MYAPPLY_SUCCESS'],
    },
  }
}
