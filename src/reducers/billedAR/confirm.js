export default ({
  pageNo=1,
  pageSize=5,
  count=0,
  result=[],
  title="",
  loading=false
}={}, action)=>{
  switch(action.type){
    case 'BILLEDARCONFIRM_HTTP_REQUEST':
      loading = true;
      break;
    case 'BILLEDARCONFIRM_HTTP_REQUEST_COMPLETED':
    case 'BILLEDARCONFIRM_HTTP_ERROR':
      loading = false;
      break;
    case 'BILLEDARCONFIRM_SEARCH_SUCCESS':
      const pageInfo = action.response.pageInfo;
      pageNo = pageInfo.pageNo;
      pageSize = pageInfo.pageSize;
      count = pageInfo.count;
      result = pageInfo.result.map(o=>({
        ...o,
        companyShow: `${o.companyId}_${o.companyName}`
      }));
      title = ""
      break;
    case 'BILLEDARCONFIRM_EDIT':
      result = result.map(o=>{
        if(o.billedArId === action.payload.billedArId){
          return action.payload
        }else{
          return o
        }
      })
      break;
    case 'BILLEDARCONFIRM_REJECT_SUCCESS':
      result = result.map(o=>{
        if(action.response.successList.includes(o.billedArId)){
          return {
            ...o,
            status: '21',
            statusName: '无需确认'
          }
        }else{
          return o;
        }
      })

      title = `成功拒绝${action.response.successList.length}条数据，失败${action.response.failList.length}条数据`
      break;
    case 'BILLEDARCONFIRM_APPROVAL_SUCCESS':
      result = result.map(o=>{
        if(action.response.successList.includes(o.billedArId)){
          return {
            ...o,
            status: '30',
            statusName: '待传送PA'
          }
        }else{
          return o;
        }
      })

      title = `成功审批${action.response.successList.length}条数据，失败${action.response.failList.length}条数据`
      break;
    case 'BILLEDARCONFIRM_SEND_SUCCESS':
      result = result.map(o=>{
        if(action.response.successList.includes(o.billedArId)){
          return {
            ...o,
            status: '31',
            statusName: '已传送PA'
          }
        }else if(action.response.failList.includes(o.billedArId)){
          return {
            ...o,
            status: '32',
            statusName: '传送PA失败'
          }
        }else{
          return o;
        }
      })

      title = `传送成功${action.response.successList.length}条数据，传送失败${action.response.failList.length}条数据`
      break;
    case 'BILLEDARCONFIRM_RESET_TITLE':
      title = ""
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
