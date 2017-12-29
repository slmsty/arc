export default ({
   result=[],
   title="",
   loading=false
    }={}, action)=>{
  switch(action.type){
    case 'BILLEDARAPPROVE_HTTP_REQUEST':
      loading = true;
      break;
    case 'BILLEDARAPPROVE_HTTP_REQUEST_COMPLETED':
    case 'BILLEDARAPPROVE_HTTP_ERROR':
      loading = false;
      break;
    case 'BILLEDARAPPROVE_SEARCH_SUCCESS':
      const billedArDetailList = action.response.billedArDetailList;
      result = billedArDetailList.map(o=>({
        ...o,
        companyShow: `${o.companyId}_${o.companyName}`
      }));
      title = '';
      break;
    case 'BILLEDARAPPROVE_REJECT_SUCCESS':
      result = result.map(o=>{
        if(action.response.successList.includes(o.contractItemId)){
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
    case 'BILLEDARAPPROVE_CONFIRM_SUCCESS':
      result = result.map(o=>{
        if(action.response.successList.includes(o.contractItemId)){
          return {
            ...o,
            status: '20',
            statusName: '待会计确认'
          }
        }else{
          return o;
        }
      })

      title = `成功确认${action.response.successList.length}条数据，失败${action.response.failList.length}条数据`
      break;
    case 'BILLEDARAPPROVE_RESET_TITLE':
      title = ''
      break;
    default:
    // nothing
  }
  return {
    result,
    title,
    loading,
  }
}
