const clientCols = [{
  title: '客户名称',
  dataIndex: 'custName',
  width: 100,
}, {
  title: '地址电话',
  dataIndex: 'addressPhoneNumber',
  width: 100,
}]

const comCols = [{
  title: '公司名称',
  dataIndex: 'comName',
  width: 200,
}, {
  title: '公司编号',
  dataIndex: 'comId',
  width: 200,
}]

const proCols = [{
  title: '项目编码',
  dataIndex: 'tempProjectNo',
  width: 100,
}, {
  title: '项目名称',
  dataIndex: 'tempProjectName',
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

const totalColumns = [
  {
    title: '',
    dataIndex: 'title',
    width: 80,
  }, {
    title: '税率',
    dataIndex: 'taxRate',
    width: 150,
  }, {
    title: '税额',
    dataIndex: 'tax',
    width: 150,
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
  dataIndex: 'preInvoiceReason',
  width: 300,
}, {
  title: '预计回款日期',
  dataIndex: 'preReceiveDate',
  width: 150,
}, {
  title: '付款条件',
  dataIndex: 'paymentTerm',
  width: 200,
}, {
  title: '付款条款',
  dataIndex: 'paymentName',
  width: 150,
}, {
  title: '付款阶段',
  dataIndex: 'paymentPhrases',
  width: 150,
}, {
  title: '付款金额',
  dataIndex: 'paymentAmount',
  width: 80,
}, {
  title: '已申请金额',
  dataIndex: 'applyIngAmount',
  width: 100,
}, {
  title: '已开票金额',
  dataIndex: 'outcomeAmount',
  width: 100,
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
  dataIndex: 'invoiceType',
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
}, {
  title: '税率',
  dataIndex: 'taxRate',
  width: 250,
}, {
  title: '不含税金额',
  dataIndex: 'taxExcludeAmount',
  width: 250,
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
  }, {
    title: '开票税额',
    dataIndex: 'taxAmount',
    width: 100,
  }, {
    title: '开票税率',
    dataIndex: 'taxRate',
    width: 80,
    render: (text) => {
      return `${text * 100}%`
    }
  }, {
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
    width: 200,
  }, {
    title: '付款条款',
    dataIndex: 'paymentName',
    width: 150,
  }, {
    title: '付款阶段',
    dataIndex: 'paymentPhrases',
    width: 150,
  }, {
    title: '付款金额',
    dataIndex: 'billedArAmount',
    width: 120,
  }
]

const normalTypes = ['BILLING_NORMAL', 'BILLING_CONTRACT', 'BILLING_EXCESS']
const advanceTypes = ['BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT']
const redTypes = ['BILLING_RED', 'BILLING_RED_OTHER']
const otherTypes = ['BILLING_OTHER']

export {
  clientCols,
  comCols,
  proCols,
  contentCols,
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
}

