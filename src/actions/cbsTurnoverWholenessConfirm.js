import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getCBSTurnoverWholenessData(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/integrity/search',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_CBS_TURNOVER_WHOLENESS_CONFIRM_DATA_SUCCESS'],
    },
  }
}

// eslint-disable-next-line import/prefer-default-export
export function editConfirm(confirmList) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/cashier/confirm/cbs',
      options: {
        method: 'POST',
        body: confirmList,
      },
      types: ['CONFIRM_CBS_TURNOVER_EDIT_SUCCESS'],
    },
  }
}

// eslint-disable-next-line import/prefer-default-export
export function editExcept(exceptList) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/cashier/exclude/cbs',
      options: {
        method: 'POST',
        body: exceptList,
      },
      types: ['EXCEPT_CBS_TURNOVER_EDIT_SUCCESS'],
    },
  }
}

export function initEditData(receiptClaimId) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/item/info',
      options: {
        method: 'POST',
        body: {ids: [receiptClaimId]},
      },
      types: ['GET_SINGLE_CBS_RECEIPT_CLAIM_INFO_SUCCESS'],
    },
  }
}
