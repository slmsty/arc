import caseReducer from './caseReducer'

const contractChange = {
  contractChangeList: [],
}

function getContractChange(state, action) {
  return { ...state, contractChangeList: action.response.result }
}

export default caseReducer(contractChange, {
  GET_CONTRACT_CHANGE_LIST_SUCCESS: getContractChange,
})
