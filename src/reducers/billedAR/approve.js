const transformStatus = (status)=>{
  let show = '';
  switch(status){
    case 10:
      show = '已核对';
      break;
    case 20:
      show = '待应收会计确认';
      break;
    case 21:
      show = '无需确认';
      break;
    case 30:
      show = '待传送PA';
      break;
    case 31:
      show = '已传送PA';
      break;
    case 32:
      show = '传送PA失败';
      break;
  }

  return show;
}

export default ({
  pageNo=1,
  pageSize=10,
  count=0,
  result=[]
}={}, action)=>{
  switch(action.type){
    case 'BILLEDARAPPROVE_SEARCH':
      console.log(action.payload);
      pageNo = 1;
      count = 1300;
      result = [
        {
          billedArId: 1,
          status: 10,
          companyId: 1,
          companyName:'亚信',
          contractItemId: 1,
          fundId: 1,
          paymentTerm: '按时间',
          paymentAmount: 9740.00,
          paymentPercent: 0.57,
          paymentName: '福利',
          paymentNameId: 1,
          paymentPhrases: '第一阶段',
          paymentPhrasesId: 1,
          projectId: 1,
          projectNo: 1,
          projectName:'除草',
          contractId: 1,
          contractNo: 1,
          contractName: '公益事业',
          contractCurrency: 'CNY',
          contractAmount: 27600.00,
          custId: 1,
          custName: '神',
          arDate: '2017-11-09',
          arGlDate: '2017-11-09',
          assessTaxIncludedAmount: 14.89,
          reportDate: '2017-11-09',
          billedArAmount: 130.00,
          billedArDate: '2017-11-09',
          glDate:'2017-11-09',
          remark: '测试',
          revenueAmount: 0,
          transPaFlag: 'N',
          transPaRemark: '',
          transGlFlag:'N',
          transGlRemark: '',
          arAccountantApproveStatus: 1,
          arAccountantApproveDate: '2017-11-09',
          arAccountantApproveBy:'神',
          arAccountantApproveMessage: '测试',
          creationDate: '2017-11-09',
          createdBy: '神',
          statusDesc:'测试',
          reminder: '测试'
        },
        {
          billedArId: 2,
          status: 10,
          companyId: 1,
          companyName:'亚信',
          contractItemId: 1,
          fundId: 1,
          paymentTerm: '按时间',
          paymentAmount: 9740.00,
          paymentPercent: 0.57,
          paymentName: '福利',
          paymentNameId: 1,
          paymentPhrases: '第一阶段',
          paymentPhrasesId: 1,
          projectId: 1,
          projectNo: 1,
          projectName:'除草',
          contractId: 1,
          contractNo: 1,
          contractName: '公益事业',
          contractCurrency: 'CNY',
          contractAmount: 27600.00,
          custId: 1,
          custName: '神',
          arDate: '2017-11-09',
          arGlDate: '2017-11-09',
          assessTaxIncludedAmount: 14.89,
          reportDate: '2017-11-09',
          billedArAmount: 130.00,
          billedArDate: '2017-11-09',
          glDate:'2017-11-09',
          remark: '测试',
          revenueAmount: 0,
          transPaFlag: 'N',
          transPaRemark: '',
          transGlFlag:'N',
          transGlRemark: '',
          arAccountantApproveStatus: 1,
          arAccountantApproveDate: '2017-11-09',
          arAccountantApproveBy:'神',
          arAccountantApproveMessage: '测试',
          creationDate: '2017-11-09',
          createdBy: '神',
          statusDesc:'测试',
          reminder: '测试'
        },
      ];
      result.forEach(o=>{
        o.key=o.billedArId;
        o.statusShow = transformStatus(o.status);
        o.transPaFlagShow = o.transPaFlag==='Y' ? '已传送PA' : '未传送PA';
        o.transGlFlagShow = o.transGlFlag==='Y' ? '已传送GL' : '未传送GL';
      })
      break;
    default:
      // nothing
  }
  return {
    pageNo,
    pageSize,
    count,
    result
  }
}
