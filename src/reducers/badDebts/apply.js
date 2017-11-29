export default ({
  pageNo=1,
  pageSize=5,
  count=0,
  result=[],
  title="",
  loading=false
}={}, action)=>{
  switch(action.type){
    case 'BADDEBTSAPPLY_HTTP_REQUEST':
      loading = true;
      break;
    case 'BADDEBTSAPPLY_HTTP_REQUEST_COMPLETED':
    case 'BADDEBTSAPPLY_HTTP_ERROR':
      loading = false;
      break;
    case 'BADDEBTSAPPLY_SEARCH_SUCCESS':
      const pageInfo = action.response.pageInfo;
      pageNo = pageInfo.pageNo;
      pageSize = pageInfo.pageSize;
      count = pageInfo.count;
      result = pageInfo.result;
      title = '';
      break;
    case 'BADDEBTSAPPLY_APPLY_SUCCESS':
      result = result.map(o=>{
        if(action.response.successList.includes(o.badDebtId)){
          return {
            ...o,
            status: '12',
            statusName: '已审批'
          }
        }else if(action.response.failList.includes(o.badDebtId)){
          return {
            ...o,
            status: '13',
            statusName: '审批退回'
          }
        }else{
          return o;
        }
      })
      title = `审批成功${action.response.successList.length}条数据，审批失败${action.response.failList.length}条数据`
      break;
    case 'BADDEBTSAPPLY_RESET_TITLE':
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
    title,
    loading,
  }
}
