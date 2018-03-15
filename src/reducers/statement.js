import caseReducer from './caseReducer'

const myStateInfoData = {
  getStatementList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
}

function getStatementList(state, action) {
  console.log('action.response.pageInfo',action)
  return { ...state, getStatementList: action.response.pageInfo }
}


export default caseReducer(myStateInfoData, {
  GET_STATEMENT_LISTT_SUCCESS: getStatementList,
})
