import caseReducer from './caseReducer'

const projectReceiptClaim = {
  receiptClaimList: {
    pageNo: 1,
    pageSize: 10,
    count: 0,
    result: [],
  },
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
}

function getReceiptList(state, action) {
  return { ...state, receiptClaimList: action.response.pageInfo }
}

function getOrderList(state, action) {
  return { ...state, receiptClaimOrderList: action.response.pageInfo }
}

function openClaim(state, action) {
  return { ...state, receiptInfo: action.receiptInfo }
}

function rejectSuccess(state) {
  return { ...state, receiptClaimListRefresh: new Date().getTime() }
}

function submitSuccess(state) {
  return { ...state, receiptInfo: {}, receiptClaimListRefresh: new Date().getTime() }
}

function closeClaim(state) {
  return { ...state, receiptInfo: {} }
}

export default caseReducer(projectReceiptClaim, {
  GET_NO_PROJECT_RECEIPT_LIST_SUCCESS: getReceiptList,
  GET_NO_PROJECT_RECEIPT_ORDER_LIST_SUCCESS: getOrderList,
  NO_PROJECT_RECEIPT_CLAIM_SUBMIT_SUCCESS: submitSuccess,
  NO_PROJECT_RECEIPT_CLAIM_REJECT_SUCCESS: rejectSuccess,
  OPEN_NO_PROJECT_CLAIM: openClaim,
  CLOSE_NO_PROJECT_CLAIM: closeClaim,
})
