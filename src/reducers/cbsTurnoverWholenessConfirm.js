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
  cbsTurnoverEditConfirmResult: [],
  cbsTurnoverEditExceptResult: [],
}

function getCBSTurnoverWholenessData(state, action) {
  return { ...state, cbsTurnoverWholenessList: action.response }
}

function editConfirm(state, action) {
  return { ...state, cbsTurnoverEditConfirmResult: action.response.list }
}

function editExcept(state, action) {
  return { ...state, cbsTurnoverEditExceptResult: action.response.data }
}

export default caseReducer(cbsTurnoverWholenessData, {
  GET_CBS_TURNOVER_WHOLENESS_CONFIRM_DATA__SUCCESS: getCBSTurnoverWholenessData,
  CONFIRM_CBS_TURNOVER_EDIT_SUCCESS: editConfirm,
  EXCEPT_CBS_TURNOVER_EDIT_SUCCESS: editExcept,
})
