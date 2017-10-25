import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getReceiptList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/claim/search/project',
      types: ['GET_PROJECT_RECEIPT_LIST_SUCCESS'],
      options: queryParam,
    },
  }
}
