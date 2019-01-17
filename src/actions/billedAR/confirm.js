import {httpApi} from '../../http/reduxRequestMiddleware'

const Search = ({pageInfo, glDates, projectNos, contractNos,fundId, billedArDate, custName, paymentTerm, companyName, status, moreLessZero})=>({
  [httpApi]: {
    url: '/arc/billedar/confirm/search',
    types: [
      'BILLEDARCONFIRM_SEARCH_SUCCESS',
      'BILLEDARCONFIRM_HTTP_REQUEST',
      'HTTP_FAILURE',
      'BILLEDARCONFIRM_HTTP_ERROR',
      'BILLEDARCONFIRM_HTTP_REQUEST_COMPLETED',
    ],
    options: {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageInfo.pageNo,
          pageSize: pageInfo.pageSize
        },
        glDatesStart: glDates && glDates[0] && glDates[0].format('YYYY-MM-DD'),
        glDatesEnd:glDates && glDates[1] && glDates[1].format('YYYY-MM-DD'),
        projectNos: projectNos,
        contractNos: contractNos,
        billedArDateStart: billedArDate && billedArDate[0] && billedArDate[0].format('YYYY-MM-DD'),
        billedArDateEnd: billedArDate && billedArDate[1] && billedArDate[1].format('YYYY-MM-DD'),
        fundId:fundId,
        custName: custName,
        paymentTerm,
        companyName,
        status,
        moreLessZero
      }
    },
  },
});

const editBilledAr = (payload)=>({
  type: 'BILLEDARCONFIRM_EDIT',
  payload
});

const Reject = (billedArIds)=>({
  [httpApi]: {
    url: '/arc/billedar/confirm/refuse',
    types: ['BILLEDARCONFIRM_REJECT_SUCCESS'],
    options: {
      method: 'POST',
      body: {billedArIds}
    },
  },
});

const Approval = (billedArIds)=>({
  [httpApi]: {
    url: '/arc/billedar/confirm/approve',
    types: ['BILLEDARCONFIRM_APPROVAL_SUCCESS'],
    options: {
      method: 'POST',
      body: {billedArIds}
    },
  },
});

const ResetTitle = ()=>({
  type: 'BILLEDARCONFIRM_RESET_TITLE'
});
const exportParams=({pageInfo, glDates, projectNos, contractNos,fundId, billedArDate, custName, paymentTerm, companyName, status, moreLessZero})=>({
 [httpApi]:{
    url: '/arc/billedar/confirm/export',
    types: [
      'EXPORT_BILLEDARCONFIRM_SUCCESS'
    ],
    acceptType: 'blob',
    options: {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageInfo.pageNo,
          pageSize: pageInfo.pageSize
        },
        glDatesStart: glDates && glDates[0] && glDates[0].format('YYYY-MM-DD'),
        glDatesEnd:glDates && glDates[1] && glDates[1].format('YYYY-MM-DD'),
        projectNos: projectNos,
        contractNos: contractNos,
        billedArDateStart: billedArDate && billedArDate[0] && billedArDate[0].format('YYYY-MM-DD'),
        billedArDateEnd: billedArDate && billedArDate[1] && billedArDate[1].format('YYYY-MM-DD'),
        fundId:fundId,
        custName: custName,
        paymentTerm,
        companyName,
        status,
        moreLessZero
      }
    },
  },


})
export {
  Search,
  editBilledAr,
  Reject,
  Approval,
  ResetTitle,
  exportParams,
}
