import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getReviewReceiptList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/review/search',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_REVIEW_RECEIPT_LIST_SUCCESS'],
    },
  }
}

export function approveSubmit(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/review/search',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['APPROVE_REVIEW_RECEIPT_SUCCESS'],
    },
  }
}

