import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getArcCustBankList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/arcCustBank/view',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_ARC_CUSTBANK_LIST_SUCCESS'],
    },
  }
}
export function addArcCustBankData(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/arcCustBank/save',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['ADD_ARC_CUSTBANK_DATA_SUCCESS'],
    },
  }
}
export function deleteArcCustBankData(queryParam) {
  return {
    [httpApi]: {
      url: `/arc/receiptclaim/arcCustBank/singleDelete/${queryParam}`,
      options: {
        method: 'GET',
      },
      types: ['DELETE_ARC_CUSTBANK_DATA_SUCCESS'],
    },
  }
}
export function deleteArcCustBankDatas(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/receiptclaim/arcCustBank/batchDelete',
      options: {
        method: 'post',
        body: queryParam,
      },
      types: ['DELETE_ARC_CUSTBANK_DATAS_SUCCESS'],
    },
  }
}
