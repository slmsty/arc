import caseReducer from './caseReducer'
import { saveAs } from './../util/downFile'

const myStateInfoData = {
  getStatementList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getContractStatementList: {
    pageNo: 1,
    count: 0,
    result: [],
  }
}

function getStatementList(state, action) {
  return { ...state, getStatementList: action.response.pageInfo }
}
function getContractStatementList(state, action) {
  return { ...state, getContractStatementList: action.response.pageInfo }
}
function fileDown(state, action) {
  saveAs(action.files.blob, action.fileName)
  return {
    ...state
  }
}

export default caseReducer(myStateInfoData, {
  GET_STATEMENT_LISTT_SUCCESS: getStatementList,
  GET_CONTRACT_STATEMENT_LISTT_SUCCESS:getContractStatementList,
  GET_EXCEL_SUCCESS:fileDown,
})
