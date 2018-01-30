import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getManualEntryBankTurnoverList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/integrity/search',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_MANUAL_ENTRY_BANK_TURNOVER_DATA_SUCCESS'],
    },
  }
}

// eslint-disable-next-line import/prefer-default-export
export function confirmManualEntryBankTurnover(confirmList) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/manual/singleConfirm',
      options: {
        method: 'POST',
        body: confirmList,
      },
      types: ['CONFIRM_MANUAL_ENTRY_BANK_TURNOVER_EDIT_SUCCESS'],
    },
  }
}

// eslint-disable-next-line import/prefer-default-export
export function deleteManualEntryBankTurnover(deleteList) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/manual/singleDelete',
      options: {
        method: 'POST',
        body: deleteList,
      },
      types: ['DELETE_MANUAL_ENTRY_BANK_TURNOVER_EDIT_SUCCESS'],
    },
  }
}

// eslint-disable-next-line import/prefer-default-export
export function confirmBatchManualEntryBankTurnover(confirmList) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/manual/batchConfirm',
      options: {
        method: 'POST',
        body: confirmList,
      },
      types: ['CONFIRM_BATCH_MANUAL_ENTRY_BANK_TURNOVER_EDIT_SUCCESS'],
    },
  }
}

// eslint-disable-next-line import/prefer-default-export
export function deleteBatchManualEntryBankTurnover(deleteList) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/manual/batchDelete',
      options: {
        method: 'POST',
        body: deleteList,
      },
      types: ['DELETE_BATCH_MANUAL_ENTRY_BANK_TURNOVER_EDIT_SUCCESS'],
    },
  }
}

export function initEditData(receiptClaimId) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/item/info',
      options: {
        method: 'POST',
        body: { ids: [receiptClaimId] },
      },
      types: ['GET_SINGLE_MANUAL_RECEIPT_CLAIM_INFO_SUCCESS'],
    },
  }
}

export function deleteAttachment(receiptClaimId) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/deleteAttachment',
      options: {
        method: 'POST',
        body: { receiptClaimId },
      },
      types: ['DELETE_ATTACHMENT_RECEIPT_CLAIM_INFO_SUCCESS'],
    },
  }
}

export function fileDown(filePath, filename) {
  return {
    [httpApi]: {
      url: `/arc/file/download/${filePath}/${filename}`,
      options: {
        method: 'GET',
      },
      types: ['ATTACHMENT_DOWNLOAD_SUCCESS'],
      acceptType: 'blob',
    },
    fileName: filename,
  }
}
