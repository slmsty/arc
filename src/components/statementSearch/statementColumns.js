import currency, { toThousands } from '../../util/currency'
import './statement.css'
//收款信息查询表
const reciptMoneyInfoCols = [{
  title: '签约公司',
  dataIndex: 'signCompany',
  width: 150,
  }, {
    title: '项目编号',
    dataIndex: 'projectNo',
    width: 120,
  }, {
    title: '节点',
    dataIndex: 'projectNode',
    width: 100,
  }, {
    title: '付款百分比',
    dataIndex: 'paymentPercent',
    width: 100,
    render: (text, record) => (
      text !== '' || typeof record.paymentPercent !== 'undefined' ? text+'%' : ''
    )
  }, {
    title: '付款条款',
    dataIndex: 'paymentName',
    width: 100,
  }, {
    title: '款项ID',
    dataIndex: 'fundId',
    width: 100,
  }, {
    title: '收款币种',
    dataIndex: 'receiptCurrency',
    width: 80,
  }, {
    title: '应收金额',
    dataIndex: 'billedArAmount',
    width: 100,
    align:'right',
    className:'right',
    render: (text) => (text ? toThousands(text) : 0)
  }, {
    title: 'GL日期',
    dataIndex: 'glDate',
    width: 100,
  },
  {
    title: '收款日期',
    dataIndex: 'receiptDate',
    width: 100,
  },
  {
    title: '收款编号',
    dataIndex: 'receiptNo',
    width: 120,
  }, {
    title: '收款金额',
    dataIndex: 'claimAmount',
    width: 100,
    align:'right',
    className:'right',
    render: (text,record) => (text ? toThousands(record.claimAmount) : 0)
  }, {
    title: '收款比例',
    dataIndex: 'receiptRate',
    width: 100,
    render: (text,record) => (text ? `${record.receiptRate.toFixed(2)}%` : '')
  }, {
    title: '客户名称',
    dataIndex: 'custName',
    width: 200,
  }, {
    title: '合同内部编码',
    dataIndex: 'contractId',
    width: 200,
  }, {
    title: '合同编码',
    dataIndex: 'contractNo',
    width: 200,
  }, {
    title: '合同总金额',
    dataIndex: 'contractAmount',
    width: 100,
    render: (text,record) => (typeof record.contractAmount !== 'undefined'? toThousands(record.contractAmount) : '')
  }, {
    title: '立项BU',
    dataIndex: 'buName',
    width: 100,
  }, {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 300,
  }, {
    title: '已开票金额',
    dataIndex: 'taxIncludeAmount',
    width: 100,
    align:'right',
    className:'right',
    render: (text, record) => (text ? toThousands(record.taxIncludeAmount) : 0)
  }, {
    title: '数据状态',
    dataIndex: 'status',
    width: 100,
  }, {
    title: '客户付款方式',
    dataIndex: 'paymentMethod',
    width: 100,
  }, {
    title: '解付日期',
    dataIndex: 'paymentDate',
    width: 100,
  }, {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
  },
]

const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  return obj;
};

const parentRenderContent = (value, row, index) => {
  return {
    children: value,
    props: {
      rowSpan: row.isRowSpan ? row.rowSpan : 0,
    },
  };
}

//发票信息查询表
const billInfocomCols = [{
    title: '签约公司',
    dataIndex: 'comName',
    width: 240,
    render: (value, row, index) => {
      return {
        children: `${row.comId}_${row.comName}`,
        props: {
          rowSpan: row.isRowSpan ? row.rowSpan : 0,
        },
      };
    },
  },{
    title: '客户名称',
    dataIndex: 'custName',
    width: 240,
    render: parentRenderContent,
  },{
    title: '合同编码',
    dataIndex: 'contractNo',
    width: 240,
    render: parentRenderContent,
  },{
    title: '合同名称',
    dataIndex: 'contractName',
    width: 240,
    render: parentRenderContent,
  }, {
    title: '项目经理',
    dataIndex: 'projectManager',
    width: 100,
    render: parentRenderContent,
}, {
    title: '项目编号',
    dataIndex: 'projectNo',
    width: 200,
    render: parentRenderContent,
}, {
    title: '付款条款',
    dataIndex: 'paymentName',
    width: 100,
    render: parentRenderContent,
}, {
    title: '付款百分比',
    dataIndex: 'paymentPercent',
    width: 100,
    render: (text, row, index) => {
      return {
        children: row.paymentPercent !== '' && typeof row.paymentPercent !== 'undefined' ? row.paymentPercent+'%' : '',
        props: {
          rowSpan: row.isRowSpan ? row.rowSpan : 0,
        },
      };
    },
  }, {
    title: '应收金额',
    dataIndex: 'billedArAmount',
    width: 100,
    render: (text, row, index) => {
      return {
        children: typeof text !== 'undefined' ? toThousands(row.billedArAmount) : 0,
        props: {
          rowSpan: row.isRowSpan ? row.rowSpan : 0,
        },
      };
    },
  }, {
    title: '销售经理',
    dataIndex: 'salesManager',
    width: 100,
    render: parentRenderContent,
  }, {
    title: '立项部门',
    dataIndex: 'deptNo',
    width: 80,
    render: parentRenderContent,
  }, {
    title: '立项BU',
    dataIndex: 'sbuName',
    width: 100,
    render: parentRenderContent,
  }, {
    title:'条款金额',
    dataIndex:'paymentAmount',
    width:100,
    render: (text, row, index) => {
      return {
        children: typeof text !== 'undefined' ? toThousands(row.paymentAmount) : '',
        props: {
          rowSpan: row.isRowSpan ? row.rowSpan : 0,
        },
      };
    },
  }, {
    title: '收款金额',
    dataIndex: 'receiptAmount',
    width: 100,
    render: (text, row, index) => {
      return {
        children: typeof text !== 'undefined' ? toThousands(row.receiptAmount) : 0,
        props: {
          rowSpan: row.isRowSpan ? row.rowSpan : 0,
        },
      };
    },
  }, {
    title: '申请开票金额',
    dataIndex: 'applyAmounts',
    width: 100,
    render: (text, row, index) => {
      return {
        children: typeof text !== 'undefined' ? row.applyAmounts.map(item => toThousands(item)).join(' \n ') : '',
        props: {
          rowSpan: row.amountIsSpan ? row.amountSpan : 0,
        },
      };
    },
  }, {
    title: '开票日期',
    dataIndex: 'billingDate',
    width: 140,
    render: renderContent,
  }, {
    title: '申请人',
    dataIndex: 'applyPerson',
    width: 140,
    render: renderContent,
  }, {
    title: '发票号',
    dataIndex: 'invoiceNumber',
    width: 100,
    render: renderContent,
  },{
    title: '开票金额',
    dataIndex: 'taxIncludeAmount',
    width: 100,
    render: (text, record, index) => {
      return {
        children: typeof text !== 'undefined' ? toThousands(record.taxIncludeAmount) : '',
        props: {},
      };
    }
  }, {
    title: '开票类型',
    dataIndex: 'invoiceType',
    width: 80,
    render: renderContent,
}, {
    title: '开票不含税金额',
    dataIndex: 'taxExcludeAmount',
    width: 80,
    render: renderContent,
  },  {
    title: '开票销项税额',
    dataIndex: 'taxAmount',
    width: 80,
    render: renderContent,
  }, {
    title: '税率',
    dataIndex: 'billingTaxRate',
    width: 100,
    render: renderContent,
}, {
    title: '优惠政策类型',
    dataIndex: 'prefPolicyType',
    width: 100,
    render: renderContent,
  }, {
    title: '发票状态',
    dataIndex: 'invoiceStatus',
    width: 100,
    render: renderContent,
  }, {
    title: '发票内容',
    dataIndex: 'billingContent',
    width: 300,
    render: renderContent,
  },{
    title: '发票备注',
    dataIndex: 'billingRemark',
    width: 100,
    render: renderContent,
  }
]
//发票及收款信息查询表
const billAndReciptMoneyCols = [{
  title: '签约公司',
  dataIndex: 'signCompany',
  width: 100,
}, {
  title: '项目编号',
  dataIndex: 'projectNo',
  width: 250,
}, {
  title: '节点',
  dataIndex: 'node',
  width: 100,
},
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    width: 150,
  },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 150,
  },
  {
    title: '付款百分比',
    dataIndex: 'payParam',
    width: 100,
    render: (text, record, index) => (
      text !== '' || typeof record.paymentPercent !== 'undefined' ? text+'%' : ''
    )
  },
  {
    title: '付款条款',
    dataIndex: 'payParamItem',
    width: 100,
  }, {
    title: '币种',
    dataIndex: 'currency',
    width: 80,
  }, {
    title: '应收金额',
    dataIndex: 'shouldReciptMoney',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.shouldReciptMoney) : '')
  },
  {
    title: '应收余额',
    dataIndex: 'shouldReciptRemianMoney',
    width: 100,
    render: (text, record) => (typeof text !== 'undefined' ? toThousands(record.shouldReciptRemianMoney) : '')
  },
  {
    title: '收款日期',
    dataIndex: 'reciptDate',
    width: 120,
  },
  {
    title: '收款编号',
    dataIndex: 'reciptNo',
    width: 80,
  },
  {
    title: '收款金额',
    dataIndex: 'reciptMoney',
    width: 100,
    render: (text, record) => (typeof text !== 'undefined' ? toThousands(record.reciptMoney) : '')
  },
  {
    title: '开票日期',
    dataIndex: 'billDate',
    width: 120,
  },
  {
    title: '开票金额',
    dataIndex: 'billMoney',
    width: 100,
    render: (text, record) => (typeof text !== 'undefined' ? toThousands(record.billMoney) : '')
  },
  {
    title: '发票号',
    dataIndex: 'billNo',
    width: 80,
  },
  {
    title: '扣款',
    dataIndex: 'deductMmoney',
    width: 100,
    render: (text, record) => (typeof text !== 'undefined' ? toThousands(record.deductMmoney) : '')
  },
  {
    title: '坏账划销',
    dataIndex: 'badBill',
    width: 100,
  },
  {
    title: '其他',
    dataIndex: 'other',
    width: 200,
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
    width: 200,
  },
  {
    title: '立项BU',
    dataIndex: 'projectBU',
    width: 100,
  },
]
// 应收账款询证函报表
const shouldReciptCols = [{
  title: '客户名称',
  dataIndex: 'constomerName',
  width: 200,
}, {
  title: '项目编号',
  dataIndex: 'projectNo',
  width: 100,
}, {
  title: '合同名称',
  dataIndex: 'contractName',
  width: 200,
},
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    width: 150,
  },
  {
    title: '合同总额',
    dataIndex: 'contractAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.contractAmount) : '')
  },
  {
    title: '考核金额',
    dataIndex: 'assessmentAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.assessmentAmount) : '')
  },
  {
    title: '坏账',
    dataIndex: 'badAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.badAmount) : '')
  },
  {
    title: '其它（调尾差）',
    dataIndex: 'otherAmount',
    width: 130,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.otherAmount) : '')
  },
  {
    title: '收款金额合计',
    dataIndex: 'receiptClaimAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.receiptClaimAmount) : '')
  },
  {
    title: '开票金额',
    dataIndex: 'billingAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.billingAmount) : '')
  },
  {
    title: '已开票未回款金额',
    dataIndex: 'invoicedNotReturnAmount',
    width: 130,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.invoicedNotReturnAmount) : '')
  },
]
// 项目综合信息查询报表
const projectTotalCols = [{
  title: '签约公司',
  dataIndex: 'signCompany',
  width: 200,
}, {
  title: '项目编码',
  dataIndex: 'projectNo',
  width: 100,
}, {
  title: '项目名称',
  dataIndex: 'projectName',
  width: 200,
}, {
  title: '节点',
  dataIndex: 'projectNode',
  width: 80,
},
  {
    title: '合同号',
    dataIndex: 'contractNo',
    width: 120,
  },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 200,
  },
  {
    title: '客户名称',
    dataIndex: 'custName',
    width: 200,
  },
  {
    title: '签约时间',
    dataIndex: 'signDate',
    width: 120,
  },
  {
    title: '币种',
    dataIndex: 'currency',
    width: 80,
  },
  {
    title: '合同总额',
    dataIndex: 'contarctAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.contarctAmount) : '')
  },
  {
    title: '扣款金额',
    dataIndex: 'remainMoeny1',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.remainMoeny1) : '')
  },
  {
    title: '累计应收账款',
    dataIndex: 'receivableAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.receivableAmount) : '')
  },
  {
    title: '应收账款余额',
    dataIndex: 'receivableAmountLeft',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.receivableAmountLeft) : '')
  },
  {
    title: '累计已收账款',
    dataIndex: 'receiptAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.receiptAmount) : '')
  },
  {
    title: '收款比例',
    dataIndex: 'rate',
    width: 80,
  },
  {
    title: '累计已开票金额',
    dataIndex: 'billingAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? currency(record.billingAmount) : '')
  },
  {
    title: '未开票金额',
    dataIndex: 'notInvoicedAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? currency(record.notInvoicedAmount) : '')
  },
  {
    title: 'BU',
    dataIndex: 'bu',
    width: 80,
  },
  {
    title: '项目经理',
    dataIndex: 'projectManager',
    width: 80,
  },
]
// 整体合同内容查询
const totalContractContentColumns = [
  {
    title: '项目编号',
    dataIndex: 'projectNo',
    width: 100,
  }, {
    title: '合同编号',
    dataIndex: 'contractNo',
    width: 150,
  }, {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 200,
  },
  {
    title: '签约日期',
    dataIndex: 'signDate',
    width: 120,
  },
  {
    title: '签约公司',
    dataIndex: 'signCompany',
    width: 200,
  },
  {
    title: '客户名称',
    dataIndex: 'custName',
    width: 200,
  },
  {
    title: '签约部门',
    dataIndex: 'siginBu',
    width: 100,
  },
  {
    title: '立项部门',
    dataIndex: 'projectBu',
    width: 100,
  },
  {
    title: '立项区域',
    dataIndex: 'projectAr',
    width: 100,
  },
  {
    title: '销售经理',
    dataIndex: 'salesManager',
    width: 100,
  },
  {
    title: '项目经理',
    dataIndex: 'projectManager',
    width: 100,
  },
  {
    title: '币种',
    dataIndex: 'currency',
    width: 80,
  },
  {
    title: '合同总额',
    dataIndex: 'contarctAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.contarctAmount) : '')
  },
  {
    title: 'BILLED AR',
    dataIndex: 'billedAr',
    width: 80,
  },
  {
    title: '累计开票金额',
    dataIndex: 'totalBillMoney',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.totalBillMoney) : '')
  },
  {
    title: '已回款总额',
    dataIndex: 'totalReciptMoney1',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.totalReciptMoney1) : '')
  },
]
// 转包项目表
const turnProColumns = [{
  title: '签约公司',
  dataIndex: 'siginCommey',
  width: 200,
}, {
  title: '合同名称',
  dataIndex: 'contractName',
  width: 200,
}, {
  title: '合同号',
  dataIndex: 'contractNo',
  width: 100,
}, {
  title: '项目编码',
  dataIndex: 'projectNo',
  width: 100,
}, {
  title: '节点',
  dataIndex: 'node',
  width: 80,
},
  {
    title: '付款百分比',
    dataIndex: 'payParam',
    width: 100,
    render: (text, record) => (
      text !== '' || typeof record.payParam !== 'undefined' ? text+'%' : ''
    )
  },
  {
    title: '付款条款',
    dataIndex: 'payParamItem',
    width: 100,
  },
  {
    title: '币种',
    dataIndex: 'currency',
    width: 80,
  },
  {
    title: '应收金额',
    dataIndex: 'shouldReciptMoney',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.shouldReciptMoney) : '')
  },
  {
    title: '收款日期',
    dataIndex: 'reciptDate',
    width: 120,
  },
  {
    title: '收款金额',
    dataIndex: 'reciptMoney',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.reciptMoney) : '')
  },
  {
    title: '客户名称',
    dataIndex: 'constromerName',
    width: 200,
  },
  {
    title: '开票日期',
    dataIndex: 'billDate',
    width: 120,
  },
  {
    title: '开票金额',
    dataIndex: 'billedMoney',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.billedMoney) : '')
  },
  {
    title: '发票号',
    dataIndex: 'billNo',
    width: 80,
  },
  {
    title: '签约公司',
    dataIndex: 'siginCompany',
    width: 200,
  },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 200,
  },
  {
    title: '合同号',
    dataIndex: 'contractNo',
    width: 100,
  },
  {
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 100,
  },
  {
    title: '节点',
    dataIndex: 'node',
    width: 80,
  },
  {
    title: '付款百分比',
    dataIndex: 'payParam',
    width: 80,
    render: (text, record) => (
      text !== '' || typeof record.payParam !== 'undefined' ? text+'%' : ''
    )
  },
  {
    title: '付款条款',
    dataIndex: 'payParamItem',
    width: 100,
  },
  {
    title: '币种',
    dataIndex: 'currency',
    width: 80,
  },
  {
    title: '应收金额',
    dataIndex: 'shouldReciptMoney',
    width: 100,
    render: (text, record) => (typeof text !== 'undefined' ? toThousands(record.shouldReciptMoney) : '')
  },
  {
    title: '收款日期',
    dataIndex: 'reciptDate',
    width: 120,
  },
  {
    title: '收款金额',
    dataIndex: 'reciptMoney',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.reciptMoney) : '')
  },
]
// 合同拆分查询表
const constructSplitSearchColumns = [{
  title: '签约公司',
  dataIndex: 'signCompany',
  width: 200,
}, {
  title: '签约日期',
  dataIndex: 'signDate',
  width: 80,
}, {
  title: '合同名称',
  dataIndex: 'contractName',
  width: 400,
}, {
  title: '合同编码',
  dataIndex: 'contractNo',
  width: 150,
}, {
  title: '立项BU',
  dataIndex: 'bu',
  width: 120,
},
  {
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 100,
  },
  {
    title: '合同税率',
    dataIndex: 'contractTaxRate',
    width: 70,
    render: (text) => (typeof text !== 'undefined' ? `${text * 100}%` : '')
  },
  {
    title: '退税率',
    dataIndex: 'returnTaxRate',
    width: 60,
    render: (text) => (typeof text !== 'undefined' ? `${text * 100}%` : '')
  },
  {
    title: 'Task',
    dataIndex: 'contractCategory',
    width: 100,
  },
  {
    title: '合同额',
    dataIndex: 'contractAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.contractAmount) : '')
  },
  {
    title: 'Funding',
    dataIndex: 'funding',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.funding) : '')
  },
  {
    title: ' Gross Order',
    dataIndex: 'grossOrder',
    width: 120,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.grossOrder) : '')
  },
  {
    title: '结算方式',
    dataIndex: 'revenueCheckout',
    width: 70,
  },
  {
    title: '保修期开始时间',
    dataIndex: 'maintainStartDate',
    width: 110,
  },
  {
    title: '软件解决方案保修期',
    dataIndex: 'solutionMaintain',
    width: 140,
  },
  {
    title: '服务期起始',
    dataIndex: 'serviceStartDate',
    width: 80,
  },
  {
    title: '服务期结束',
    dataIndex: 'serviceEndDate',
    width: 80,
  },
  {
    title: '客户名称',
    dataIndex: 'custName',
    width: 150,
  },
  {
    title: '是否集采',
    dataIndex: 'collectionProject',
    width: 80,
  },
  {
    title: '是否拆分',
    dataIndex: 'isProdect',
    width: 80,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 80,
  },
]

// 发票明细数据表
const billInfoCols = [
  {
    title:'签约公司',
    dataIndex: 'signCompany',
    width: 240,
  },
  {
    title:'开票日期',
    dataIndex: 'billingDate',
    width: 100,
  },
  {
    title:'申请人',
    dataIndex: 'applyPersonName',
    width: 100,
  },
  {
    title:'发票号',
    dataIndex: 'invoiceNumber',
    width: 160,
  },
  {
    title:'合同编码',
    dataIndex: 'contractNo',
    width: 200,
  },
  {
    title:'项目编码',
    dataIndex: 'projectNo',
    width: 100,
  },
  {
    title:'项目立项部门',
    dataIndex: 'projectDept',
    width: 180,
  },
  {
    title:'项目立项BU',
    dataIndex: 'projectBu',
    width: 180,
  },
  {
    title:'客户名称',
    dataIndex: 'custName',
    width: 240,
  },
  {
    title:'开票内容',
    dataIndex: 'billingContent',
    width: 200,
  },
  {
    title:'开票阶段',
    dataIndex: 'billingPhase',
    width: 120,
  },
  {
    title:'含税金额',
    dataIndex: 'taxIncludeAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.taxIncludeAmount) : '')
  },
  {
    title:'除税金额',
    dataIndex: 'taxExcludeAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.taxExcludeAmount) : '')
  },
  {
    title:'销项税',
    dataIndex: 'tax',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.tax) : '')
  },
  {
    title:'备注',
    dataIndex: 'remark',
    width: 250,
  },
  {
    title:'发票类型',
    dataIndex: 'invoiceType',
    width: 100,
  },
  {
    title:'发票税率',
    dataIndex: 'billingTaxRate',
    width: 100,
  },
]
// 发票汇总数据
const outcomeTotalReportCols = [
  {
    title:'项目编码',
    dataIndex: 'projectNo',
    width: 100,
  },
  {
    title:'项目立项部门',
    dataIndex: 'projectDept',
    width: 100,
  },
  {
    title:'项目立项BU',
    dataIndex: 'projectBu',
    width: 100,
  },
  {
    title:'当月开票含税金额',
    dataIndex: 'taxIncludeAmountMonth',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.taxIncludeAmountMonth) : '')
  },
  {
    title:'当月开票不含税金额',
    dataIndex: 'taxExcludeAmountMonth',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.taxExcludeAmountMonth) : '')
  },
  {
    title:'销项税',
    dataIndex: 'tax',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.tax) : '')
  },{
    title:'累计开票含税金额',
    dataIndex: ' taxIncludeAmountTotal',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.taxIncludeAmountTotal) : '')
  },
  {
    title:'累计开票不含税金额',
    dataIndex: ' taxExcludeAmountTotal',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.taxExcludeAmountTotal) : '')
  },
  {
    title:'累计销项税',
    dataIndex: ' taxTotal',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.taxTotal) : '')
  },
  {
    title:'发票类型',
    dataIndex: 'invoiceType',
    width: 100,
  },
  {
    title:'开票税率',
    dataIndex: 'billingTaxRate',
    width: 100,
  },
]

// 未大签提前开票数据补充
const unContractOutcomeDataAddCols = [
  {
    title:'签约公司',
    dataIndex: 'signCompany',
    width: 150,
  },
  {
    title:'发票号',
    dataIndex: 'invoiceNumber',
    width: 100,
  },
  {
    title:'合同编码',
    dataIndex: 'contractNo',
    width: 100,
  },
  {
    title:'项目编码',
    dataIndex: 'projectNo',
    width: 100,
  },
  {
    title:'项目立项部门',
    dataIndex: 'projectDept',
    width: 100,
  },
  {
    title:'项目立项BU',
    dataIndex: 'projectBu',
    width: 100,
  },
  {
    title:'客户名称',
    dataIndex: 'custName',
    width: 100,
  },
  {
    title:'开票内容',
    dataIndex: 'billingContent',
    width: 100,
  },
  {
    title:'开票阶段',
    dataIndex: 'billingPhase',
    width: 100,
  },
  {
    title:'含税金额',
    dataIndex: 'taxIncludeAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.taxIncludeAmount) : '')
  },
  {
    title:'除税金额',
    dataIndex: 'taxExcludeAmount',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.taxExcludeAmount) : '')
  },
  {
    title:'销项税',
    dataIndex: 'tax',
    width: 100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.tax) : '')
  },
  {
    title:'备注',
    dataIndex: 'remark',
    width: 120,
  },
  {
    title:'发票类型',
    dataIndex: 'invoiceType',
    width: 100,
  },
  {
    title:'发票税率',
    dataIndex: 'billingTaxRate',
    width: 100,
  }
]

// 项目order明细
const productOrderDetailCols = [
  {
    title:'合同名称',
    dataIndex:'contractName',
    width:400,
  },
  {
    title:'签约日期',
    dataIndex:'signDate',
    width:100,
  },
  {
    title:'签约公司',
    dataIndex:'signCompany',
    width:200,
  },
  {
    title:'合同编码',
    dataIndex:'contractNo',
    width:300,
  },
  {
    title:'立项BU',
    dataIndex:'projectBu',
    width:130,
  },
  {
    title:'Sale签约BU',
    dataIndex:'salesBu',
    width:130,
  },
  {
    title:'项目代码',
    dataIndex:'projectNo',
    width:100,
  },
  {
    title:'合同总金额',
    dataIndex:'contractAmount',
    width:100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.contractAmount) : '')
  },
  {
    title:'Gross Order',
    dataIndex:'grossOrder',
    width:100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.grossOrder) : '')
  },
  {
    title:'Net Order(L)',
    dataIndex:'netOrderL',
    width:100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.netOrderL) : '')
  },
  {
    title:'Net Order(M)',
    dataIndex:'netOrderM',
    width:100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.netOrderM) :'')
  },
  {
    title:'外购成本预算',
    dataIndex:'orderCost',
    width:100,
    render: (text, record, index) => (typeof text !== 'undefined' ? toThousands(record.orderCost) : '')
  },
]

// 项目Order汇总
const productOrderTotalCols = [
  {
    title:'立项BU',
    dataIndex:'projectBu',
    width:100,
  },
  {
    title:'年度／季度／月度',
    dataIndex:'time',
    width:80,
  },
  {
    title:'税前合同额',
    dataIndex:'contractAmount',
    width:100,
    render: (text, record, index) => (text ? record.contractAmount < 0 ? '-$'+toThousands(Math.abs(text)) : '$'+toThousands(record.contractAmount) : '')
  },
  {
    title:'Gross Order',
    dataIndex:'grossOrder',
    width:100,
    render: (text, record, index) => (text ? record.grossOrder < 0 ? '-$'+toThousands(Math.abs(text)) : '$'+toThousands(record.grossOrder) : '')
  },
  {
    title:'Net Order(L)',
    dataIndex:'netOrderL',
    width:100,
    render: (text, record, index) => (text ? record.netOrderL < 0 ? '-$'+toThousands(Math.abs(text)) : '$'+toThousands(record.netOrderL) : '')
  },
  {
    title:'Net Order(M)',
    dataIndex:'netOrderM',
    width:100,
    render: (text, record, index) => (text ? record.netOrderM < 0 ? '-$'+toThousands(Math.abs(text)) : '$'+toThousands(record.netOrderM) : '')
  },
]


export {
  reciptMoneyInfoCols,
  billInfocomCols,
  billAndReciptMoneyCols,
  shouldReciptCols,
  projectTotalCols,
  totalContractContentColumns,
  turnProColumns,
  constructSplitSearchColumns,
  billInfoCols,
  outcomeTotalReportCols,
  unContractOutcomeDataAddCols,
  productOrderTotalCols,
  productOrderDetailCols
}

