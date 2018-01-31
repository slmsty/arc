const clientCols = [{
  title: '客户名称',
  dataIndex: 'custName',
  width: 200,
}, {
  title: '客户编号',
  dataIndex: 'custId',
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
}]

const proCols = [{
  title: '公司ID',
  dataIndex: 'comId',
  width: 100,
}, {
  title: 'BU',
  dataIndex: 'sbuName',
  width: 100,
}, {
  title: '项目编码',
  dataIndex: 'tempProjectNo',
  width: 100,
}]

const invoiceCols = [{
  title: '发票ID',
  dataIndex: 'invoiceId',
  width: 100,
}, {
  title: '发票编号',
  dataIndex: 'invoiceNumber',
  width: 100,
}]

const contentCols = [{
  title: '内容名称',
  dataIndex: 'billingContentName',
  width: 200,
}, {
  title: '内容',
  dataIndex: 'billingRecordId',
  width: 200,
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
  width: 80,
}, {
  title: '客户名称',
  dataIndex: 'customerName',
  width: 150,
}, {
  title: '纳税人识别码',
  dataIndex: 'taxPayer',
  width: 150,
}, {
  title: '地址电话',
  dataIndex: 'address',
  width: 150,
}, {
  title: '开户行及账号',
  dataIndex: 'bankAccount',
  width: 150,
}]

export { clientCols, comCols, proCols, contentCols, totalColumns, detailColumns, invoiceCols }

