import { toThousands } from '../../util/currency'

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
    width: 110,
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
    width: 130,
    render: (text, record, index) => (text ? toThousands(text) : text),
  },
  {
    title: '已申请金额',
    dataIndex: 'billingAmount',
    width: 130,
    render: (text, record, index) => (text ? toThousands(text) : text),
  },
  {
    title: '已开票金额',
    dataIndex: 'invoiceAmount',
    width: 130,
    render: (text, record, index) =>
      record.lineNo === '合计' ? text :
      (text ? toThousands(text) : text),
  },
]

export {
  billApproveItemColumns,
}
