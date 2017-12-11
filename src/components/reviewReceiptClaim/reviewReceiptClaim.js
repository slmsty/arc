/**
 * Created by liangshuang on 17/10/20.
 */
/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, message, Modal, Form, Row, Col, DatePicker } from 'antd'
import ReviewReceiptClaimSearchWithForm from './reviewReceiptClaimSearch'
import GlDateModal from './glDateModal'
import ShowTransferNotice from './showTransferNotice'

const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD'
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
}
const columns = [{
  title: '数据状态',
  dataIndex: 'statusName',
  width: 100,
  fixed: 'left',
}, {
  title: '收款来源',
  dataIndex: 'sourceTypeName',
  width: 100,
}, {
  title: '收款分类',
  dataIndex: 'claimTypeName',
  width: 100,
}, {
  title: '收款来源',
  dataIndex: 'sourceTypeName',
  width: 100,
}, {
  title: '公司',
  dataIndex: 'companyName',
  width: 150,
}, {
  title: '收款日期',
  dataIndex: 'receiptDate',
  width: 150,
}, {
  title: '币种',
  dataIndex: 'receiptCurrency',
  width: 100,
}, {
  title: '收款编号',
  dataIndex: 'receiptNo',
  width: 200,
}, {
  title: '收款金额',
  dataIndex: 'receiptAmount',
  width: 100,
  render: (text, record, index) => (record.transactionType !== 'RECEIPT' ? (-text ? -text.toFixed(2) : -text) : (text ? text.toFixed(2) : text)),
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
  render: (text, record, index) => (text ? text.toFixed(2) : text),
}, {
  title: '收款用途',
  dataIndex: 'receiptUse',
  width: 100,
}, {
  title: '备注',
  dataIndex: 'accountantApproveMessage',
  width: 100,
}, {
  title: '订单号',
  dataIndex: 'custOrderId',
  key: '11',
  width: 100,
}, {
  title: '项目编码',
  dataIndex: 'projectNo',
  width: 100,
}, {
  title: '付款条款',
  dataIndex: 'paymentName',
  width: 100,
}, {
  title: '付款阶段',
  dataIndex: 'paymentName3',
  width: 100,
}, {
  title: '付款百分比',
  dataIndex: 'paymentPercent',
  width: 100,
}, {
  title: '合同编码',
  dataIndex: 'contractNo',
  width: 200,
}, {
  title: '合同名称',
  dataIndex: 'contractName',
  width: 300,
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
}, {
  title: '注销收款标识',
  dataIndex: 'receiptWriteOffSign',
  key: '19',
  width: 100,
}, {
  title: '认款人',
  dataIndex: 'accountantName',
  key: '263',
  width: 150,
}, {
  title: '复核人',
  dataIndex: 'reviewAccountName',
  key: '26',
  width: 150,
}, {
  title: '创建提示',
  dataIndex: 'statusRemark',
  key: '27',
  width: 400,
},
]
/*  {
 title: '收款编号',
 dataIndex: 'receiptNo',
 width: 200,
 }, {
 title: '认款人',
 dataIndex: 'accountantId',
 width: 150,
 },{
 title: '订单号',
 dataIndex: 'custOrderId',
 key: '11',
 width: 100,
 }, {
 title: '项目阶段',
 dataIndex: 'paymentPhrases',
 width: 100,
 }, {
 title: '合同名称',
 dataIndex: 'contractName',
 width: 500,
 }, {
 title: '注销收款标识',
 dataIndex: 'receiptWriteOffSign',
 key: '19',
 width: 100,
 }, {
 title: '客户付款银行',
 dataIndex: 'payBankName',
 width: 300,
 }, {
 title: '复核人',
 dataIndex: '26',
 key: '26',
 width: 150,
 }, {
 title: '创建提示',
 dataIndex: 'statusRemark',
 key: '27',
 width: 400,
 }, */
export default class ReviewReceiptClaim extends React.Component {
  state = {
    loading: false,
    approve: false,
    return: false,
    transfer: false,
    glDateModal: false,
    selectedRowKeys: [],
    selectedRows: [],
    submitData: [],
    returnData: [],
    transferData: [],
    tableHeight: '',
    transferNotice: false,
    transfNoticeData: {},
    transfNoticeSuccessLength: '',
    transfNoticeFailureLength: '',
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div168-按钮56-翻页160
    const tableHeight = screenHeight - 8 - 12 - 24 - 126 - 56 - 28 - 24 - 160
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.reviewReceiptClaim.receiptClaimListRefresh !== nextProps.reviewReceiptClaim.receiptClaimListRefresh) {
      this.handleQuery()
    }
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  selectCancel = () => {
    this.setState({
      glDateModal: false,
      glDateData: '',
    })
  }
  selectOk = (value) => {
    this.setState({
      glDateModal: false,
    })
    this.transferClick(value)
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    startDate: '',
    endDate: '',
    custId: '',
    receiptMethodId: '',
    projectIds: '',
    contractIds: '',
    custOrderIds: '',
    claimType: '',
    status: '',
  }
  handleQuery = () => {
    this.setState({
      loading: true,
    })
    this.setState({ selectedRowKeys: [], selectedRows: [] })
    // console.log('query', this.queryParam)
    this.props.getReviewReceiptList(this.queryParam).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          loading: false,
        })
      } else {
        message.error('加载数据失败')
        this.setState({
          loading: false,
        })
      }
    })
  }
  handleChangeSize = (current, size) => {
    this.queryParam.pageInfo.pageNo = current
    this.queryParam.pageInfo.pageSize = size
    this.handleQuery()
  }
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  handleChangeParam = (param) => {
    this.queryParam = { ...this.queryParam, ...param }
    this.handleQuery()
  }
  // 审批提交
  approveClick = () => {
    const submitDatas = this.state.selectedRows
    const receiptClaimIds = {
      actions: [],
    }
    const submitDatasLength = submitDatas.length
    submitDatas.map((item, index) => {
      receiptClaimIds.actions[index] = { receiptClaimId: item.receiptClaimId }
    })
    this.props.approveSubmit(receiptClaimIds).then((res) => {
      // console.log(res)
      if (res && res.response && res.response.resultCode === '000000') {
        message.success("审批成功" + submitDatasLength + '条数据')
      } else {
        message.error('审批失败')
      }
    })
    // this.handleQuery()
  }
  // 认款退回
  returnClick = () => {
    const submitDatas = this.state.selectedRows
    const submitDatasLength = submitDatas.length
    // console.log(submitDatas)
    const postData = {
      actions: [],
    }
    submitDatas.map((item, index) => {
      postData.actions[index] = { receiptClaimId: item.receiptClaimId }
    })
    this.props.returnReceiptClaim(postData).then((res) => {
      // console.log(res)
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('认款退回成功' + submitDatasLength + '条数据')
      } else {
        message.error('认款退回失败')
      }
    })
    // this.handleQuery()
  }
  // 显示gl日期
  showGlDate = () => {
    this.setState({
      glDateModal: true,
    })
  }
  // 传送AR
  transferClick = (value) => {
    this.setState({
      loading: true,
    })
    const glDateData = value
    if (glDateData === '') {
      message.error('请选择gl日期')
    } else {
      const submitDatas = this.state.selectedRows
      const transferDataLength = submitDatas.length
      // console.log(submitDatas)
      const postData = {
        receiptClaimIds: [],
        glDate: '',
      }
      postData.glDate = glDateData
      submitDatas.map((item, index) => {
        postData.receiptClaimIds[index] = item.receiptClaimId
      })
      // console.log(postData)
      this.props.transferReceiptClaim(postData).then((res) => {
        // console.log(res)
        if (res && res.response && res.response.resultCode === '000000') {
          this.setState({
            transferNotice: true,
            transfNoticeData: res.response.data,
            transfNoticeSuccessLength: res.response.data.successIds.length,
            transfNoticeFailureLength: res.response.data.failures.length,
            loading: false,
          })
          // message.success('传送AR成功' + transferDataLength + '条数据')
        } else {
          message.error('传送AR失败')
          this.setState({
            loading: false,
          })
        }
      })
      // this.handleQuery()
    }
  }
  // 隐藏传送AR接口返回信息
  showTranNotice = () => {
    this.setState({
      transferNotice: false,
    })
  }
  render() {
    const { selectedRowKeys } = this.state
    const pagination = {
      current: this.props.reviewReceiptClaim.getReviewReceiptList.pageNo,
      total: this.props.reviewReceiptClaim.getReviewReceiptList.count,
      pageSize: this.props.reviewReceiptClaim.getReviewReceiptList.pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,
    }
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      onChange: this.onSelectChange,
    }
    let approveDis = false
    let returnDis = false
    let transferDis = false
    this.state.selectedRows.map((item, index) => {
      if (item.status === '31') {
        approveDis = true
      }
      if (item.status === '31' || item.status === '50' || item.status === '52') {
        returnDis = true
      }
      // item.status === '50'
      if (item.status === '50' || item.status === '52') {
        transferDis = true
      }
    })
    return (<div>
      <ReviewReceiptClaimSearchWithForm onQuery={this.handleChangeParam} />
      <Button type="danger" disabled={!approveDis} onClick={this.approveClick}>审批</Button>&nbsp;&nbsp;
      <Button type="primary" disabled={!returnDis} onClick={this.returnClick}>认款退回</Button>&nbsp;&nbsp;
      <Button type="dashed" disabled={!transferDis} onClick={this.showGlDate}>传送AR</Button>
      <br /><br />
      <Table
        rowKey="receiptClaimId"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={this.props.reviewReceiptClaim.getReviewReceiptList.result}
        bordered
        size="middle"
        pagination={pagination}
        scroll={{ x: '4400px', y: this.state.tableHeight }}
        loading={this.state.loading}
      />
      {/* 弹出传送ARglDatemodal */}
      <GlDateModal
        glDateModal={this.state.glDateModal}
        selectOk={this.selectOk}
        selectCancel={this.selectCancel}
        onChange={this.handleChange}
      />
      <ShowTransferNotice
        showtrNotice={this.state.transferNotice}
        showTranNotice={this.showTranNotice}
        transfNoticeData={this.state.transfNoticeData}
        transferNoticeSuccessLength={this.state.transfNoticeSuccessLength}
        transfNoticeFailureLength={this.state.transfNoticeFailureLength}
      />
    </div>)
  }
}
ReviewReceiptClaim.propTypes = {
  getReviewReceiptList: PropTypes.func.isRequired,
  approveSubmit: PropTypes.func.isRequired,
  returnReceiptClaim: PropTypes.func.isRequired,
  transferReceiptClaim: PropTypes.func.isRequired,
  // reject: PropTypes.func.isRequired,
  reviewReceiptClaim: PropTypes.shape({
    getReviewReceiptList: PropTypes.arrayOf.isRequired,
    approveSubmitData: PropTypes.arrayOf.isRequired,
    reviewReceiptClaim: PropTypes.arrayOf.isRequired,
    receiptClaimListRefresh: PropTypes.number.isRequired,
  }).isRequired,
}
