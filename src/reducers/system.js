import caseReducer from './caseReducer'

const system = {
  isLoading: false,
  mailConfig: {
    askContractTo: [],
    askContractCc: [],
    receiptArrivalTo: [],
    receiptArrivalCc: [],
  },
  saveSuccess: false,
  pageInfo: {
    result: [],
  },
  taxPageInfo: {
    result: [],
  }
}
function loadingRequest(state) {
  return {
    ...state,
    isLoading: true,
  }
}

function getMailConfig(state, action) {
  return { ...state, mailConfig: action.response.mailConfig }
}

function saveMailConfig(state, action) {
  return {
    ...state,
    saveSuccess: true,
  }
}

function queryCustTaxInfo(state, action) {
  return {
    ...state,
    pageInfo: action.response.pageInfo,
    isLoading: false,
  }
}

function saveCustTaxInfo(state, action) {
  return {
    ...state,
    saveSuccess: true,
  }
}

function queryInvoiceTaxInfo(state, action) {
  return {
    ...state,
    taxPageInfo: action.response.pageInfo,
    isLoading: false,
  }
}

function saveInvoiceTaxInfo(state, action) {
  return {
    ...state,
    saveSuccess: true,
  }
}

export default caseReducer(system, {
  GET_MAIL_CONFIG_SUCCESS: getMailConfig,
  SAVE_MAIL_CONFIG_SUCCESS: saveMailConfig,
  QUERY_CUST_TAX_INFO_SUCCESS: queryCustTaxInfo,
  LOADING_REQUEST: loadingRequest,
  SAVE_CUST_TAX_INFO_SUCCESS: saveCustTaxInfo,
  QUERY_INVOICE_TAX_INFO_SUCCESS: queryInvoiceTaxInfo,
  SAVE_INVOICE_TAX_INFO_SUCCESS: saveInvoiceTaxInfo,
})
