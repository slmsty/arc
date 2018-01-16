import caseReducer from './caseReducer'

const initState = {
  billCompany: [],
  billClient: [],
  billList: [],
}

function getBillCompany(state, action) {
  return {
    ...state,
    billCompany: action.response.data,
  }
}

function getBillClients(state, action) {
  return {
    ...state,
    billClient: action.response.data,
  }
}

function billApplySearch(state, action) {
  return {
    ...state,
    billList: action.response.data,
  }
}


export default caseReducer(initState, {
  GET_BILL_COMPANY_SUCCESS: getBillCompany,
  GET_BILL_CLIENTS_SUCCESS: getBillClients,
  BILL_APPLY_SEARCH_SUCCESS: billApplySearch,
})
