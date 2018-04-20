import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
// 查询接口
export function getStatementList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/receipt_claim/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_STATEMENT_LISTT_SUCCESS'],
    },
  }
}
//合同拆分查询表
export function getContractStatementList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/contract_split/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_CONTRACT_STATEMENT_LISTT_SUCCESS'],
    },
  }
}
//发票明细表
export function getInvoiceDetailList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/invoice_detail/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_INVOICE_DETAIL_LISTT_SUCCESS'],
    },
  }
}
//发票汇总表
export function getOutcomeDetailReportList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/billing_month/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_OUTCOME_DETAIL_LISTT_SUCCESS'],
    },
  }
}
//未大签提前开票数据补充
export function getUnContractOutcomeDataAddList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/unsigned_billing/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_UNCONTRACTOUTCOMNE_DETAIL_LISTT_SUCCESS'],
    },
  }
}
// 项目Order汇总
export function getProductOrderTotalList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/order_summarize/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_PRODUCT_ORDER_TOTAL_LISTT_SUCCESS'],
    },
  }
}
// 项目Order明细
export function getProductOrderDetailList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/project_order/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_PRODUCT_ORDER_DETAIL_LISTT_SUCCESS'],
    },
  }
}
 // 应收账款询证函报表
export function getConfirmDetailList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/confirmation_request/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_CONFIRM_DETAIL_LISTT_SUCCESS'],
    },
  }
}
// 发票信息查询表
export function getBillDetailList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/invoice/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_BILL_DETAIL_LISTT_SUCCESS'],
    },
  }
}
// 项目综合信息查询报表
export function getProductDetailList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/project_info/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_PRODUCT_DETAIL_LISTT_SUCCESS'],
    },
  }
}
// 整体合同内容查询
export function getTotalContractDetailList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/contract_info/list',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_TOTAL_DETAIL_LISTT_SUCCESS'],
    },
  }
}
// 导出excel url: '/arc/report/contract_split/excel',
export function getExcel(queryParam,type) {
  let url = ''
  if (type === 'split') {
    url = '/arc/report/contract_split/excel'  //合同拆分表导出地址
  }
  if (type === 'order') {
    url = '/arc/report/project_order/excel'  //ORDER明细表导出地址
  }
  if (type === 'summarize') {
    url = '/arc/report/order_summarize/excel'  // ORDER汇总表导出地址
  }
  return {
    [httpApi]: {
      url: url,
      options: {
        method: 'POST',
        body: queryParam,
      },
      acceptType: 'blob',
      types: ['GET_EXCEL_SUCCESS'],
    },
  }
}

