import caseReducer from './caseReducer'
import { saveAs } from '../util/downFile'

const resultData = {
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
}

const getImportSuccessResultData = (state, action) => ({
  ...state, successResult: action.response.data,
})

const getImportFailureResultData = (state, action) => ({
  ...state, failureResult: action.response.data,
})

const initData = (state, action) => ({
  ...state, failureResult: action.failureResult, successResult: action.successResult,
})

const fileDown = (state, action) => {
  saveAs(action.files.blob, '模板_人工录入银行流水.xlsx')
  return { ...state }
}

const importErrorFileDownload = (state, action) => {
  saveAs(action.files.blob, action.fileName)
  return { ...state }
}

export default caseReducer(resultData, {
  GET_IMPORT_SUCCESS_RESULT_DATA_SUCCESS: getImportSuccessResultData,
  GET_IMPORT_FAILURE_RESULT_DATA_SUCCESS: getImportFailureResultData,
  INIT_IMPORT_DATA_SUCCESS: initData,
  TEMPLATE_DOWNLOAD_SUCCESS: fileDown,
  ERROR_FILE_DOWNLOAD_SUCCESS: importErrorFileDownload,
})
