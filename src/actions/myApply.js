import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getMyApplyList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/myTask',
      options: {
        method: 'POST',
        body: queryParam,
        version: 'v0.0.1',
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
        version: 'v0.0.1',
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
        version: 'v0.0.1',
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
        version: 'v0.0.1',
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
        version: 'v0.0.1',
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
        version: 'v0.0.1',
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
        version: 'v0.0.1',
      },
      types: ['BILLSTATUSSENDERP_SUCCESS'],
    },
  }
}
export function cancelApply(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/cancelApply',
      options: {
        method: 'POST',
        body: queryParam,
        version: 'v0.0.1',
      },
      types: ['UNDOERP_SUCCESS'],
    },
  }
}

export function billApproveSave(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/workFlowEdit',
      options: {
        method: 'POST',
        body: queryParam,
        version: 'v0.0.1',
      },
      types: ['BILL_APPLY_SAVE_SUCCESS'],
    },
  }
}
/**
 * 我的申请列表
 * @param queryParam
 * @returns {{}}
 */
export function myApplyList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/myApply',
      options: {
        method: 'POST',
        body: queryParam,
        version: 'v0.0.1',
      },
      types: ['MY_APPLY_LIST_SUCCESS'],
    },
  }
}
