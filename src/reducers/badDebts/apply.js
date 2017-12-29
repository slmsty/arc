export default ({
  pageNo=1,
  pageSize=5,
  count=0,
  result=[],
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
  }
}
