import { httpApi } from './../../http/reduxRequestMiddleware'

export function getReceiptAppList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptApplication/apply/search',
      options: {
        method: 'POST',
        body: queryParam,
        version: 'v0.0.1',
      },
      types: ['GET_RECEIPT_APP_LIST_SUCCESS', 'RECEIPT_LOADING_REQUEST'],
    },
  }
}

export function getReceiptDetail(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptApplication/apply/edit',
      options: {
        method: 'POST',
        body: queryParam,
        version: 'v0.0.1',
      },
      types: ['GET_RECEIPT_DETAIL_SUCCESS'],
    },
  }
}

export function receiptApplySave(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptApplication/apply/save',
      options: {
        method: 'POST',
        body: queryParam,
        version: 'v0.0.1',
      },
      types: ['RECEIPT_APPLY_SAVE_SUCCESS'],
    },
  }
}
