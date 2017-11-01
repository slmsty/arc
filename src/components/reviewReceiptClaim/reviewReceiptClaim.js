/**
 * Created by liangshuang on 17/10/20.
 */
/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import ReviewReceiptClaimSearchWithForm from './reviewReceiptClaimSearch'

const columns = [{
  title: '数据状态',
  dataIndex: 'statusDesc',
  width: 100,
  fixed: 'left',
}, {
  title: '收款日期',
  dataIndex: 'receiptDate',
  width: 150,
}, {
  title: '收款分类',
  dataIndex: 'claimType',
  width: 100,
}, {
  title: '公司',
  dataIndex: 'companyName',
  width: 100,
}, {
  title: '客户名称',
  dataIndex: 'custName',
  width: 100,
}, {
  title: '认款金额',
  dataIndex: 'claimAmount',
  width: 100,
}, {
  title: '收款用途',
  dataIndex: 'bankTransactionPurpose',
  width: 100,
}, {
  title: '备注',
  dataIndex: 'accountantApproveMessage',
  width: 100,
}, {
  title: '币种',
  dataIndex: 'currency',
  width: 100,
}, {
  title: '收款金额',
  dataIndex: 'receiptAmount',
  width: 100,
}, {
  title: '订单号',
  dataIndex: '11',
  key: '11',
  width: 100,
}, {
  title: '项目编码',
  dataIndex: 'projectNo',
  width: 100,
}, {
  title: '项目阶段',
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
  title: '合同名称',
  dataIndex: 'contractName',
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
}, {
  title: '注销收款标识',
  dataIndex: '19',
  key: '19',
  width: 100,
}, {
  title: '银行流水号',
  dataIndex: 'bankTransactionNo',
  width: 100,
}, {
  title: '付款客户名称',
  dataIndex: 'payCustName',
  width: 100,
}, {
  title: '客户付款银行',
  dataIndex: 'payBankName',
  width: 100,
}, {
  title: '客户付款银行账号',
  dataIndex: 'payBankAccount',
  width: 100,
}, {
  title: '收款编号',
  dataIndex: 'receiptNo',
  width: 100,
}, {
  title: '认款人',
  dataIndex: 'accountantName',
  width: 100,
}, {
  title: '复核人',
  dataIndex: '26',
  key: '26',
  width: 100,
}, {
  title: '创建提示',
  dataIndex: '27',
  key: '27',
  width: 100,
},
]
const data = []
const formatDate = function (date) {
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? `0${m}` : m
  let d = date.getDate()
  d = d < 10 ? (`0${d}`) : d
  return `${y}-${m}-${d}`
}
const formatMoney = function (number) {
  const negative = number < 0 ? '-' : ''
  const num = Math.abs(+number || 0).toFixed(2)
  const i = `${parseInt(num, 10)}`
  let j = i.length
  j = j > 3 ? j % 3 : 0
  return `${negative + (j ? `${i.substr(0, j)},` : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1,')}.${Math.abs(num - i).toFixed(2).slice(2)}`
}

export default class ReviewReceiptClaim extends React.Component {
  state = {
    loading: false,
    approve: false,
    return: false,
    transfer: false,
    selectedRowKeys: [],
    selectedRows: [],
    submitData: [],
    returnData: [],
    transferData: [],
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
    this.props.getReviewReceiptList(this.queryParam)
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  componentDidMount() {
  }
  // approve submit
  approveClick = () => {
    const submitDatas = this.state.selectedRows
    const postData = {
      action: [],
    }
    submitDatas.map((item, index) => {
      postData.action[index] = { receiptClaimId: item.receiptClaimId }
    })
    this.props.approveSubmit(postData).then((res) => {
      console.log(res)
      if (res && res.response && res.response.resultCode === '000000') {
        alert('审批成功')
      }
    })
  }
  // 认款退回
  returnClick = () => {
    const returnDatas = this.state.returnData
    // alert ("认款退回成功" + returnDatas.length + "条数据，数据状态变为'复核退回'")
  }
  // 传送AR
  transferClick = () => {
    const transferDatas = this.state.transferData
    // alert ('认款退回成功' + transferDatas.length + "条数据，数据状态变为'已传送AR'")
  }

  testData = () => {
    this.setState({ loading: true })
    // ajax request after empty completing
    setTimeout(() => {
      for (let i = 0; i < 46; i++) {
        data.push({
          key: i,
          status: ['会计已认款', '等待传送AR', '已传送AR', '传送失败'][Math.ceil(Math.random() * 4) - 1],
          2: formatDate(new Date(new Date().valueOf() - Math.ceil(Math.random() * 2592000000))),
          9: ['CNY', 'USD', 'JPY', 'EUR', 'GBP'][Math.ceil(Math.random() * 5) - 1],
          6: formatMoney(Math.ceil(Math.random() * 10000000) / 100),
          5: ['北京市某某信息技术有限公司', '河北矿业', '中国电信', '中国移动北京分公司', '天津电话好多好多公司'][Math.ceil(Math.random() * 5) - 1],
          3: ['项目', '百一测评'][Math.ceil(Math.random() * 2) - 1],
          20:Math.random() * 1000,
        })
      }
      this.setState({
        loading: false,
      })
    }, 1000)
  }
  render() {
    // console.log(this.props.reviewReceiptClaim.approveSubmitData.resultMessage)
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
    this.state.selectedRows.map((item, index) => {
      if (item.status === '10') {
        approveDis = true
      }
    })
    return (<div>
      <ReviewReceiptClaimSearchWithForm onQuery={this.handleChangeParam} />
      <Button type="danger" disabled={!approveDis} onClick={this.approveClick}>审批</Button>&nbsp;&nbsp;
      <Button type="primary" disabled={!this.state.return} onClick={this.returnClick}>认款退回</Button>&nbsp;&nbsp;
      <Button type="dashed" disabled={!this.state.transfer} onClick={this.transferClick}>传送AR</Button>
      <br /><br />
      <Table
        rowKey="receiptClaimId"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={this.props.reviewReceiptClaim.getReviewReceiptList.result}
        bordered
        size="middle"
        pagination={pagination}
        scroll={{ x: '300%', y: true }}
      />
    </div>)
  }
}
ReviewReceiptClaim.propTypes = {
  getReviewReceiptList: PropTypes.func.isRequired,
  approveSubmit: PropTypes.func.isRequired,
  // reject: PropTypes.func.isRequired,
  reviewReceiptClaim: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
    pageSize: PropTypes.number.isRequired,
    getReviewReceiptList: PropTypes.arrayOf.isRequired,
    approveSubmitData: PropTypes.arrayOf.isRequired,
    reviewReceiptClaim: PropTypes.arrayOf.isRequired,
  }).isRequired,
}

