/**
 * Created by liangshuang on 17/12/13.
 */
import caseReducer from './../caseReducer'
import { saveAs } from './../../util/downFile'

const billStatusManageData = {
  getBillStatusManageList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getBillStatusDetailList: []
  ,
  getBillStatusContractDetailList: []
  ,
  getBillStatusBillResultList: []
  ,
  getFileDownList: {},
  cancelApproveRefresh: new Date().getTime(),
  sendResult: {},
  backInfo: [],
  saveBackSuccess: false,
}

function getBillStatusList(state, action) {
  return { ...state, getBillStatusManageList: action.response.pageInfo }
}
function getBillStatusDetail(state, action) {
  return { ...state, getBillStatusDetailList: action.response.data }
}
function getBillStatusContractDetail(state, action) {
  return { ...state, getBillStatusContractDetailList: action.response.data }
}
function getBillStatusBillResult(state, action) {
  return { ...state, getBillStatusBillResultList: action.response.data }
}
function disableApprove(state) {
  return { ...state, cancelApproveRefresh: new Date().getTime() }
}
function cancelApprove(state) {
  return { ...state, cancelApproveRefresh: new Date().getTime() }
}
function sendAP(state) {
  return { ...state, cancelApproveRefresh: new Date().getTime() }
}
function fileDown(state, action) {
  saveAs(action.files.blob, action.fileName)
  return {
    ...state
  }
}
function invoiceSendTax(state, action) {
  return {
    ...state,
    sendResult: action.response.data,
  }
}

function invoiceBackQuery(state, action) {
  return {
    ...state,
    backInfo: action.response.data,
    saveBackSuccess: false,
  }
}

function saveInvoiceBackInfo(state, action) {
  return {
    ...state,
    saveBackSuccess: true,
  }
}

export default caseReducer(billStatusManageData, {
  GET_BILLSTATUS_LIST_SUCCESS: getBillStatusList,
  GET_BILLSTATUS_DETAIL_LIST_SUCCESS: getBillStatusDetail,
  GET_BILLSTATUS_CONTRACT_LIST_SUCCESS: getBillStatusContractDetail,
  GET_BILLSTATUS_RESULT_SUCCESS: getBillStatusBillResult,
  CANCEL_APPROVE_SUCCESS: cancelApprove,
  DISSABLE_APPROVE_SUCCESS: disableApprove,
  SEND_AP_SUCCESS: sendAP,
  FILE_DOWN_SUCCESS: fileDown,
  INVOICE_SEND_TAX_SUCCESS: invoiceSendTax,
  INVOICE_BACK_QUERY_SUCCESS: invoiceBackQuery,
  SAVE_INVOICE_BACK_INFO_SUCCESS: saveInvoiceBackInfo,
})
