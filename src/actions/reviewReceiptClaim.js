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
      url: '/arc/receiptclaim/review/approve',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['APPROVE_REVIEW_RECEIPT_SUCCESS'],
    },
  }
}
export function returnReceiptClaim(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/review/back',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['RETURN_REVIEW_RECEIPT_SUCCESS'],
    },
  }
}
export function transferReceiptClaim(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/review/sendAR',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['TRANSFER_REVIEW_RECEIPT_SUCCESS'],
    },
  }
}

