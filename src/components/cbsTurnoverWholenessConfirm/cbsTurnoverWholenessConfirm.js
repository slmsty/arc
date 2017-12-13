/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Row, Col, Table, Button, message } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'
import CBSTurnoverWholenessConfirmSearchWithForm from './cbsTurnoverWholenessConfirmSearch'
import EditCBSTurnoverDataWithForm from './editCBSTurnoverData'

const dateFormat = 'YYYY-MM-DD'

const columns = [{
  title: '数据状态',
  dataIndex: 'statusName',
  key: 'statusName',
  width: 80,
  fixed: 'left',
}, {
  title: '收款日期',
  dataIndex: 'receiptDate',
  key: 'receiptDate',
  width: 80,
  fixed: 'left',
  render: (text, row, index) => moment(text).format(dateFormat),
}, {
  title: '币种',
  dataIndex: 'receiptCurrency',
  key: 'receiptCurrency',
  width: 45,
}, {
  title: '银行交易类型',
  dataIndex: 'transactionTypeName',
  key: 'transactionTypeName',
  width: 100,
}, {
  title: '收入',
  dataIndex: 'receiptAmount',
  key: 'receiptAmount',
  width: 100,
  render: text => (<div style={{ textAlign: 'right' }}>{text ? text.toFixed(2) : 0.00}</div>),
}, {
  title: '支出',
  dataIndex: 'payAmount',
  key: 'payAmount',
  width: 100,
  render: text => (<div style={{ textAlign: 'right' }}>{text ? text.toFixed(2) : 0.00}</div>),
}, {
  title: '公司',
  dataIndex: 'companyName',
  key: 'companyName',
  width: 80,
}, {
  title: '银行类型',
  dataIndex: 'receiptBankAccountName',
  key: 'receiptBankAccountName',
  width: 150,
}, {
  title: '银行账号',
  dataIndex: 'receiptBankAccount',
  key: 'receiptBankAccount',
  width: 150,
}, {
  title: '对方户名',
  dataIndex: 'payCustName',
  key: 'payCustName',
  width: 300,
}, {
  title: '银行流水备注',
  dataIndex: 'bankTransactionPurpose',
  key: 'bankTransactionPurpose',
  width: 300,
}, {
  title: '客户名称',
  dataIndex: 'custName',
  key: 'custName',
  width: 300,
}, {
  title: '流水分类',
  dataIndex: 'claimTypeName',
  key: 'claimTypeName',
  width: 80,
}, {
  title: '备注',
  dataIndex: 'cashierApproveMessage',
  key: 'cashierApproveMessage',
  width: 635,
}, {
  title: '客户付款方式',
  dataIndex: 'custPayMethodName',
  key: 'custPayMethodName',
  width: 100,
}, {
  title: '对方银行帐号',
  dataIndex: 'payBankAccount',
  key: 'payBankAccount',
  width: 150,
}, {
  title: '对方银行类型',
  dataIndex: 'payBankName',
  key: 'payBankName',
  width: 300,
}, {
  title: '银行流水号',
  dataIndex: 'bankTransactionNo',
  key: 'bankTransactionNo',
  width: 200,
}, {
  title: '流水分类',
  dataIndex: 'claimTypeName',
  key: 'claimTypeName',
  width: 80,
}, {
  title: '相关票据',
  dataIndex: 'relatedBill',
  key: 'relatedBill',
  width: 100,
}, {
  title: '备注',
  dataIndex: 'cashierApproveMessage',
  key: 'cashierApproveMessage',
  width: 635,
},
]

export default class CBSTurnoverWholenessConfirm extends React.Component {
  state = {
    selectedRowKeys: [],
    editVisible: false,
    editReceiptClaimId: -1,
    exceptDisabled: false,
    tableHeight: '',
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div168-按钮56-翻页160
    const tableHeight = screenHeight - 64 - 8 - 12 - 119 - 18 - 28.5 - 18 - 53 - 56
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.cbsTurnoverEditConfirmResult !== nextProps.cbsTurnoverEditConfirmResult) {
      message.info('保存成功。')
      this.setState({ editVisible: false })
      this.handleQuery(true)
    }

    if (this.props.cbsTurnoverEditExceptResult !== nextProps.cbsTurnoverEditExceptResult) {
      message.info('数据状态变更为“无需认款”。')
      this.handleQuery(true)
    }

    if (this.props.batchConfirmResult !== nextProps.batchConfirmResult) {
      message.info(`${this.state.selectedRowKeys.length}条已确认成功。`)
      this.handleQuery(true)
    }
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    receiptDateStart: '',
    receiptDateEnd: '',
    custId: '',
    receiptMethodId: '10',
    sourceType: 'cbs',
    status: '',
  }
  handleSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }
  handleChangeParam = (param) => {
    this.queryParam = { ...this.queryParam, ...param }
    this.handleQuery(true)
  }
  handleQuery = (isReset) => {
    if (isReset) {
      this.queryParam.pageInfo = {
        pageNo: 1,
        pageSize: 10,
      }
    }
    this.setState({ selectedRowKeys: [] })
    this.props.getCBSTurnoverWholenessData(this.queryParam)
  }
  handleEdit = () => {
    if (!this.state.selectedRowKeys.length) {
      message.error('请选择想要编辑的数据。')
    } else if (this.state.selectedRowKeys.length > 1) {
      message.error('只可对一条数据进行编辑。')
    } else {
      this.props.initEditData(this.state.selectedRowKeys[0])
      this.setState({ editReceiptClaimId: this.state.selectedRowKeys[0], editVisible: true })
    }
  }
  handleEditConfirm = (confirmList) => {
    this.props.editConfirm({ list: confirmList })
  }
  handleEditCancel = () => {
    this.setState({ editVisible: false })
  }
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  handleExcept = () => {
    if (!this.state.selectedRowKeys.length) {
      message.error('请选择想要排除的数据。')
    } else {
      this.props.editExcept({ list: this.state.selectedRowKeys.map(item => ({ receiptClaimId: item, remark: '' })) })
    }
  }
  handleBatchConfirm = () => {
    if (!this.state.selectedRowKeys.length) {
      message.error('请选择需要批量确认的数据。')
    } else {
      this.props.batchConfirm({ receiptClaimIds: this.state.selectedRowKeys })
    }
  }
  handleChangeStatus = (status) => {
    this.setState({ exceptDisabled: status === '11' })
  }
  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }
    const pagination = {
      current: this.props.cbsTurnoverWholenessList.pageInfo.pageNo || 1,
      onChange: this.handleChangePage,
      total: this.props.cbsTurnoverWholenessList.pageInfo.count,
    }
    const makeSummary = () => (this.props.cbsTurnoverWholenessList.amountTotals.length ?
      this.props.cbsTurnoverWholenessList.amountTotals.map(item => `${item.currency}：${item.totalAmount}`).join('  ') : '0.00'
    )
    return (
      <div>
        <CBSTurnoverWholenessConfirmSearchWithForm
          query={this.handleChangeParam}
          changeStatus={this.handleChangeStatus}
        />
        <br />
        <Row style={{ lineHeight: '28px' }}>
          <Col span={8}>
            <Button type="primary" onClick={this.handleEdit}>编辑</Button>&nbsp;&nbsp;
            <Button type="default" onClick={this.handleExcept} disabled={this.state.exceptDisabled}>排除</Button>&nbsp;&nbsp;
            <Button type="default" onClick={this.handleBatchConfirm}>确认</Button>&nbsp;&nbsp;
          </Col>
          <Col span={16} style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 'bold' }}>
            <span>金额合计：</span><span className="primary-color" style={{ color: '#F4A034' }}>{makeSummary()}</span>
          </Col>
        </Row>
        <br />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.props.cbsTurnoverWholenessList.pageInfo.result}
          bordered
          rowKey="receiptClaimId"
          size="middle"
          pagination={pagination}
          scroll={{ x: '3350px', y: this.state.tableHeight }}
        />
        <EditCBSTurnoverDataWithForm
          onConfirm={this.handleEditConfirm}
          onCancel={this.handleEditCancel}
          visible={this.state.editVisible}
          receiptClaimId={this.state.editReceiptClaimId}
          initData={this.props.initSingleReceiptResult}
        />
      </div>
    )
  }
}

CBSTurnoverWholenessConfirm.propTypes = {
  getCBSTurnoverWholenessData: PropTypes.func.isRequired,
  editConfirm: PropTypes.func.isRequired,
  editExcept: PropTypes.func.isRequired,
  cbsTurnoverEditConfirmResult: PropTypes.number.isRequired,
  cbsTurnoverEditExceptResult: PropTypes.number.isRequired,
  batchConfirmResult: PropTypes.number.isRequired,
  cbsTurnoverWholenessList: PropTypes.shape({
    pageInfo: PropTypes.shape({
      pageNo: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
      result: PropTypes.array.isRequired,
    }).isRequired,
    amountTotals: PropTypes.array.isRequired,
  }).isRequired,
  initEditData: PropTypes.func.isRequired,
  batchConfirm: PropTypes.func.isRequired,
  initSingleReceiptResult: PropTypes.shape().isRequired,
}

