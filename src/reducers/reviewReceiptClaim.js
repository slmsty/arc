import caseReducer from './caseReducer'

const reviewReceiptClaim = {
  getReviewReceiptList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  approveSubmitData: {
    resultMessage: '',
  },
}

function getReviewReceiptList(state, action) {
  // console.log('action', action)
  return { ...state, getReviewReceiptList: action.response.pageInfo }
}
function approveSubmit(state, action) {
  // console.log('action', action)
  const x = { ...state, approveSubmitData: action.response }
  return x
}

export default caseReducer(reviewReceiptClaim, {
  GET_REVIEW_RECEIPT_LIST_SUCCESS: getReviewReceiptList,
  APPROVE_REVIEW_RECEIPT_SUCCESS: approveSubmit,
})
