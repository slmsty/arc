import caseReducer from './../caseReducer'


const receiptState = {
  receiptPage: [],
  loading: false,
  receiptDetail: {}
}

function receiptLoading(state) {
  return {
    ...state,
    loading: true,
  }
}

function getReceiptAppList(state, action) {
  return {
    ...state,
    receiptPage: action.response.data,
    loading: false,
  }
}

function getReceiptDetail(state, action) {
  const { comInfo, applicationContract, appLineItems } = action.response
  return {
    ...state,
    receiptDetail: {
      comInfo,
      applicationContract,
      appLineItems,
    }
  }
}

export default caseReducer(receiptState, {
  GET_RECEIPT_APP_LIST_SUCCESS: getReceiptAppList,
  RECEIPT_LOADING_REQUEST: receiptLoading,
  GET_RECEIPT_DETAIL_SUCCESS: getReceiptDetail,
})
