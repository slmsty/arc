import caseReducer from './caseReducer'

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

export default caseReducer(myStateInfoData, {
  GET_STATEMENT_LISTT_SUCCESS: getStatementList,
  GET_CONTRACT_STATEMENT_LISTT_SUCCESS:getContractStatementList,
})
