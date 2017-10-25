import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getImportResultData(params) {
  return {
    [httpApi]: {
      url: 'v1.0.0/arc/receiptclaim/manual/importResultView',
      types: [params.status ? 'GET_IMPORT_SUCCESS_RESULT_DATA_SUCCESS' : 'GET_IMPORT_FAILURE_RESULT_DATA_SUCCESS'],
      options: params,
    },
  }
}
