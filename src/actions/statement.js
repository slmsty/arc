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
// 导出excel
export function getExcel(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/report/contract_split/excel',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_EXCEL_SUCCESS'],
    },
  }
}

