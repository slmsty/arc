/**
 * Created by liangshuang on 17/10/20.
 */
/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, message } from 'antd'
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
  componentWillReceiveProps(nextProps) {
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
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
    this.props.getReviewReceiptList(this.queryParam)
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
      action: [],
    }
    submitDatas.map((item, index) => {
      receiptClaimIds.action[index] = { receiptClaimId: item.receiptClaimId }
    })
    this.props.approveSubmit(receiptClaimIds).then((res) => {
      // console.log(res)
      if (res && res.response && res.response.resultCode === '000000') {
        message.success("审批成功" + this.state.selectedRows.length + '条数据')
      } else {
        message.error('审批失败')
      }
    })
    this.handleQuery()
  }
  // 认款退回
  returnClick = () => {
    const submitDatas = this.state.selectedRows
    // console.log(submitDatas)
    const postData = {
      action: [],
    }
    submitDatas.map((item, index) => {
      postData.action[index] = { receiptClaimId: item.receiptClaimId }
    })
    this.props.returnReceiptClaim(postData).then((res) => {
      // console.log(res)
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('认款退回成功' + this.state.selectedRows.length + '条数据')
      } else {
        message.error('认款退回失败')
      }
    })
    this.handleQuery()
  }
  // 传送AR
  transferClick = () => {
    const transferDatas = this.state.transferData
    const submitDatas = this.state.selectedRows
    // console.log(submitDatas)
    const postData = {
      receiptClaimIds: [],
    }
    submitDatas.map((item, index) => {
      postData.receiptClaimIds[index] = item.receiptClaimId
    })
    console.log(postData)
    this.props.transferReceiptClaim(postData).then((res) => {
      // console.log(res)
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('传送AR成功' + this.state.selectedRows.length + '条数据')
      } else {
        message.error('传送AR失败')
      }
    })
    this.handleQuery()
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
      if (item.status === '10' || item.status === '52') {
        transferDis = true
      }
    })
    return (<div>
      <ReviewReceiptClaimSearchWithForm onQuery={this.handleChangeParam} />
      <Button type="danger" disabled={!approveDis} onClick={this.approveClick}>审批</Button>&nbsp;&nbsp;
      <Button type="primary" disabled={!returnDis} onClick={this.returnClick}>认款退回</Button>&nbsp;&nbsp;
      <Button type="dashed" disabled={!transferDis} onClick={this.transferClick}>传送AR</Button>
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
  returnReceiptClaim: PropTypes.func.isRequired,
  transferReceiptClaim: PropTypes.func.isRequired,
  // reject: PropTypes.func.isRequired,
  reviewReceiptClaim: PropTypes.shape({
    getReviewReceiptList: PropTypes.arrayOf.isRequired,
    approveSubmitData: PropTypes.arrayOf.isRequired,
    reviewReceiptClaim: PropTypes.arrayOf.isRequired,
  }).isRequired,
}

