/* eslint-disable max-len */
import caseReducer from './caseReducer'

const projectReceiptClaim = {
  receiptClaimList: {
    pageNo: 1,
    pageSize: 10,
    count: 0,
    result: [],
  },
  amountTotals: [],
  receiptClaimListRefresh: new Date().getTime(),
  receiptInfo: {
  },
  receiptClaimFundList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getPhaseCompleted: new Date().getTime(),
}

function getReceiptList(state, action) {
  return { ...state, receiptClaimList: action.response.pageInfo, amountTotals: action.response.amountTotals }
}

function getPhaseList(state, action) {
  return { ...state, receiptClaimFundList: action.response.pageInfo, getPhaseCompleted: new Date().getTime() }
}

function getReceiptInfo(state, action) {
  return { ...state, receiptInfo: action.response.data[0] }
}

function rejectSuccess(state) {
  return { ...state, receiptClaimListRefresh: new Date().getTime() }
}

function changeSuccess(state) {
  return { ...state, receiptClaimListRefresh: new Date().getTime() }
}

function submitSuccess(state) {
  return { ...state, receiptInfo: {}, receiptClaimListRefresh: new Date().getTime() }
}

function closeClaim(state) {
  return { ...state, receiptInfo: {} }
}

export default caseReducer(projectReceiptClaim, {
  GET_PROJECT_RECEIPT_LIST_SUCCESS: getReceiptList,
  GET_PROJECT_RECEIPT_FUND_LIST_SUCCESS: getPhaseList,
  GET_PROJECT_RECEIPT_INFO_SUCCESS: getReceiptInfo,
  PROJECT_RECEIPT_CLAIM_SUBMIT_SUCCESS: submitSuccess,
  PROJECT_RECEIPT_CLAIM_REJECT_SUCCESS: rejectSuccess,
  PROJECT_RECEIPT_CLAIM_CHANGE_SUCCESS: changeSuccess,
  CLOSE_PROJECT_CLAIM: closeClaim,
})
