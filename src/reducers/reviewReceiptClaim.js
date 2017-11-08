import caseReducer from './caseReducer'

const reviewReceiptClaim = {
  getReviewReceiptList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  approveSubmitData: {
  },
}

function getReviewReceiptList(state, action) {
  // console.log('action', action)
  return { ...state, getReviewReceiptList: action.response.pageInfo }
}
function approveSubmit(state) {
  // console.log('action', action)
  const x = { ...state, approveSubmitData: {} }
  return x
}
function returnReceiptClaim(state, action) {
  // console.log('action', action)
  const x = { ...state, ...action.response.pageInfo }
  return x
}
function transferReceiptClaim(state, action) {
  // console.log('action', action)
  const x = { ...state, ...action.response.pageInfo }
  return x
}

export default caseReducer(reviewReceiptClaim, {
  GET_REVIEW_RECEIPT_LIST_SUCCESS: getReviewReceiptList,
  APPROVE_REVIEW_RECEIPT_SUCCESS: approveSubmit,
  RETURN_REVIEW_RECEIPT_SUCCESS: returnReceiptClaim,
  TRANSFER_REVIEW_RECEIPT_SUCCESS: transferReceiptClaim,
})
