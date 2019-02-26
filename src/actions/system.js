import { httpApi } from '../http/reduxRequestMiddleware'
/**
 * 获取邮件配置
 * @returns {{}}
 */
export function getMailConfig() {
  return {
    [httpApi]: {
      url: '/arc/sysManage/getMailConfig',
      options: {
        method: 'GET',
      },
      types: ['GET_MAIL_CONFIG_SUCCESS'],
    },
  }
}
/**
 * 报错邮件配置
 * @param params
 * @returns {{}}
 */
export function saveMailConfig(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/saveMailConfig',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['SAVE_MAIL_CONFIG_SUCCESS'],
    },
  }
}

/**
 * 查询客户纳税信息
 * @param params
 * @returns {{}}
 */
export function queryCustTaxInfo(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/queryCustTaxInfoConfig',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['QUERY_CUST_TAX_INFO_SUCCESS', 'LOADING_REQUEST'],
    },
  }
}

/**
 * 保存客户纳税信息
 * @param params
 * @returns {{}}
 */
export function saveCustTaxInfo(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/saveCustTaxInfoConfig',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['SAVE_CUST_TAX_INFO_SUCCESS'],
    },
  }
}

/**
 * 查询客户开票内容及税收分类
 * @param params
 * @returns {{}}
 */
export function queryInvoiceTaxInfo(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/queryInvoiceTaxInfoConfig',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['QUERY_INVOICE_TAX_INFO_SUCCESS', 'LOADING_REQUEST'],
    },
  }
}

/**
 * 保存客户开票内容
 * @param params
 * @returns {{}}
 */
export function saveInvoiceTaxInfo(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/saveInvoiceTaxInfoConfig',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['SAVE_INVOICE_TAX_INFO_SUCCESS'],
    },
  }
}

/**
 * 查询到款邮件配置
 * @param params
 * @returns {{}}
 */
export function queryMailCcConfig(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/queryReceiptClaimEmail',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['QUERY_MAIL_CC_SUCCESS', 'LOADING_REQUEST'],
    },
  }
}

/**
 * 保存邮件配置
 * @param params
 * @returns {{}}
 */
export function saveMailCcConfig(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/saveReceiptClaimEmail',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['SAVE_MAIL_CC_SUCCESS'],
    },
  }
}

/**
 * 查询区域
 * @param params
 * @returns {{}}
 */
export function queryRegionList(params) {
  return {
    [httpApi]: {
      url: '/arc/common/region/list',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['QUERY_REGION_LIST_SUCCESS'],
    },
  }
}

/**
 * 审批人配置查询
 * @param params
 * @returns {{}}
 */
export function queryApproverConfig(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/queryApprovePerson',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['QUERY_APPROVE_CONFIG_SUCCESS', 'LOADING_REQUEST'],
    },
  }
}

/**
 * 保存审批人配置
 * @param params
 * @returns {{}}
 */
export function saveApprovePerson(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/saveApprovePerson',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['SAVE_APPROVE_CONFIG_SUCCESS'],
    },
  }
}

export function getApproveNodeList() {
  return {
    [httpApi]: {
      url: '/arc/common/node/list',
      options: {
        method: 'GET',
      },
      types: ['GET_APPROVE_NODE_LIST_SUCCESS'],
    },
  }
}

export function exportParams(queryParam){
  return{
 [httpApi]:{
    url: '/arc/sysManage/exportApprovePerson',
    types: [
      'EXPORT_SYSMANAGECONFIRM_SUCCESS'
    ],
    acceptType: 'blob',
    options: {
      method: 'POST',
      body: queryParam,
    },
  },


}}