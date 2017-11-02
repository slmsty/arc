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

export default caseReducer(cbsTurnoverWholenessData, {
  GET_CBS_TURNOVER_WHOLENESS_CONFIRM_DATA_SUCCESS: getCBSTurnoverWholenessData,
  CONFIRM_CBS_TURNOVER_EDIT_SUCCESS: editConfirm,
  EXCEPT_CBS_TURNOVER_EDIT_SUCCESS: editExcept,
})
