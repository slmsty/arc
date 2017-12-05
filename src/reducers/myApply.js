import caseReducer from './caseReducer'

const reviewReceiptClaim = {
  getMyApplyList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  myapplyListRefresh: new Date().getTime(),
}

function getMyApplyList(state, action) {
  return { ...state, getMyApplyList: action.response.pageInfo }
}
function approveSubmit(state) {
  // console.log('action', action)
  // const x = { ...state, approveSubmitData: {} }
  // return x
  return { ...state, myapplyListRefresh: new Date().getTime() }
}

export default caseReducer(reviewReceiptClaim, {
  GET_MYAPPLY_LIST_SUCCESS: getMyApplyList,
  APPROVE_MYAPPLY_SUCCESS: approveSubmit,
})
