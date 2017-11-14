import caseReducer from './caseReducer'

const reviewReceiptClaim = {
  getReviewReceiptList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  receiptClaimListRefresh: new Date().getTime(),
  receiptInfo: {
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
  // const x = { ...state, approveSubmitData: {} }
  // return x
  return { ...state, receiptClaimListRefresh: new Date().getTime() }
}
function returnReceiptClaim(state) {
  // console.log('action', action)
  // const x = { ...state, ...action.response.pageInfo }
  // return x
  return { ...state, receiptClaimListRefresh: new Date().getTime() }
}
function transferReceiptClaim(state) {
  // console.log('action', action)
  // const x = { ...state, ...action.response.pageInfo }
  // return x
  return { ...state, receiptClaimListRefresh: new Date().getTime() }
}

export default caseReducer(reviewReceiptClaim, {
  GET_REVIEW_RECEIPT_LIST_SUCCESS: getReviewReceiptList,
  APPROVE_REVIEW_RECEIPT_SUCCESS: approveSubmit,
  RETURN_REVIEW_RECEIPT_SUCCESS: returnReceiptClaim,
  TRANSFER_REVIEW_RECEIPT_SUCCESS: transferReceiptClaim,
})
