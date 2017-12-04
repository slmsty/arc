import { httpApi } from '../../http/reduxRequestMiddleware'

const Search = ({pageInfo, glDate, glDates, custName, projectNos, contractNos, status, sbuInfo, orgInfo})=>({
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
        glDates: glDates,
        custName: custName,
        projectNos: projectNos,
        contractNos: contractNos,
        status,
        sbuNo: sbuInfo && sbuInfo[0],
        orgName: orgInfo && orgInfo[1]
      }
    },
  },
})

export {
  Search
}
