import { httpApi } from '../../http/reduxRequestMiddleware'

const Search = ({pageInfo, glDate, glDates, custInfo, projectNos, contractNos, status, sbuNo, orgNo})=>({
  [httpApi]: {
    url: '/arc/badDebt/apply/search',
    types: [
      'BADDEBTSAPPLY_SEARCH_SUCCESS',
      'BADDEBTSAPPLY_HTTP_REQUEST',
      'HTTP_FAILURE',
      'BADDEBTSAPPLY_HTTP_ERROR',
      'BADDEBTSAPPLY_HTTP_REQUEST_COMPLETED',
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
        projectNos: projectNos && projectNos.join(','),
        contractNos: contractNos,
        status,
        sbuNo,
        orgNo,
      }
    },
  },
})

const Apply = (ids)=>({
  [httpApi]: {
    url: '/arc/badDebt/apply',
    types: ['BADDEBTSAPPLY_APPLY_SUCCESS'],
    options: {
      method: 'POST',
      body: {ids}
    },
  },
})

const ResetTitle = ()=>({
  type: 'BADDEBTSAPPLY_RESET_TITLE'
})

export {
  Search,
  Apply,
  ResetTitle,
}
