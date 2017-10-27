import caseReducer from './caseReducer'

const cbsTurnoverWholenessData = {
  pageNo: 1,
  count: 0,
  result: [],
  amountSum: [],
}

function getCBSTurnoverWholenessData(state, action) {
  return { ...state, ...{ cbsTurnoverWholenessConfirm: action.response.data } }
}

export default caseReducer(cbsTurnoverWholenessData, {
  GET_CBS_TURNOVER_WHOLENESS_CONFIRM_DATA__SUCCESS: getCBSTurnoverWholenessData,
})
