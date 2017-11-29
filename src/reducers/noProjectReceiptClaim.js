/* eslint-disable max-len */
import caseReducer from './caseReducer'

const noProjectReceiptClaim = {
  receiptClaimList: {
    pageNo: 1,
    pageSize: 10,
    count: 0,
    result: [],
  },
  amountTotals: [],
  receiptClaimListRefresh: new Date().getTime(),
  receiptInfo: {
    receiptClaimId: '',
    receiptAmount: 0,
    bankTransactionNo: '',
    receiptNo: '',
    payCustName: '',
  },
  receiptClaimOrderList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getOrderCompleted: new Date().getTime(),
}

function getReceiptList(state, action) {
  return { ...state, receiptClaimList: action.response.pageInfo, amountTotals: action.response.amountTotals }
}

function getOrderList(state, action) {
  return { ...state, receiptClaimOrderList: action.response.pageInfo, getOrderCompleted: new Date().getTime() }
}

function openClaim(state, action) {
  return { ...state, receiptInfo: action.receiptInfo }
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

export default caseReducer(noProjectReceiptClaim, {
  GET_NO_PROJECT_RECEIPT_LIST_SUCCESS: getReceiptList,
  GET_NO_PROJECT_RECEIPT_ORDER_LIST_SUCCESS: getOrderList,
  NO_PROJECT_RECEIPT_CLAIM_SUBMIT_SUCCESS: submitSuccess,
  NO_PROJECT_RECEIPT_CLAIM_REJECT_SUCCESS: rejectSuccess,
  NO_PROJECT_RECEIPT_CLAIM_CHANGE_SUCCESS: changeSuccess,
  OPEN_NO_PROJECT_CLAIM: openClaim,
  CLOSE_NO_PROJECT_CLAIM: closeClaim,
})
