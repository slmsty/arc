import { httpApi } from '../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function getContractList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/contract/split/search',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_CONTRACT_LIST_SUCCESS'],
    },
  }
}

export function saveContractSplitInfo(queryParam) {
  console.log('queryParam',queryParam)
  return {
    [httpApi]: {
      url: '/arc/contract/split/add',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['SAVE_CONTRACTSPLITINFO_SUCCESS'],
    },
  }
}
export function approveReject(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/rejectToApply',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['APPROVE_REJECT_MYAPPLY_SUCCESS'],
    },
  }
}
 // 获取审批表链接地址
export function getUrl(queryParam) {
  return {
    [httpApi]: {
      url: `/arc/contract/split/contractUrl/${queryParam}`,
      options: {
        method: 'GET',
      },
      types: ['GET_URL_SUCCESS'],
    },
  }
}
// 传送ERP
export function sendERP(queryParam) {
  return {
    [httpApi]: {
      url: "/arc/contract/split/senderp",
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['SENDERP_SUCCESS'],
    },
  }
}
// 传送ERP查询接口
export function sendERPQuery(queryParam) {
  return {
    [httpApi]: {
      url: "arc/contract/split/senderp",
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['SENDERP_QUERY_SUCCESS'],
    },
  }
}
// 获取产品编码数据
export function getProductNo(queryParam) {
  return {
    [httpApi]: {
      url: "/arc/common/task/prd/list",
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GETPRODUCTNO_SUCCESS'],
    },
  }
}
