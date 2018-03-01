import { httpApi } from './../../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getBillStatusList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/application/invoice/status/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_BILLSTATUS_LIST_SUCCESS'],
    },
  }
}
export function getBillStatusDetail(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/application/invoice/detail/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_BILLSTATUS_DETAIL_LIST_SUCCESS'],
    },
  }
}
// 申请单合同信息
export function getBillStatusContractDetail(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/application/invoice/contract/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_BILLSTATUS_CONTRACT_LIST_SUCCESS'],
    },
  }
}
// 开票结果
export function getBillStatusBillResult(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/application/invoice/outcome/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_BILLSTATUS_RESULT_SUCCESS'],
    },
  }
}
// 撤销
export function cancelApprove(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/application/invoice/rollback',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['CANCEL_APPROVE_SUCCESS'],
    },
  }
}
// 作废
export function disableApprove(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/application/invoice/invalid',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['DISSABLE_APPROVE_SUCCESS'],
    },
  }
}
// 传送AR
export function sendAP(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/application/invoice/sendap',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['SEND_AP_SUCCESS'],
    },
  }
}
// 文件下载
export function fileDown(queryParam) {
  return {
    [httpApi]: {
      url: `/arc/file/download/${queryParam.objectId}/${queryParam.objectName}`,
      options: {
        method: 'GET',
      },
      acceptType: 'blob',
      types: ['FILE_DOWN_SUCCESS'],
    },
    fileName: queryParam.objectName,
  }
}

export function invoiceSendTax(applicationId) {
  return {
    [httpApi]: {
      url: `/arc/application/invoice/sendtax`,
      options: {
        method: 'POST',
        body: {
          applicationId: applicationId,
        },
      },
      types: ['INVOICE_SEND_TAX_SUCCESS'],
    },
  }
}

