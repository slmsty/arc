/**
 * Created by liangshuang on 18/5/17.
 */
import { httpApi } from './../../http/reduxRequestMiddleware'

export function getBillDataInitList(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/searchBillingDataInit',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['GET_BILLDATAINIT_LIST_SUCCESS'],
    },
  }
}
export function saveBillDataInit(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/billingDataInitSave',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['SAVE_BILLDATAINIT_SUCCESS'],
    },
  }
}
export function showDataInitModal(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/billingDataInitEdit',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['SHOW_DATA_INIT_MODAL_SUCCESS'],
    },
  }
}

export function exportExcel(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/billingApplication/exportBillingDataInit',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['EXPORT_EXCEL_SUCCESS'],
      acceptType: 'blob',
    },
  }
}
