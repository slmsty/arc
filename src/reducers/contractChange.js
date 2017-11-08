import caseReducer from './caseReducer'

const contractChange = {
  contractChangeList: {
    pageNo: 1,
    pageSize: 10,
    count: 0,
    result: [],
  },
}

function getContractChange(state, action) {
  return { ...state, contractChangeList: action.response.pageInfo }
}

export default caseReducer(contractChange, {
  GET_CONTRACT_CHANGE_LIST_SUCCESS: getContractChange,
})
