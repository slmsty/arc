import caseReducer from './caseReducer'

const initState = {
  isLoading: false,
  billCompany: [],
  billClient: [],
  billList: [],
  updateSuccess: false,
  addContractSuccess: false,
  otherSuccess: false,
  searchEditSuccess: false,
  editInfo: {
    custInfo: {},
    comInfo: {},
    appLineItems: []
  },
  billContents: [],
  billSaveSuccess: false,
  redApplySuccess: false,
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
    searchEditSuccess: true,
    editInfo: {
      custInfo: action.response.custInfo,
      comInfo: action.response.comInfo,
      appLineItems: action.response.appLineItems,
    },
  }
}

function billContentSearch(state, action) {
  return {
    ...state,
    billContents: action.response.data,
  }
}

function billApplySave(state, action) {
  return {
    ...state,
    billSaveSuccess: true,
    searchEditSuccess: false,
  }
}

function initData(state) {
  return {
    ...state,
    billList: [],
    addSuccess: false,
    updateSuccess: false,
    billSaveSuccess: false,
  }
}

function billRedApply(state) {
  return {
    ...state,
    redApplySuccess: true,
  }
}

function hideDetailModal(state) {
  return {
    ...state,
    searchEditSuccess: false,
  }
}

export default caseReducer(initState, {
  LOADING_REQUEST: loadingRequest,
  INIT_DATA: initData,
  GET_BILL_COMPANY_SUCCESS: getBillCompany,
  GET_BILL_CLIENTS_SUCCESS: getBillClients,
  BILL_APPLY_SEARCH_SUCCESS: billApplySearch,
  BILL_UPDATE_INFO_SUCCESS: billUpdateInfo,
  ADD_BILL_UN_CONTRACT_SUCCESS: addBillUnContract,
  ADD_OTHER_CONTRACT_SUCCESS: addOtherContract,
  BILL_APPLY_EDIT_SUCCESS: billApplyEdit,
  BILL_CONTENT_SEARCH_SUCCESS: billContentSearch,
  BILL_APPLY_SAVE_SUCCESS: billApplySave,
  BILL_RED_APPLY_SUCCESS: billRedApply,
  HIDE_DETAIL_MODAL: hideDetailModal,
})
