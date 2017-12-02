export default ({
  pageNo=1,
  pageSize=5,
  count=0,
  result=[],
  title='',
  loading=false
}={}, action)=>{
  switch(action.type){
    case 'BADDEBTSTATUS_HTTP_REQUEST':
      loading = true;
      break;
    case 'BADDEBTSTATUS_HTTP_REQUEST_COMPLETED':
    case 'BADDEBTSTATUS_HTTP_ERROR':
      loading = false;
      break;
    case 'BADDEBTSTATUS_SEARCH_SUCCESS':
      const pageInfo = action.response.pageInfo;
      pageNo = pageInfo.pageNo;
      pageSize = pageInfo.pageSize;
      count = pageInfo.count;
      result = pageInfo.result;
      title = '';
      break;
    case 'BADDEBTSTATUS_UPDATE_RESULT_SUCCESS':
      result = result.map(o=>{
        let obj = action.payload.find(oo=>oo.badDebtId===o.badDebtId);
        return obj ? obj: o
      })
      title = '';
      break;
    case 'BADDEBTSTATUS_SENDERP_SUCCESS':
      result = result.map(o=>{
        if(action.response.data.successIds.includes(o.badDebtId)){
          return {
            ...o,
            status: '20',
            statusName: '已划销'
          }
        }else if(action.response.data.failures.map(o=>o.badDebtId).includes(o.badDebtId)){
          return {
            ...o,
            status: '22',
            statusName: '错误'
          }
        }else{
          return o;
        }
      })

      title = `传送成功${action.response.data.successIds.length}条数据，传送失败${action.response.data.failures.length}条数据`
      break;
    case 'BADDEBTSTATUS_SENDERP2_SUCCESS':
      result = result.map(o=>{
        if(action.response.data.successIds.includes(o.badDebtId)){
          return {
            ...o,
            status: '21',
            statusName: '已划销退回'
          }
        }else if(action.response.data.failures.map(o=>o.badDebtId).includes(o.badDebtId)){
          return {
            ...o,
            status: '22',
            statusName: '错误'
          }
        }else{
          return o;
        }
      })

      title = `传送成功${action.response.data.successIds.length}条数据，传送失败${action.response.data.failures.length}条数据`
      break;
    case 'BADDEBTSTATUS_RESET_TITLE':
      title = ''
      break;
    default:
      // nothing
  }
  return {
    pageNo,
    pageSize,
    count,
    result,
    loading,
    title
  }
}
