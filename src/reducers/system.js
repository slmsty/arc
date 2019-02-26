import caseReducer from './caseReducer'
import {saveAs} from '../util/downFile'
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
  },
  mailCcConfig: {
    result: [],
  },
  regionPage:{
    result: []
  },
  approveConfigs: {
    result: []
  },
  approveNodeList: []
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
    saveSuccess: false,
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
    saveSuccess: false,
  }
}

function saveInvoiceTaxInfo(state, action) {
  return {
    ...state,
    saveSuccess: true,
  }
}

function sysmangeexportParams(state, action) {
  saveAs(action.files.blob, "审批人配置.xlsx");
  return { ...state }
}
function queryMailCc(state, action) {
  return {
    ...state,
    mailCcConfig: action.response.pageInfo,
    isLoading: false,
    saveSuccess: false,
  }
}

function saveMailCc(state, action) {
  return {
    ...state,
    saveSuccess: true,
  }
}

function queryRegionList(state, action) {
  return {
    ...state,
    regionList: action.response.data.map(region => ({
      label: region.buName,
      value: region.buNo,
      disabled: true,
      children: region.regions ?region.regions.map((child, index) => ({
        label: child,
        value: child,
      })) : [],
    })),
  }
}

function queryApproveConfig(state, action) {
  return {
    ...state,
    approveConfigs: action.response.pageInfo,
    isLoading: false,
    saveSuccess: false,
  }
}

function saveApproveConfig(state) {
  return {
    ...state,
    saveSuccess: true,
  }
}

function getApproveNodeList(state, action) {
  return {
    ...state,
    approveNodeList: action.response.data,
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
  QUERY_MAIL_CC_SUCCESS: queryMailCc,
  QUERY_REGION_LIST_SUCCESS: queryRegionList,
  SAVE_MAIL_CC_SUCCESS: saveMailCc,
  QUERY_APPROVE_CONFIG_SUCCESS: queryApproveConfig,
  SAVE_APPROVE_CONFIG_SUCCESS: saveApproveConfig,
  GET_APPROVE_NODE_LIST_SUCCESS: getApproveNodeList,
  EXPORT_SYSMANAGECONFIRM_SUCCESS:sysmangeexportParams,
})
