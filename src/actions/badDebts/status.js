import { httpApi } from '../../http/reduxRequestMiddleware'

const Search = ({pageInfo, applicationDate, applicationDates, custInfo, projectNos, contractNos, status, sbuNo, orgNo})=>({
  [httpApi]: {
    url: '/XXXXXX',
    types: [
      'BADDEBTSTATUS_SEARCH_SUCCESS',
      'BADDEBTSTATUS_HTTP_REQUEST',
      'HTTP_FAILURE',
      'BADDEBTSTATUS_HTTP_ERROR',
      'BADDEBTSTATUS_HTTP_REQUEST_COMPLETED',
    ],
    options: {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageInfo.pageNo,
          pageSize: pageInfo.pageSize
        },
        applicationDateStart: applicationDate && applicationDate[0] && applicationDate[0].format('YYYY-MM-DD'),
        applicationDateEnd: applicationDate && applicationDate[1] && applicationDate[1].format('YYYY-MM-DD'),
        applicationDates: applicationDates && applicationDates.map(o=>o.format('YYYY-MM-DD')),
        custName: custInfo && custInfo[1],
        projectNos: projectNos,
        contractNos: contractNos,
        status,
        sbuNo,
        orgNo,
      }
    },
  },
})

const sendErp = (ids)=>({
  [httpApi]: {
    url: '/XXXXXXX',
    types: ['BADDEBTSTATUS_SENDERP_SUCCESS'],
    options: {
      method: 'POST',
      body: {ids}
    },
  },
})

const sendErp2 = (ids)=>({
  [httpApi]: {
    url: '/XXXXXXX',
    types: ['BADDEBTSTATUS_SENDERP2_SUCCESS'],
    options: {
      method: 'POST',
      body: {ids}
    },
  },
})

const ResetTitle = ()=>({
  type: 'BADDEBTSTATUS_RESET_TITLE'
})

export {
  Search,
  sendErp,
  sendErp2,
  ResetTitle,
}
