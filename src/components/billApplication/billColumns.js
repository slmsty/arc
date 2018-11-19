import currency from '../../util/currency'
import { toThousands }  from '../../util/currency'

const clientCols = [{
  title: '客户名称',
  dataIndex: 'custName',
  width: 200,
}, {
  title: '地址电话',
  dataIndex: 'addressPhoneNumber',
  width: 250,
}, {
  title: '纳税银行账户信息',
  dataIndex: 'bankBankAccount',
  width: 250,
}]

const provinceCols = [{
  title: '省份',
  dataIndex: 'provinceName',
  width: 200,
}]

const comCols = [{
  title: '公司名称',
  dataIndex: 'comName',
  width: 200,
}, {
  title: '公司编号',
  dataIndex: 'comId',
  width: 200,
}, {
  title: '纳税银行账户信息',
  dataIndex: 'bankBankAccount',
  width: 250,
}]

const proCols = [{
  title: '项目编码',
  dataIndex: 'tempProjectNo',
  width: 100,
}, {
  title: '项目名称',
  dataIndex: 'tempProjectName',
  width: 100,
},{
  title: 'BUNo',
  dataIndex: 'sbuNo',
  width: 100,
},{
  title: 'BU名称',
  dataIndex: 'sbuName',
  width: 100,
},{
  title: '成本中心No',
  dataIndex: 'costcenterNo',
  width: 100,
},{
  title: '成本中心名称',
  dataIndex: 'costcenterName',
  width: 100,
}]

const invoiceCols = [{
  title: '发票编号',
  dataIndex: 'invoiceNumber',
  width: 100,
}, {
  title: '客户名称',
  dataIndex: 'custName',
  width: 100,
}, {
  title: '开票金额',
  dataIndex: 'taxIncludeAmount',
  width: 60,
  render: (text) => (toThousands(parseFloat(text)))
}, {
  title: '开票税率',
  dataIndex: 'taxRate',
  width: 50,
  render: (text) => (`${text * 100}%`)
}, {
  title: '开票税额',
  dataIndex: 'taxAmount',
  width: 50,
}]

const contentCols = [{
  title: '内容名称',
  dataIndex: 'billingContentName',
  width: 100,
}, {
  title: '税收分类编码',
  dataIndex: 'taxCategoryCode',
  width: 100,
}, {
  title: '税收分类名称',
  dataIndex: 'taxCategoryName',
  width: 100,
}, {
  title: '优惠政策',
  dataIndex: 'prefPolicySign',
  width: 100,
  render: (text) => {
    return text === '0' ? '否' : '是'
  }
}]

const contentOnlyCols = [{
  title: '内容名称',
  dataIndex: 'billingContentName',
  width: 100,
}]

const totalColumns = [
  {
    title: '',
    dataIndex: 'title',
    width: 80,
  }, {
    title: '税率',
    dataIndex: 'taxRate',
    width: 150,
    render: (text, record) => {
      return record.taxRate ? `${parseInt((record.taxRate) * 100)}%` : ''
    }
  }, {
    title: '税额',
    dataIndex: 'tax',
    width: 150,
    render: (text) => (toThousands(parseFloat(text)))
  }
]

const detailColumns = [{
  title: '',
  dataIndex: 'title',
  width: 50,
}, {
  title: '客户名称',
  dataIndex: 'customerName',
  width: 150,
}, {
  title: '纳税人识别码',
  dataIndex: 'taxPayer',
  width: 100,
}, {
  title: '地址电话',
  dataIndex: 'address',
  width: 200,
}, {
  title: '开户行及账号',
  dataIndex: 'bankAccount',
  width: 180,
}]

const proColumns = [{
  title: '项目编码',
  dataIndex: 'projectCode',
  width: 120,
}, {
  title: '签约公司',
  dataIndex: 'company',
  width: 240,
}, {
  title: '合同编码',
  dataIndex: 'contractCode',
  width: 300,
}, {
  title: '提前开票原因',
  dataIndex: 'advanceBillingReasonName',
  width: 300,
}, {
  title: '预计回款日期',
  dataIndex: 'receiptReturnDate',
  width: 150,
}, {
  title: '付款条件',
  dataIndex: 'paymentTerm',
  width: 200,
}, {
  title: '款项名称',
  dataIndex: 'paymentName',
  width: 150,
}, {
  title: '付款阶段',
  dataIndex: 'paymentPhrases',
  width: 150,
}, {
  title: '款项金额',
  dataIndex: 'paymentAmount',
  width: 100,
  render: (text) => text ? (toThousands(parseFloat(text))) : ''
}, {
  title: '已申请金额',
  dataIndex: 'applyIngAmount',
  width: 100,
  render: (text) => text ? (toThousands(parseFloat(text))) : ''
}, {
  title: '已开票金额',
  dataIndex: 'outcomeAmount',
  width: 100,
  render: (text) => text ? (toThousands(parseFloat(text))) : ''
}]

const proApplyColumns = [{
  title: '项目编码',
  dataIndex: 'projectCode',
  width: 120,
}, {
  title: '签约公司',
  dataIndex: 'company',
  width: 240,
}, {
  title: '合同编码',
  dataIndex: 'contractCode',
  width: 300,
}, {
  title: '提前开票原因',
  dataIndex: 'advanceBillingReasonName',
  width: 300,
}, {
  title: '预计回款日期',
  dataIndex: 'receiptReturnDate',
  width: 150,
}, {
  title: '付款条件',
  dataIndex: 'paymentTerm',
  width: 200,
}, {
  title: '款项名称',
  dataIndex: 'paymentName',
  width: 150,
}, {
  title: '付款阶段',
  dataIndex: 'paymentPhrases',
  width: 150,
}, {
  title: '款项金额',
  dataIndex: 'paymentAmount',
  width: 100,
  render: (text) => text ? (toThousands(parseFloat(text))) : ''
}, {
  title: '已申请金额',
  dataIndex: 'applyIngAmount',
  width: 100,
  render: (text) => text ? (toThousands(parseFloat(text))) : ''
}, {
  title: '已开票金额',
  dataIndex: 'outcomeAmount',
  width: 100,
  render: (text) => text ? (toThousands(parseFloat(text))) : ''
}]

const billDetailColumns = [{
  title: '发票号码',
  dataIndex: 'invoiceNumber',
  width: 100,
}, {
  title: '签约公司',
  dataIndex: 'invoiceCompany',
  width: 250,
}, {
  title: '开票客户名称',
  dataIndex: 'invoiceCustomer',
  width: 250,
}, {
  title: '发票类型',
  dataIndex: 'invoiceTypeName',
  width: 250,
}, {
  title: '发票代码',
  dataIndex: 'invoiceCode',
  width: 250,
}, {
  title: '开票日期',
  dataIndex: 'invoiceDate',
  width: 250,
}, {
  title: '含税金额',
  dataIndex: 'taxIncludeAmount',
  width: 250,
  render: (text) => text ? (toThousands(parseFloat(text))) : ''
}, {
  title: '税率',
  dataIndex: 'taxRate',
  width: 250,
  render: (text) => (typeof text !== 'undefined' ? (`${text * 100}%`) : '')
}, {
  title: '不含税金额',
  dataIndex: 'taxExcludeAmount',
  width: 250,
  render: (text, record) => {
    return toThousands(record.taxExcludeAmount)
  }
}]

const taxCategoryCols = [{
  title: '税收分类编码',
  dataIndex: 'taxCategoryCode',
  width: 200,
}, {
  title: '税收分类名称',
  dataIndex: 'taxCategoryName',
  width: 200,
}, {
  title: '优惠政策',
  dataIndex: 'prefPolicySign',
  width: 200,
  render: (text) => {
    return text === '0' ? '否' : '是'
  }
}, {
  title: '优惠政策类型',
  dataIndex: 'prefPolicyType',
  width: 200,
}]

const redFontCols = [
  {
    title: '开票申请类别',
    dataIndex: 'billingApplicationTypeName',
    width: 100,
    fixed: 'left',
  }, {
    title: '发票号',
    dataIndex: 'invoiceNumber',
    width: 150,
    fixed: 'left',
  }, {
    title: '开票金额',
    dataIndex: 'taxIncludeAmount',
    width: 100,
    render: (text) => text ? (toThousands(parseFloat(text))) : ''
  }, {
    title: '开票税额',
    dataIndex: 'taxAmount',
    width: 100,
    render: (text) => text ? (toThousands(parseFloat(text))) : ''
  }, /*{
    title: '开票税率',
    dataIndex: 'taxRate',
    width: 80,
    render: (text) => {
      return `${text * 100}%`
    }
  }, */{
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 200,
  }, {
    title: '签约公司',
    dataIndex: 'comName',
    width: 250,
  }, {
    title: '合同编码',
    dataIndex: 'contractNo',
    width: 200,
  }, {
    title: '客户名称',
    dataIndex: 'custName',
    width: 250,
  }, {
    title: '款项名称',
    dataIndex: 'paymentName',
    width: 150,
  }, {
    title: '付款阶段',
    dataIndex: 'paymentPhrases',
    width: 150,
  }, {
    title: '款项金额',
    dataIndex: 'paymentAmount',
    width: 120,
    render: (text) => text ? (toThousands(parseFloat(text))) : ''
  }
]

const invoiceLineCols = [{
  title: '组号',
  dataIndex: 'groupNo',
  width: 50,
  fixed: 'left',
}, {
  title: '开票内容',
  dataIndex: 'billingContent',
  width: 350,
}, {
  title: '规格型号',
  dataIndex: 'specificationType',
  width: 90,
}, {
  title: '单位',
  dataIndex: 'unit',
  width: 70,
}, {
  title: '数量',
  dataIndex: 'quantity',
  width: 70,
}, {
  title: '单价',
  dataIndex: 'unitPrice',
  width: 120,
}, {
  title: '不含税金额',
  dataIndex: 'billingAmountExcludeTax',
  width: 120,
}, {
  title: '含税金额',
  dataIndex: 'billingAmount',
  width: 120,
}, {
  title: '税率',
  dataIndex: 'billingTaxRate',
  width: 80,
  render: (text) => typeof text !== 'undefined' ? (`${text * 100}%`) : ''
}, {
  title: '税额',
  dataIndex: 'billingTaxAmount',
  width: 120,
}, {
  title: '税收分类编码',
  dataIndex: 'taxCategoryCode',
  width: 160,
}, {
  title: '税收分类名称',
  dataIndex: 'taxCategoryName',
  width: 120,
}, {
  title: '优惠政策',
  dataIndex: 'prefPolicySign',
  width: 80,
  render: (text) => {
    if(text === '0') {
      return '否'
    } else if (text === '1') {
      return '是'
    } else {
      return ''
    }
  }
}, {
  title: '优惠政策类型',
  dataIndex: 'prefPolicyType',
  width: 100,
}]

const contentDetailCols = [{
  title: '内容名称',
  dataIndex: 'billingContentName',
  width: 200,
}, {
  title: '内容',
  dataIndex: 'billingRecordId',
  width: 200,
}]

const contractApproveCols = [
  {
    title: '合同流水号',
    dataIndex: 'contractApprovalNo',
    width: 200,
  }, {
    title: '合同类型',
    dataIndex: 'isContractedName',
    width: 150,
  }, {
    title: '状态',
    dataIndex: 'approvalStatusName',
    width: 100,
  }, {
    title: '公司名',
    dataIndex: 'comName',
    width: 200,
  }, {
    title: '客户名',
    dataIndex: 'custName',
    width: 200,
  }, {
    title: '币种',
    dataIndex: 'contractCurrency',
    width: 100,
  }, {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 200,
  }, {
    title: '预测流水号',
    dataIndex: 'forecastNo',
    width: 150,
  }
]

const normalTypes = ['BILLING_NORMAL', 'BILLING_CONTRACT', 'BILLING_EXCESS']
const advanceTypes = ['BILLING_UN_CONTRACT']
const redTypes = ['BILLING_RED', 'BILLING_RED_OTHER']
const otherTypes = ['BILLING_OTHER']
const hideContractUrl = ['BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT', 'BILLING_OTHER', 'BILLING_RED_OTHER', 'BAD_DEBT']
const receiveInvoice = {
  'Y': '是',
  'N': '否',
  'B': '无需收票',
}
const pageSizeOptions = ['10', '20', '30', '40', '50']
export {
  clientCols,
  comCols,
  proCols,
  contentCols,
  contentOnlyCols,
  totalColumns,
  detailColumns,
  invoiceCols,
  proColumns,
  billDetailColumns,
  taxCategoryCols,
  redFontCols,
  normalTypes,
  advanceTypes,
  redTypes,
  otherTypes,
  invoiceLineCols,
  contentDetailCols,
  proApplyColumns,
  provinceCols,
  contractApproveCols,
  hideContractUrl,
  receiveInvoice,
  pageSizeOptions
}

