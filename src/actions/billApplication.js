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
      types: ['BILL_APPLY_SEARCH_SUCCESS', 'LOADING_REQUEST'],
    },
  }
}
/**
 * 发票信息单条修改
 * @param params
 * @returns {{}}
 */
export const updateBillInfo = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/edit/save',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['BILL_UPDATE_INFO_SUCCESS'],
    },
  }
}
/**
 * 新增未大签合同
 * @param params
 * @returns {{}}
 */
export const addBillUnContract = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/billingUnContract/add',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['ADD_BILL_UN_CONTRACT_SUCCESS'],
    },
  }
}
/**
 * 新增其他合同
 * @param params
 * @returns {{}}
 */
export const addOtherContract = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/billingOther/add',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['ADD_OTHER_CONTRACT_SUCCESS'],
    },
  }
}

/**
 * 开票申请编辑
 * @param params
 * @returns {{}}
 */
export const billApplyEdit = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/apply/edit',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['BILL_APPLY_EDIT_SUCCESS'],
    },
  }
}
/**
 * 发票内容查询
 * @param params
 * @returns {{}}
 */
export const billContentSearch = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/billingContent/search',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['BILL_CONTENT_SEARCH_SUCCESS'],
    },
  }
}
/**
 * 开票
 * @param params
 * @returns {{}}
 */
export const billApplySave = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/apply/save',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['BILL_APPLY_SAVE_SUCCESS'],
    },
  }
}

export const initData = () => (
  {type: 'INIT_DATA'}
)

/**
 * 发票红冲
 * @param params
 * @returns {{}}
 */
export const billRedApply = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/redApply',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['BILL_RED_APPLY_SUCCESS'],
    },
  }
}
/**
 * 提交开票前校验
 * @param params
 * @returns {{}}
 */
export const billApplyCheck = (params) => {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/apply/check',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['BILL_APPLY_CHECK_SUCCESS'],
    },
  }
}

// 获取审批表链接地址
export function getContractUrl(contractId) {
  return {
    [httpApi]: {
      url: `/arc/contract/split/getContractPDFUrlByIds`,
      options: {
        method: 'POST',
        body: {
          contractIds: contractId,
        }
      },
      types: ['GET_CONTRACT_URL_SUCCESS'],
    },
  }
}

export const hideDetailModal = () => (
  {type: 'HIDE_DETAIL_MODAL'}
)

// 开票申请发起流程
export function billStartWorkFlow(params) {
  return {
    [httpApi]: {
      url: `/arc/billingApplication/startWorkFlow`,
      options: {
        method: 'POST',
        body: params,
      },
      types: ['BILL_START_WORK_FLOW_SUCCESS'],
    },
  }
}
/**
 * 开票审核查询
 * @param params
 * @returns {{}}
 */
export function searchContractBilling(params) {
  return {
    [httpApi]: {
      url: `/arc/billingApplication/searchContractBillingNew`,
      options: {
        method: 'POST',
        body: params,
      },
      types: ['GET_SEARCH_CONTRACT_BILLING_SUCCESS', 'SEARCH_LOADING_REQUEST'],
    },
  }
}
/**
 * 获取审核详情
 * @param billingApplicationId
 * @returns {{}}
 */
export function getApplicationDetail(billingApplicationId) {
  return {
    [httpApi]: {
      url: `/arc/billingApplication/getApplicationDetail`,
      options: {
        method: 'POST',
        body: {
          billingApplicationId,
        },
      },
      types: ['GET_APPLICATION_DETAIL_SUCCESS'],
    },
  }
}
/**
 * 查询红冲申请详细信息
 * @param billingOutcomeId
 * @returns {{}}
 */
export function getRedApplyDetail(billingOutcomeIds) {
  return {
    [httpApi]: {
      url: `/arc/billingApplication/redApplyDetail`,
      options: {
        method: 'POST',
        body: {
          billingOutcomeIds,
        },
      },
      types: ['GET_RED_APPLY_DETAIL_SUCCESS'],
    },
  }
}
/**
 * 退票申请
 * @param params
 * @returns {{}}
 */
export function billApplicationRedApply(params) {
  return {
    [httpApi]: {
      url: `/arc/billingApplication/redApply`,
      options: {
        method: 'POST',
        body: params,
      },
      types: ['BILL_APPLICATION_RED_APPLY_SUCCESS'],
    },
  }
}
/**
 * 获取合同税率
 * @param contractId
 * @returns {{}}
 */
export function getContractTaxRate(contractId) {
  return {
    [httpApi]: {
      url: `/arc/contract/split/taxRate/${contractId}`,
      options: {
        method: 'GET',
      },
      types: ['GET_CONTRACT_TAX_RATE'],
    },
  }
}
/**
 * 其他事项开票获取税率
 * @param params
 * @returns {{}}
 */
export function getTaxInfo(params) {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/getTaxInfo',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['GET_TAX_INFO'],
    },
  }
}

