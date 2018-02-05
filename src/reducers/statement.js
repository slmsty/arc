import caseReducer from './caseReducer'

const myApplyInfoData = {
  getStatementList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getMyApplyInfo: {},
  getReturnEditInfo: {},
  myapplyListRefresh: new Date().getTime(),
  billSaveSuccess: false,
}

function getStatementList(state, action) {
  return { ...state, getStatementList: action.response.pageInfo }
}


export default caseReducer(myApplyInfoData, {
  GET_STATEMENT_LISTT_SUCCESS: getStatementList,
})
