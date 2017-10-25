import caseReducer from './caseReducer'

const projectReceiptClaim = {
  pageNo: 1,
  count: 0,
  result: [],
}

function getReceiptList(state, action) {
  return { ...state, ...{ projectReceiptClaim: action.response.pageInfo } }
}

export default caseReducer(projectReceiptClaim, {
  GET_PROJECT_RECEIPT_LIST_SUCCESS: getReceiptList,
})
