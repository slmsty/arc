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
      url: '/arc/workFlow/approveAgree',
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
      url: '/arc/workFlow/rejectToApply',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['APPROVE_REJECT_MYAPPLY_SUCCESS'],
    },
  }
}
export function myApplyInfo(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/myTaskDetail',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['APPROVE_MYAPPLYINFO_SUCCESS'],
    },
  }
}
// bill ar 划销退回编辑确定方法
export function returnEditClim(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/badDebt/back',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['RETURNEDITCLIM_SUCCESS'],
    },
  }
}
// bill ar 划销退回编辑后传送erp方法
export function returnEditSendErp(badDebtIds) {
  return {
    [httpApi]: {
      url: '/arc/badDebt/sendERPBack',
      options: {
        method: 'POST',
        body: {badDebtIds},
      },
      types: ['RETURNEDITSENDERP_SUCCESS'],
    },
  }
}
export function BillStatusSendErp(badDebtIds, glDate) {
  return {
    [httpApi]: {
      url: '/arc/badDebt/sendERP',
      options: {
        method: 'POST',
        body: {badDebtIds, glDate},
      },
      types: ['BILLSTATUSSENDERP_SUCCESS'],
    },
  }
}
