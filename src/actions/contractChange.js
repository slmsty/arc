import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getContractChangeList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/contract_change/search',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_CONTRACT_CHANGE_LIST_SUCCESS'],
    },
  }
}
