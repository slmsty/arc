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
   getNetOrderMReport: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getConfirmDetailList:{
    pageNo: 1,
    count: 0,
    result: [],
  },
  getBillDetailList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getProductDetailList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  getTotalContractDetailList: {
    pageNo: 1,
    count: 0,
    result: [],
  },
  billTotalAmount: 0,

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
function getBillTotalAmount(state, action) {
  const { invoiceAmountTotal } = action.response.invoiceReportItem
  return {
    ...state,
    billTotalAmount: invoiceAmountTotal
  }
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
function getNetOrderMReport(state, action) {

  return { ...state, getNetOrderMReport: action.response.pageInfo }
}
function getConfirmDetailList(state, action) {
  return { ...state, getConfirmDetailList: action.response.pageInfo }
}
function getBillDetailList(state, action) {
  const pageInfo = action.response.pageInfo
  let invoiceList = []
  pageInfo.result.map(item => {
    const length = item.invoiceItems.length
    let preId = ''
    let childSpan = false
    let totalSpan = 0
    let includeSpan = false
    if(item.invoiceItems.length > 0) {
      item.invoiceItems.map((invoice, index) => {
        if(invoice.billingApplicationId !== preId) {
          childSpan = true
          includeSpan = invoice.invoiceAmountMerge
          preId = invoice.billingApplicationId
          totalSpan = item.invoiceItems.filter(item => item.billingApplicationId === invoice.billingApplicationId).length;
        } else {
          totalSpan = 0;
        }
        invoiceList.push({
          ...item,
          ...invoice,
          isRowSpan: index === 0 ? true :false,
          rowSpan: index === 0 ? length : 0,
          amountIsSpan: childSpan,
          amountSpan: totalSpan,
          includeIsSpan: includeSpan,
          includeSpan: totalSpan,
        })
      })
    } else {
      invoiceList.push({
        ...item,
        isRowSpan: true,
        rowSpan: 1,
        amountIsSpan: false,
        amountSpan: 0,
        includeIsSpan: false,
        includeSpan: 0,
      })
    }
  })
  console.log(invoiceList)
  const newPage = {
    ...pageInfo,
    pageSize: invoiceList.length,
    result: invoiceList,
  }
  return { ...state, getBillDetailList: newPage }
}

function getProductDetailList(state, action) {
  return { ...state, getProductDetailList: action.response.pageInfo }
}
function getTotalContractDetailList(state, action) {
  return { ...state, getTotalContractDetailList: action.response.pageInfo }
}
function fileDown(state, action) {
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
  GET_BILL_TOTAL_AMOUNT_SUCCESS: getBillTotalAmount,
  GET_OUTCOME_DETAIL_LISTT_SUCCESS:getOutcomeDetailReportList,
  GET_UNCONTRACTOUTCOMNE_DETAIL_LISTT_SUCCESS:getUnContractOutcomeDataAddList,
  GET_PRODUCT_ORDER_DETAIL_LISTT_SUCCESS:getProductOrderDetailList,
  GET_PRODUCT_ORDER_TOTAL_LISTT_SUCCESS:getProductOrderTotalList,
  GET_CONFIRM_DETAIL_LISTT_SUCCESS:getConfirmDetailList,
  GET_BILL_DETAIL_LISTT_SUCCESS:getBillDetailList,
  GET_PRODUCT_DETAIL_LISTT_SUCCESS:getProductDetailList,
  GET_TOTAL_DETAIL_LISTT_SUCCESS:getTotalContractDetailList,
  GET_Net_ORDER_M_SUCCESS:getNetOrderMReport,
})
