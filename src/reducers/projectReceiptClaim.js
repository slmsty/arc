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
  receiptClaimFundList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
}

function getReceiptList(state, action) {
  return { ...state, receiptClaimList: action.response.pageInfo }
}

function getPhaseList(state, action) {
  return { ...state, receiptClaimFundList: action.response.pageInfo }
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
  GET_PROJECT_RECEIPT_LIST_SUCCESS: getReceiptList,
  GET_PROJECT_RECEIPT_FUND_LIST_SUCCESS: getPhaseList,
  PROJECT_RECEIPT_CLAIM_SUBMIT_SUCCESS: submitSuccess,
  PROJECT_RECEIPT_CLAIM_REJECT_SUCCESS: rejectSuccess,
  OPEN_PROJECT_CLAIM: openClaim,
  CLOSE_PROJECT_CLAIM: closeClaim,
})
