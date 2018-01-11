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

