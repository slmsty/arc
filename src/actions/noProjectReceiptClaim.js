import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getReceiptList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/claim/search/other',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_NO_PROJECT_RECEIPT_LIST_SUCCESS'],
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
      types: ['NO_PROJECT_RECEIPT_CLAIM_REJECT_SUCCESS'],
    },
  }
}

export function changeClaimType(changeParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/changeClaimType',
      options: {
        method: 'POST',
        body: changeParam,
      },
      types: ['NO_PROJECT_RECEIPT_CLAIM_CHANGE_SUCCESS'],
    },
  }
}

export function submitClaim(submitParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/order/submit',
      options: {
        method: 'POST',
        body: submitParam,
      },
      types: ['NO_PROJECT_RECEIPT_CLAIM_SUBMIT_SUCCESS'],
    },
  }
}

export function getOrder(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/order/search',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_NO_PROJECT_RECEIPT_ORDER_LIST_SUCCESS'],
    },
  }
}

export function openClaim(receiptInfo) {
  return {
    type: 'OPEN_NO_PROJECT_CLAIM',
    receiptInfo,
  }
}

export function closeClaim() {
  return {
    type: 'CLOSE_NO_PROJECT_CLAIM',
  }
}
