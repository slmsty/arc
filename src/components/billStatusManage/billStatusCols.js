import currency from '../../util/currency'

const billApproveItemColumns = [
  {
    title: '项目编码',
    dataIndex: 'projectCode',
    width: 100,
  },
  {
    title: '签约公司',
    dataIndex: 'company',
    width: 250,
  },
  {
    title: '合同编码',
    dataIndex: 'contractCode',
    width: 300,
  },
  {
    title: '提前开票原因',
    dataIndex: 'advanceBillingReasonName',
    width: 300,
  }, {
    title: '预计回款日期',
    dataIndex: 'receiptReturnDate',
    width: 150,
  },
  {
    title: '付款条件',
    dataIndex: 'paymentTerm',
    width: 100,
  },
  {
    title: '款项名称',
    dataIndex: 'paymentName',
    width: 100,
  },
  {
    title: '付款阶段',
    dataIndex: 'paymentPhrases',
    width: 100,
  },
  {
    title: '款项金额',
    dataIndex: 'paymentAmount',
    width: 100,
    render: (text, record, index) => (text ? currency(text) : text),
  },
  {
    title: 'Billed AR金额',
    dataIndex: 'arAmount',
    width: 100,
    render: (text, record, index) => (text ? currency(text) : text),
  },
  {
    title: '已申请金额',
    dataIndex: 'billingAmount',
    width: 100,
    render: (text, record, index) => (text ? currency(text) : text),
  },
  {
    title: '已开票金额',
    dataIndex: 'invoiceAmount',
    width: 100,
    render: (text, record, index) => (text ? currency(text) : text),
  },
]

const billApproveInfoColumns = [
  {
    title: '开票行号',
    dataIndex: 'lineNo',
    width: 70,
  }, {
    title: '开票内容',
    dataIndex: 'billingContent',
    width: 300,
  },
  {
    title: '规格型号',
    dataIndex: 'specificationType',
    width: 100,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 100,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: 100,
  },
  {
    title: '单价',
    dataIndex: 'unitPrice',
    width: 100,
    render: (text, record, index) => (text ? currency(text) : text),
  },
  {
    title: '开票不含税金额',
    dataIndex: 'billingAmountExcludeTax',
    width: 100,
    render: (text, record, index) => (text ? currency(text) : text),
  },
  {
    title: '开票金额',
    dataIndex: 'billingAmount',
    width: 100,
    render: (text, record, index) => (text ? currency(text) : text),
  },
  {
    title: '开票税率',
    dataIndex: 'billingTaxRate',
    width: 100,
    render: (text) => (`${text * 100}%`)
  },
  {
    title: '开票税额',
    dataIndex: 'billingTaxAmount',
    width: 100,
    render: (text, record, index) => (text ? currency(text) : text),
  },
]
const billingDataInitColumns = [
  {
    title:'数据状态',
    dataIndex:'status',
    width:100
  },
  {
    title:'项目编码',
    dataIndex:'status1',
    width:150
  },
  {
    title:'款项名称',
    dataIndex:'status2',
    width:200
  },
  {
    title:'发票号码',
    dataIndex:'status3',
    width:150
  },
  {
    title:'签约公司',
    dataIndex:'status4',
    width:150
  },
  {
    title:'开票客户名称',
    dataIndex:'status5',
    width:150
  },
  {
    title:'发票类型',
    dataIndex:'status6',
    width:150
  },
  {
    title:'发票代码',
    dataIndex:'status7',
    width:150
  },
  {
    title:'开票日期',
    dataIndex:'status8',
    width:150
  },
  {
    title:'含税金额',
    dataIndex:'status9',
    width:150,
    render: (text, record, index) => (text ? currency(text) : text),
  },
  {
    title:'税率',
    dataIndex:'status10',
    width:150
  },
  {
    title:'不含税金额',
    dataIndex:'status11',
    width:150,
    render: (text, record, index) => (text ? currency(text) : text),
  },
  {
    title:'操作',
    dataIndex:'status12',
    width:100,
    fixed:'right',
    render: (text, record, index) => ('修改'),
  },
]




export {
  billApproveItemColumns,
  billApproveInfoColumns,
  billingDataInitColumns
}
