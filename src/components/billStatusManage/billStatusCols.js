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
    title: '付款条件',
    dataIndex: 'paymentTerm',
    width: 100,
  },
  {
    title: '付款条款',
    dataIndex: 'paymentName',
    width: 100,
  },
  {
    title: '付款阶段',
    dataIndex: 'paymentPhrases',
    width: 100,
  },
  {
    title: '付款金额',
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
    width: 100,
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
  },
  {
    title: '开票税额',
    dataIndex: 'billingTaxAmount',
    width: 100,
    render: (text, record, index) => (text ? currency(text) : text),
  },
]



export {
  billApproveItemColumns,
  billApproveInfoColumns
}
