import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getCBSTurnoverWholenessData(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/integrity/search',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_CBS_TURNOVER_WHOLENESS_CONFIRM_DATA__SUCCESS'],
    },
  }
}
