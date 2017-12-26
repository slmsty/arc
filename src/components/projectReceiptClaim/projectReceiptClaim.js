/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, message, Modal, Row, Col } from 'antd'
import moment from 'moment'
import ProjectReceiptClaimSearchWithForm from './projectReceiptClaimSearch'
import ProjectReceiptClaimModal from '../../containers/projectReceiptClaim/projectReceiptClaimModal'

const dateFormat = 'YYYY-MM-DD'

export default class ProjectReceiptClaim extends React.Component {
  state = {
    selectedRowKeys: [],
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
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }
  columns = [{
    title: '数据状态',
    dataIndex: 'statusName',
    width: 100,
    fixed: 'left',
  }, {
    title: '收款来源',
    dataIndex: 'sourceTypeName',
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
    title: '收款日期',
    dataIndex: 'receiptDate',
    width: 100,
    render: text => moment(text).format(dateFormat),
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
    title: '流水分类',
    dataIndex: 'claimTypeName',
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
    title: '客户名称',
    dataIndex: 'custName',
    width: 200,
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
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 100,
  }, {
    title: '付款条款',
    dataIndex: 'paymentPhrases',
    width: 100,
  }, {
    title: '付款百分比',
    dataIndex: 'paymentPercent',
    width: 100,
  }, {
    title: '合同编码',
    dataIndex: 'contractNo',
    width: 100,
  }, {
    title: '发票号',
    dataIndex: 'invoiceNo',
    width: 100,
  }, {
    title: 'SBU',
    dataIndex: 'sbuId',
    width: 100,
  }, {
    title: '部门',
    dataIndex: 'deptId',
    width: 100,
  // }, {
  //   title: 'GL日期',
  //   dataIndex: 'glDate',
  //   width: 100,
  //   render: text => moment(text).format(dateFormat),
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
    this.setState({ selectedRowKeys: [] })
    this.props.getReceiptList(this.queryParam)
  }
  handleOpenClaim = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要认款的收款流水')
      return
    }
    if (this.state.selectedRowKeys.length > 1) {
      message.error('一次只能对一条收款流水进行认款')
      return
    }
    this.props.getReceiptInfo(this.state.selectedRowKeys[0])
  }
  handleChangeClaimType = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要认款到订单的收款流水')
      return
    }
    const that = this
    Modal.confirm({
      title: '操作确认',
      content: `您确认要将所选择的${that.state.selectedRowKeys.length}条流水数据认款到订单吗`,
      okText: '是',
      cancelText: '否',
      onOk() {
        const changeParam = {
          receiptClaimIds: that.state.selectedRowKeys,
          claimType: 'order',
        }
        that.props.changeClaimType(changeParam)
      },
    })
  }
  handleEmailCliam = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要邮件确认的收款流水')
      return
    }
    const that = this
    Modal.confirm({
      title: '操作确认',
      content: '确定将向AR管理部群组发送邮件？',
      okText: '是',
      cancelText: '否',
      onOk() {
        const emailQueryParam = {
          receiptClaimIds: that.state.selectedRowKeys,
        }
        that.props.emailClaim(emailQueryParam).then((res) => {
          if (res && res.response && res.response.resultCode === '000000') {
            message.success('邮件确认成功')
          } else {
            message.error('邮件确认失败')
          }
        })
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
        const rejectParam = that.state.selectedRowKeys.map(receiptClaimId => ({ receiptClaimId, remark: '' }))
        that.props.reject(rejectParam)
      },
    })
  }
  handleHangUp = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要暂挂的收款流水')
      return
    }
    const that = this
    Modal.confirm({
      title: '操作确认',
      content: '确定暂挂此数据？',
      okText: '是',
      cancelText: '否',
      onOk() {
        const emailQueryParam = {
          receiptClaimIds: that.state.selectedRowKeys,
        }
        that.props.hangUp(emailQueryParam).then((res) => {
          if (res && res.response && res.response.resultCode === '000000') {
            message.success('暂挂成功')
          } else {
            message.error('暂挂失败')
          }
        })
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
    const hangUpBtn = <Button onClick={this.handleHangUp}>暂挂</Button>
    const makeSummary = this.props.amountTotals && this.props.amountTotals.length ? this.props.amountTotals.map(item => `${item.currency}：${item.totalAmount}`).join('  ') : '0.00'
    return (
      <div>
        <ProjectReceiptClaimSearchWithForm
          onQuery={this.handleChangeParam}
        />
        <Row style={{ lineHeight: '28px' }}>
          <Col span={12}>
            <Button type="primary" onClick={this.handleOpenClaim}>{this.queryParam.status === '21' ? '' : '重新'}认款</Button>&nbsp;&nbsp;
            <Button type="primary" onClick={this.handleChangeClaimType}>订单认款</Button>&nbsp;&nbsp;
            {rejectBtn}
            &nbsp;&nbsp;
            {hangUpBtn}
            &nbsp;&nbsp;
            <Button onClick={this.handleEmailCliam}>邮件确认</Button>
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
          size="small"
          dataSource={this.props.receiptClaimList.result}
          scroll={{ x: 3000, y: this.state.tableHeight }}
          pagination={{
            current: this.props.receiptClaimList.pageNo,
            total: this.props.receiptClaimList.count,
            pageSize: this.props.receiptClaimList.pageSize,
            showTotal: (total, range) => `共 ${total} 条记录 当前显示 ${range[0]}-${range[1]}`,
            onChange: this.handleChangePage,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize,
          }}
        />
        <ProjectReceiptClaimModal />
      </div>
    )
  }
}

ProjectReceiptClaim.propTypes = {
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  // }).isRequired,
  emailClaim: PropTypes.func.isRequired,
  hangUp: PropTypes.func.isRequired,
  getReceiptList: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  changeClaimType: PropTypes.func.isRequired,
  getReceiptInfo: PropTypes.func.isRequired,
  amountTotals: PropTypes.arrayOf(PropTypes.shape),
  receiptClaimList: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
  receiptClaimListRefresh: PropTypes.number.isRequired,
}
