import { httpApi } from '../../http/reduxRequestMiddleware'

const Search = ({pageInfo, glDate, glDates, custInfo, projectNos, contractNos, companyName})=>({
  [httpApi]: {
    url: '/arc/billedar/judgement/search',
    types: [
      'BILLEDARAPPROVE_SEARCH_SUCCESS',
      'BILLEDARAPPROVE_HTTP_REQUEST',
      'HTTP_FAILURE',
      'BILLEDARAPPROVE_HTTP_ERROR',
      'BILLEDARAPPROVE_HTTP_REQUEST_COMPLETED',
    ],
    options: {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageInfo.pageNo,
          pageSize: pageInfo.pageSize
        },
        glDateStart: glDate && glDate[0] && glDate[0].format('YYYY-MM-DD'),
        glDateEnd: glDate && glDate[1] && glDate[1].format('YYYY-MM-DD'),
        glDates: glDates && glDates.map(o=>o.format('YYYY-MM-DD')),
        custName: custInfo && custInfo[1],
        projectNos: projectNos,
        contractNos: contractNos,
        companyName
      }
    },
  },
})

const Reject = (ids)=>({
  [httpApi]: {
    url: '/arc/billedar/judgement/reject',
    types: ['BILLEDARAPPROVE_REJECT_SUCCESS'],
    options: {
      method: 'POST',
      body: {ids}
    },
  },
})

const Confirm = (ids)=>({
  [httpApi]: {
    url: '/arc/billedar/judgement/pass',
    types: ['BILLEDARAPPROVE_CONFIRM_SUCCESS'],
    options: {
      method: 'POST',
      body: {ids}
    },
  },
})

const ResetTitle = ()=>({
  type: 'BILLEDARAPPROVE_RESET_TITLE'
})

export {
  Search,
  Reject,
  Confirm,
  ResetTitle,
}
