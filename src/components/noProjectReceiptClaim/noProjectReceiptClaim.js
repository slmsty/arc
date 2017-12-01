/* eslint-disable no-unused-vars,react/prefer-stateless-function,react/no-unused-prop-types,max-len */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, message, Modal, Row, Col } from 'antd'
import moment from 'moment'
import NoProjectReceiptClaimSearchWithForm from './noProjectReceiptClaimSearch'
import NoProjectReceiptClaimModal from '../../containers/noProjectReceiptClaim/noProjectReceiptClaimModal'

const dateFormat = 'YYYY-MM-DD'

export default class NoProjectReceiptClaim extends React.Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    tableHeight: 600,
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div224-按钮56-翻页160
    const tableHeight = screenHeight - 64 - 8 - 12 - 168 - 56 - 160
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.receiptClaimListRefresh !== nextProps.receiptClaimListRefresh) {
      this.handleQuery()
    }
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
    title: '数据状态',
    dataIndex: 'statusName',
    width: 100,
    fixed: 'left',
  }, {
    title: '收款日期',
    dataIndex: 'receiptDate',
    width: 100,
    render: text => moment(text).format(dateFormat),
  }, {
    title: '收款来源',
    dataIndex: 'sourceTypeName',
    width: 100,
  }, {
    title: '流水分类',
    dataIndex: 'claimTypeName',
    width: 100,
  }, {
    title: '公司',
    dataIndex: 'companyName',
    width: 150,
    render: (text, record, index) => `${record.companyId}_${text}`,
  }, {
    title: '付款方式',
    dataIndex: 'custPayMethodName',
    width: 100,
  }, {
    title: '客户名称',
    dataIndex: 'custName',
    width: 300,
  }, {
    title: '认款金额',
    dataIndex: 'claimAmount',
    width: 100,
    render: text => (text ? text.toFixed(2) : 0.00),
  }, {
    title: '收款用途',
    dataIndex: 'receiptUse',
    width: 100,
  }, {
    title: '备注',
    dataIndex: 'accountantApproveMessage',
    width: 100,
    render: (text, record, index) => text || record.cashierApproveMessage,
  }, {
    title: '币种',
    dataIndex: 'receiptCurrency',
    width: 100,
  }, {
    title: '收款金额',
    dataIndex: 'receiptAmount',
    width: 100,
    render: (text, record, index) => {
      const receiptAmount = text ? text.toFixed(2) : 0.00
      return record.transactionType !== 'RECEIPT' ? -receiptAmount : receiptAmount
    },
  }, {
    title: '订单号',
    dataIndex: 'projectNo',
    width: 100,
  }, {
    title: '银行流水号',
    dataIndex: 'bankTransactionNo',
    width: 200,
  }, {
    title: '付款客户名称',
    dataIndex: 'payCustName',
    width: 200,
  }, {
    title: '客户付款银行',
    dataIndex: 'payBankName',
    width: 200,
  }, {
    title: '客户付款银行账号',
    dataIndex: 'payBankAccount',
    width: 200,
  }, {
    title: '收款编号',
    dataIndex: 'receiptNo',
    width: 100,
  }, {
    title: '认款人',
    dataIndex: 'accountantName',
    width: 100,
  },
  ]
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    custId: '',
    sourceType: '',
    projectIds: '',
    receiptMethodId: '',
    receiptDates: '',
    contractIds: '',
    status: '21',
    receiptNo: '',
  }
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  handleChangeSize = (current, size) => {
    this.queryParam.pageInfo.pageNo = current
    this.queryParam.pageInfo.pageSize = size
    this.handleQuery()
  }
  handleChangeParam = (param) => {
    this.queryParam = { ...this.queryParam, ...param }
    this.handleQuery()
  }
  handleQuery = () => {
    // this.props.history.push('112')
    // console.log(this.queryParam)
    this.setState({ selectedRowKeys: [], selectedRows: [] })
    this.props.getReceiptList(this.queryParam)
  }

  handleOpenClaim = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择要认款的收款流水')
      return
    }
    if (this.state.selectedRows.length > 1) {
      message.error('一次只能对一条收款流水进行认款')
      return
    }
    this.props.openClaim(this.state.selectedRows[0])
  }
  handleChangeClaimType = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要认款到项目的收款流水')
      return
    }
    const that = this
    Modal.confirm({
      title: '操作确认',
      content: `您确认要将所选择的${that.state.selectedRowKeys.length}条流水数据认款到项目吗`,
      okText: '是',
      cancelText: '否',
      onOk() {
        const changeParam = {
          receiptClaimIds: that.state.selectedRowKeys,
          claimType: 'project',
        }
        that.props.changeClaimType(changeParam)
      },
    })
  }
  handleReject = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要拒绝的收款流水')
      return
    }
    const that = this
    Modal.confirm({
      title: '操作确认',
      content: `您确认要拒绝认款所选择的${that.state.selectedRowKeys.length}条流水数据吗`,
      okText: '是',
      cancelText: '否',
      onOk() {
        that.props.reject(that.state.selectedRowKeys)
      },
    })
  }
  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const rejectBtn = this.queryParam.status === '21' || this.queryParam.status === '40' ? <Button type="danger" onClick={this.handleReject}>拒绝</Button> : null
    const makeSummary = this.props.amountTotals && this.props.amountTotals.length ? this.props.amountTotals.map(item => `${item.currency}：${item.totalAmount}`).join('  ') : '0.00'
    return (
      <div>
        <NoProjectReceiptClaimSearchWithForm
          onQuery={this.handleChangeParam}
        />
        <Row style={{ lineHeight: '28px' }}>
          <Col span={12}>
            <Button type="primary" onClick={this.handleOpenClaim}>{this.queryParam.status === '21' ? '' : '重新'}认款</Button>&nbsp;&nbsp;
            {rejectBtn}
          </Col>
          <Col span={12} style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 'bold' }}>
            <span>金额合计：</span><span className="primary-color" style={{ color: '#F4A034' }}>{makeSummary}</span>
          </Col>
        </Row>
        <br />
        <Table
          rowKey="receiptClaimId"
          rowSelection={rowSelection}
          columns={this.columns}
          bordered
          size="middle"
          dataSource={this.props.receiptClaimList.result}
          scroll={{ x: 2600, y: this.state.tableHeight }}
          pagination={{
            current: this.props.receiptClaimList.pageNo,
            total: this.props.receiptClaimList.count,
            pageSize: this.props.receiptClaimList.pageSize,
            onChange: this.handleChangePage,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize,
          }}
        />
        <NoProjectReceiptClaimModal />
      </div>
    )
  }
}

NoProjectReceiptClaim.propTypes = {
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  // }).isRequired,
  getReceiptList: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  changeClaimType: PropTypes.func.isRequired,
  openClaim: PropTypes.func.isRequired,
  amountTotals: PropTypes.arrayOf(PropTypes.shape),
  receiptClaimList: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
  receiptClaimListRefresh: PropTypes.number.isRequired,
}
