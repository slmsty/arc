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
