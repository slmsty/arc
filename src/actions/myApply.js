import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getMyApplyList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/review/search',
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
      url: '/arc/receiptclaim/review/approve',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['APPROVE_MYAPPLY_SUCCESS'],
    },
  }
}

