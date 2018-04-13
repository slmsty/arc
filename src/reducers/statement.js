import caseReducer from './caseReducer'
import { saveAs } from './../util/downFile'

const myStateInfoData = {
  getStatementList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getContractStatementList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getInvoiceDetailList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getOutcomeDetailReportList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getUnSignList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getProductOrderDetailList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getProductOrderTotalList: {
    pageNo: 1,
    count: 0,
    result: [],
  },

}

function getStatementList(state, action) {
  return { ...state, getStatementList: action.response.pageInfo }
}
function getContractStatementList(state, action) {
  return { ...state, getContractStatementList: action.response.pageInfo }
}
function getInvoiceDetailList(state, action) {
  return { ...state, getInvoiceDetailList: action.response.pageInfo }
}
function getOutcomeDetailReportList(state, action) {
  return { ...state, getOutcomeDetailReportList: action.response.pageInfo }
}
function getUnContractOutcomeDataAddList(state, action) {
  return { ...state, getUnSignList: action.response.pageInfo }
}
function getProductOrderDetailList(state, action) {
  return { ...state, getProductOrderDetailList: action.response.pageInfo }
}
function getProductOrderTotalList(state, action) {
  return { ...state, getProductOrderTotalList: action.response.pageInfo }
}
function fileDown(state, action) {
  console.log('action',action)
  saveAs(action.files.blob, "Report.xlsx")
  return {
    ...state
  }
}

export default caseReducer(myStateInfoData, {
  GET_STATEMENT_LISTT_SUCCESS: getStatementList,
  GET_CONTRACT_STATEMENT_LISTT_SUCCESS:getContractStatementList,
  GET_EXCEL_SUCCESS:fileDown,
  GET_INVOICE_DETAIL_LISTT_SUCCESS:getInvoiceDetailList,
  GET_OUTCOME_DETAIL_LISTT_SUCCESS:getOutcomeDetailReportList,
  GET_UNCONTRACTOUTCOMNE_DETAIL_LISTT_SUCCESS:getUnContractOutcomeDataAddList,
  GET_PRODUCT_ORDER_DETAIL_LISTT_SUCCESS:getProductOrderDetailList,
  GET_PRODUCT_ORDER_TOTAL_LISTT_SUCCESS:getProductOrderTotalList,
})
