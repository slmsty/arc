import { httpApi } from '../../http/reduxRequestMiddleware'

const Search = ({pageInfo, applicationDate, applicationDates, custName, projectNos, contractNos, status, sbuInfo, orgInfo})=>({
  [httpApi]: {
    url: '/arc/badDebt/searchBadDebts',
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
        applicationDates: applicationDates,
        custName: custName,
        projectNos: projectNos,
        contractNos: contractNos,
        status: status || '',
        sbuNo: sbuInfo && sbuInfo[0],
        orgName: orgInfo && orgInfo[1]
      }
    },
  },
})

const UpdateResult = (payload=[])=>({
  type: 'BADDEBTSTATUS_UPDATE_RESULT_SUCCESS',
  payload
})

const SendErp = (badDebtIds, glDate)=>({
  [httpApi]: {
    url: '/arc/badDebt/sendERP',
    types: [
      'BADDEBTSTATUS_SENDERP_SUCCESS',
      'BADDEBTSTATUS_HTTP_REQUEST',
      'HTTP_FAILURE',
      'BADDEBTSTATUS_HTTP_ERROR',
      'BADDEBTSTATUS_HTTP_REQUEST_COMPLETED',
    ],
    options: {
      method: 'POST',
      body: {badDebtIds, glDate}
    },
  },
})

const SendErp2 = (badDebtIds)=>({
  [httpApi]: {
    url: '/arc/badDebt/sendERPBack',
    types: [
      'BADDEBTSTATUS_SENDERP2_SUCCESS',
      'BADDEBTSTATUS_HTTP_REQUEST',
      'HTTP_FAILURE',
      'BADDEBTSTATUS_HTTP_ERROR',
      'BADDEBTSTATUS_HTTP_REQUEST_COMPLETED'
    ],
    options: {
      method: 'POST',
      body: {badDebtIds}
    },
  },
})

const ResetTitle = ()=>({
  type: 'BADDEBTSTATUS_RESET_TITLE'
})


export {
  Search,
  UpdateResult,
  SendErp,
  SendErp2,
  ResetTitle,
}
