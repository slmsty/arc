import caseReducer from './caseReducer'

const initState = {
  isLoading: false,
  billCompany: [],
  billClient: [],
  billList: [],
  updateSuccess: false,
}

function loadingRequest(state) {
  return {
    ...state,
    isLoading: true,
  }
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
    isLoading: false,
  }
}

function billUpdateInfo(state, action) {
  return {
    ...state,
    updateSuccess: true,
  }
}


export default caseReducer(initState, {
  LOADING_REQUEST: loadingRequest,
  GET_BILL_COMPANY_SUCCESS: getBillCompany,
  GET_BILL_CLIENTS_SUCCESS: getBillClients,
  BILL_APPLY_SEARCH_SUCCESS: billApplySearch,
  BILL_UPDATE_INFO_SUCCESS: billUpdateInfo,
})
