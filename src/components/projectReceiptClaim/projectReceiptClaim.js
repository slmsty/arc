/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Pagination, message } from 'antd'
import ProjectReceiptClaimSearchWithForm from './projectReceiptClaimSearch'
import ClaimModal from './projectReceiptClaimModal'

const columns = [{
  title: '数据状态',
  dataIndex: '1',
  key: '1',
  width: 100,
  fixed: 'left',
}, {
  title: '收款来源',
  dataIndex: '2',
  key: '2',
  width: 100,
}, {
  title: '收款日期',
  dataIndex: '3',
  key: '3',
  width: 100,
}, {
  title: '业务实体',
  dataIndex: '4',
  key: '4',
  width: 100,
}, {
  title: '公司段',
  dataIndex: '5',
  key: '5',
  width: 100,
}, {
  title: 'GL日期',
  dataIndex: '6',
  key: '6',
  width: 100,
}, {
  title: '银行流水号',
  dataIndex: '7',
  key: '7',
  width: 100,
}, {
  title: '付款客户名称',
  dataIndex: '8',
  key: '8',
  width: 100,
}, {
  title: '客户付款银行',
  dataIndex: '9',
  key: '9',
  width: 100,
}, {
  title: '客户付款银行账号',
  dataIndex: '10',
  key: '10',
  width: 100,
}, {
  title: '币种',
  dataIndex: '11',
  key: '11',
  width: 100,
}, {
  title: '收款金额',
  dataIndex: '12',
  key: '12',
  width: 100,
}, {
  title: '客户名称',
  dataIndex: '13',
  key: '13',
  width: 100,
}, {
  title: '客户地点',
  dataIndex: '14',
  key: '14',
  width: 100,
}, {
  title: '项目编码',
  dataIndex: '15',
  key: '15',
  width: 100,
}, {
  title: '项目阶段',
  dataIndex: '16',
  key: '16',
  width: 100,
}, {
  title: '付款百分比',
  dataIndex: '17',
  key: '17',
  width: 100,
}, {
  title: '合同编码',
  dataIndex: '18',
  key: '18',
  width: 100,
}, {
  title: '发票号',
  dataIndex: '19',
  key: '19',
  width: 100,
}, {
  title: 'SBU',
  dataIndex: '20',
  key: '20',
  width: 100,
}, {
  title: '部门',
  dataIndex: '21',
  key: '21',
  width: 100,
}, {
  title: '收款用途',
  dataIndex: '22',
  key: '22',
  width: 100,
}, {
  title: '备注',
  dataIndex: '23',
  key: '23',
  width: 100,
}, {
  title: '认款人',
  dataIndex: '24',
  key: '24',
  width: 100,
},
]

export default class ProjectReceiptClaim extends React.Component {
  state = {
    showClaimModal: false,
    selectedRowKeys: [],
    pageSize: 10,
    status: '21',
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }
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
    status: this.state.status,
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
    this.setState({ selectedRowKeys: [], status: param.status })
    this.queryParam = { ...this.queryParam, ...param }
    this.handleQuery()
  }
  handleQuery = () => {
    // this.props.history.push('112')
    // console.log(this.queryParam)
    this.props.getReceiptList(this.queryParam)
  }
  handleCloseClaimModal = (refresh) => {
    this.setState({
      showClaimModal: false,
    })
    if (refresh) {
      this.handleQuery()
    }
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
    this.setState({
      showClaimModal: true,
    })
  }
  handleReject = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要拒绝的收款流水')
      return
    }
    this.props.reject(this.state.selectedRowKeys)
  }
  render() {
    const pagination = (<Pagination
      current={this.props.projectReceiptClaim.pageNo}
      onChange={this.handleChangePage}
      pageSize={this.state.pageSize}
      showSizeChanger
      onShowSizeChange={this.handleChangeSize}
      total={this.props.projectReceiptClaim.count}
    />)
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <ProjectReceiptClaimSearchWithForm
          onQuery={this.handleChangeParam}
        />
        <Button type="primary" onClick={this.handleOpenClaim}>{this.state.status === '21' ? '' : '重新'}认款</Button>&nbsp;&nbsp;
        <Button type="danger" onClick={this.handleReject}>拒绝</Button>
        <br /><br />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          bordered
          size="middle"
          pagination={pagination}
          dataSource={this.props.projectReceiptClaim.result}
          scroll={{ x: '260%' }}
        />
        <ClaimModal
          visible={this.state.showClaimModal}
          onClose={this.handleCloseClaimModal}
        />
      </div>
    )
  }
}

ProjectReceiptClaim.propTypes = {
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  // }).isRequired,
  getReceiptList: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  projectReceiptClaim: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
}
