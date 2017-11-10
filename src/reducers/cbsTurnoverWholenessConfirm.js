import caseReducer from './caseReducer'

const cbsTurnoverWholenessData = {
  cbsTurnoverWholenessList: {
    pageInfo: {
      pageNo: 1,
      count: 0,
      result: [],
    },
    amountTotals: [],
  },
  cbsTurnoverEditConfirmResult: new Date().getTime(),
  cbsTurnoverEditExceptResult: new Date().getTime(),
  initSingleReceiptResult: {},
}

function getCBSTurnoverWholenessData(state, action) {
  return { ...state, cbsTurnoverWholenessList: action.response }
}

function editConfirm(state) {
  return { ...state, cbsTurnoverEditConfirmResult: new Date().getTime() }
}

function editExcept(state) {
  return { ...state, cbsTurnoverEditExceptResult: new Date().getTime() }
}

function initEditData(state, action) {
  return { ...state, initSingleReceiptResult: action.response.data.length ? action.response.data[0] : {} }
}

export default caseReducer(cbsTurnoverWholenessData, {
  GET_CBS_TURNOVER_WHOLENESS_CONFIRM_DATA_SUCCESS: getCBSTurnoverWholenessData,
  CONFIRM_CBS_TURNOVER_EDIT_SUCCESS: editConfirm,
  EXCEPT_CBS_TURNOVER_EDIT_SUCCESS: editExcept,
  GET_SINGLE_CBS_RECEIPT_CLAIM_INFO_SUCCESS: initEditData,
})
