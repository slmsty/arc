import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getReceiptList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/claim/search/project',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_PROJECT_RECEIPT_LIST_SUCCESS'],
    },
  }
}

export function reject(receiptClaimIds) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/reject',
      options: {
        method: 'POST',
        body: {
          receiptClaimIds,
        },
      },
      types: ['PROJECT_RECEIPT_CLAIM_REJECT_SUCCESS'],
    },
  }
}

export function submitClaim(submitParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/project/submit',
      options: {
        method: 'POST',
        body: submitParam,
      },
      types: ['PROJECT_RECEIPT_CLAIM_SUBMIT_SUCCESS'],
    },
  }
}

export function getPhase(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/phase/search',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_PROJECT_RECEIPT_FUND_LIST_SUCCESS'],
    },
  }
}

export function openClaim(receiptInfo) {
  return {
    type: 'OPEN_PROJECT_CLAIM',
    receiptInfo,
  }
}

export function closeClaim() {
  return {
    type: 'CLOSE_PROJECT_CLAIM',
  }
}
