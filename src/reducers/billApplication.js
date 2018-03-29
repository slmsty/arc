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
    contractList: [],
    appLineItems: []
  },
  billContents: [],
  billSaveSuccess: false,
  redApplySuccess: false,
  contractUrl: [],
  failureMsg: '',
  billContracts: [],
  billStartSuccess: false,
  searchLoading: false,
  applicationInfo: {
    applyPersonName: '',
    applyPersonPhone: '',
    applyPersonDept: '',
    applyPersonEmail: '',
    serviceTypeName: '',
    serviceDetail: {
      appLineList: [],
      custInfo: {},
      comInfo: {},
    },
  },
  redApplyDetail: {
    custInfo: {},
    comInfo: {},
    appLineItems: []
  },
  showRedApply: false,
  contractRate: '',
  taxInfo: {},
}

function loadingRequest(state) {
  return {
    ...state,
    isLoading: true,
    failureMsg: '',
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
  const responseList = action.response.data.map((record, index) => ({
    key: index,
    ...record,
  }))
  return {
    ...state,
    billList: responseList,
    isLoading: false,
    billSaveSuccess: false,
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
    editInfo: action.response,
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
    isLoading: false,
    searchEditSuccess: false,
    failureMsg: '',
  }
}

function billApplySaveFailure(state, action) {
  return {
    ...state,
    isLoading: false,
    failureMsg: action.response.resultMessage,
    billSaveSuccess: false,
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
    showRedApply: false,
  }
}

function getContractUrl(state, action) {
  return {
    ...state,
    contractUrl: action.response.result,
  }
}

function billStartWorkFlow(state, action) {
  return {
    ...state,
    billStartSuccess: true,
  }
}

function getSearchContractBilling(state, action) {
  return {
    ...state,
    billContracts: action.response.data,
    searchLoading: false,
  }
}

function searchLoadingRequest(state, action) {
  return {
    ...state,
    searchLoading: true,
  }
}

function getApplicationDetail(state, action) {
  return {
    ...state,
    applicationInfo: action.response,
    billStartSuccess: false,
  }
}

function getRedApplyDetail(state, action) {
  return {
    ...state,
    redApplyDetail: action.response,
    showRedApply: true,
  }
}

function billApplicationRedApply(state, action) {
  return {
    ...state,
    redApplyDetail: action.response,
    showRedApply: false,
    billSaveSuccess: true,
  }
}

function getContractTaxRate(state, action) {
  return {
    ...state,
    contractRate: action.response.result.contractTaxRate,
  }
}

function getTaxInfo(state, action) {
  return {
    ...state,
    contractRate: action.response.result,
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
  BILL_APPLY_SAVE_FAILURE: billApplySaveFailure,
  BILL_RED_APPLY_SUCCESS: billRedApply,
  HIDE_DETAIL_MODAL: hideDetailModal,
  GET_CONTRACT_URL_SUCCESS: getContractUrl,
  BILL_START_WORK_FLOW_SUCCESS: billStartWorkFlow,
  GET_SEARCH_CONTRACT_BILLING_SUCCESS: getSearchContractBilling,
  SEARCH_LOADING_REQUEST: searchLoadingRequest,
  GET_APPLICATION_DETAIL_SUCCESS: getApplicationDetail,
  GET_RED_APPLY_DETAIL_SUCCESS: getRedApplyDetail,
  BILL_APPLICATION_RED_APPLY_SUCCESS: billApplicationRedApply,
  GET_CONTRACT_TAX_RATE: getContractTaxRate,
  GET_TAX_INFO: getTaxInfo,
})
