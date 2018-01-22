import caseReducer from './caseReducer'

const initState = {
  isLoading: false,
  billCompany: [],
  billClient: [],
  billList: [],
  updateSuccess: false,
  addContractSuccess: false,
  otherSuccess: false,
  editInfo: {
    custInfo: {},
    comInfo: {},
    appLineItems: []
  },
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
    updateSuccess: false,
    addSuccess: false,
  }
}

function billUpdateInfo(state) {
  return {
    ...state,
    updateSuccess: true,
  }
}

function addBillUnContract(state) {
  return {
    ...state,
    addSuccess: true,
  }
}

function addOtherContract(state) {
  return {
    ...state,
    addSuccess: true,
  }
}

function billApplyEdit(state, action) {
  return {
    ...state,
    editInfo: {
      custInfo: action.response.custInfo,
      comInfo: action.response.comInfo,
      appLineItems: action.response.appLineItems,
    },
  }
}

export default caseReducer(initState, {
  LOADING_REQUEST: loadingRequest,
  GET_BILL_COMPANY_SUCCESS: getBillCompany,
  GET_BILL_CLIENTS_SUCCESS: getBillClients,
  BILL_APPLY_SEARCH_SUCCESS: billApplySearch,
  BILL_UPDATE_INFO_SUCCESS: billUpdateInfo,
  ADD_BILL_UN_CONTRACT_SUCCESS: addBillUnContract,
  ADD_OTHER_CONTRACT_SUCCESS: addOtherContract,
  BILL_APPLY_EDIT_SUCCESS: billApplyEdit,
})
