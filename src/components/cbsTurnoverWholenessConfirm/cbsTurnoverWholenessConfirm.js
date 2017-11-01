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
  dataIndex: 'statusDesc',
  key: 'statusDesc',
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
  dataIndex: 'currency',
  key: 'currency',
  width: 45,
}, {
  title: '收款金额',
  dataIndex: 'receiptAmount',
  key: 'receiptAmount',
  width: 100,
  render: (text, row, index) => (<div style={{ textAlign: 'right' }}>{text}</div>),
}, {
  title: '客户名称',
  dataIndex: 'custName',
  key: 'custName',
  width: 300,
}, {
  title: '流水分类',
  dataIndex: 'claimTypeDesc',
  key: 'claimTypeDesc',
  width: 80,
}, {
  title: '备注',
  dataIndex: 'cashierApproveMessage',
  key: 'cashierApproveMessage',
  width: 635,
}, {
  title: '客户付款方式',
  dataIndex: 'custPayMethod',
  key: 'custPayMethod',
  width: 100,
}, {
  title: '银行流水备注',
  dataIndex: 'bankTransactionPurpose',
  key: 'bankTransactionPurpose',
  width: 300,
}, {
  title: '付款客户名称',
  dataIndex: 'payCustName',
  key: 'payCustName',
  width: 300,
}, {
  title: '客户付款银行账号',
  dataIndex: 'payBankAccount',
  key: 'payBankAccount',
  width: 150,
}, {
  title: '客户付款银行',
  dataIndex: 'payBankName',
  key: 'payBankName',
  width: 300,
}, {
  title: '银行流水号',
  dataIndex: 'bankTransactionNo',
  key: 'bankTransactionNo',
  width: 200,
}, {
  title: '公司',
  dataIndex: 'companyName',
  key: 'companyName',
  width: 300,
},
]

export default class CBSTurnoverWholenessConfirm extends React.Component {
  state = {
    selectedRowKeys: [],
    editVisible: false,
    editReceiptClaimId: -1,
    exceptDisabled: false,
  }
  componentDidMount() {
    this.handleQuery()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.cbsTurnoverEditConfirmResult !== nextProps.cbsTurnoverEditConfirmResult) {
      message.info('保存成功。')
      this.setState({ editVisible: false })
      this.handleQuery(true)
    }

    if (this.props.cbsTurnoverEditExceptResult !== nextProps.cbsTurnoverEditExceptResult) {
      message.info('数据状态变更为“出纳已确认”。')
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
    sourceType: 'CBS',
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
      this.props.editExcept({ list: this.state.selectedRowKeys.map(item => ({ receiptClaimIds: item, remark: '' })) })
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
          scroll={{ x: '2970px' }}
        />
        <EditCBSTurnoverDataWithForm
          onConfirm={this.handleEditConfirm}
          onCancel={this.handleEditCancel}
          visible={this.state.editVisible}
          receiptClaimId={this.state.editReceiptClaimId}
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
  cbsTurnoverWholenessList: PropTypes.shape({
    pageInfo: PropTypes.shape({
      pageNo: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
      result: PropTypes.array.isRequired,
    }).isRequired,
    amountTotals: PropTypes.array.isRequired,
  }).isRequired,
}

