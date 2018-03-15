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


