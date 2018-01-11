import { httpApi } from '../http/reduxRequestMiddleware'
/**
 * 开票申请公司查询
 * @param params
 * @returns {{}}
 */
export const getBillCompanys = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/company/search',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['GET_BILL_COMPANY_SUCCESS'],
    },
  }
}
/**
 * 开票申请客户查询
 * @param params
 * @returns {{}}
 */
export const getBillClients = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/custom/search',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['GET_BILL_CLIENTS_SUCCESS'],
    },
  }
}

/**
 * 开票申请查询
 * @param params
 * @returns {{}}
 */
export const billApplySearch = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/apply/search',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['BILL_APPLY_SEARCH_SUCCESS'],
    },
  }
}

