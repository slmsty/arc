import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getImportResultData(params) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/manual/importResultView',
      types: [params.status === 'success' ? 'GET_IMPORT_SUCCESS_RESULT_DATA_SUCCESS' : 'GET_IMPORT_FAILURE_RESULT_DATA_SUCCESS'],
      options: {
        method: 'POST',
        body: params,
      },
    },
  }
}

export function initData() {
  return {
    successResult: {
      pageNo: 1,
      count: 0,
      result: [],
    },
    failureResult: {
      pageNo: 1,
      count: 0,
      result: [],
    },
    type: 'INIT_IMPORT_DATA_SUCCESS',
  }
}

export function fileDown() {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/downFileTemp',
      options: {
        method: 'GET',
      },
      types: ['TEMPLATE_DOWNLOAD_SUCCESS'],
      acceptType: 'blob',
    },
  }
}

export function importErrorFileDownload(batchNo) {
  return {
    [httpApi]: {
      url: `/arc/receiptclaim/manual/exportFailure/${batchNo}`,
      options: {
        method: 'GET',
      },
      types: ['ERROR_FILE_DOWNLOAD_SUCCESS'],
      acceptType: 'blob',
    },
    fileName: `人工导入失败的收款流水${batchNo}.xlsx`,
  }
}
