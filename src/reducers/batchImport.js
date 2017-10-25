import caseReducer from './caseReducer'

const resultData = {
  pageNo: 1,
  count: 0,
  result: [],
}

const getImportSuccessResultData = (state, action) => ({
  ...state, ...{ successResult: action.response.data },
})

const getImportFailureResultData = (state, action) => ({
  ...state, ...{ failureResult: action.response.data },
})

export default caseReducer(resultData, {
  GET_IMPORT_SUCCESS_RESULT_DATA_SUCCESS: getImportSuccessResultData,
  GET_IMPORT_FAILURE_RESULT_DATA_SUCCESS: getImportFailureResultData,
})
