import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getContractList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/approveAgree',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_CONTRACT_LIST_SUCCESS'],
    },
  }
}

export function saveContractSplitInfo(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/approveAgree',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['SAVE_CONTRACTSPLITINFO_SUCCESS'],
    },
  }
}
export function approveReject(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/rejectToApply',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['APPROVE_REJECT_MYAPPLY_SUCCESS'],
    },
  }
}
