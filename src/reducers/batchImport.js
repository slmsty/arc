import caseReducer from './caseReducer'

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

export default caseReducer(resultData, {
  GET_IMPORT_SUCCESS_RESULT_DATA_SUCCESS: getImportSuccessResultData,
  GET_IMPORT_FAILURE_RESULT_DATA_SUCCESS: getImportFailureResultData,
  INIT_IMPORT_DATA_SUCCESS: initData,
})
