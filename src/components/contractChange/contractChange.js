/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Pagination, message } from 'antd'
import moment from 'moment'
import ContractChangeSearchWithForm from './contractChangeSearch'

const dateFormat = 'YYYY-MM-DD'

export default class ContractList extends React.Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    status: '21',
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin24-padding24-查询条件div56-按钮56-翻页160
    const tableHeight = screenHeight - 64 - 24 - 24 - 56 - 56 - 160
    this.setState({ tableHeight })
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
    custId: '',
    sourceType: '',
    projectIds: '',
    receiptMethodId: '',
    receiptDates: '',
    contractIds: '',
    status: this.state.status,
    receiptNo: '',
  }
  columns = [{
    title: '数据状态',
    dataIndex: 'statusDesc',
    width: 100,
    fixed: 'left',
  }, {
    title: '收款日期',
    dataIndex: 'receiptDate',
    width: 100,
    render: text => moment(text).format(dateFormat),
  }, {
    title: '收款来源',
    dataIndex: 'sourceType',
    width: 100,
  }, {
    title: '收款分类',
    dataIndex: 'claimType',
    width: 100,
  }, {
    title: '客户名称',
    dataIndex: 'custName',
    width: 300,
  }, {
    title: '认款金额',
    dataIndex: 'claimAmount',
    width: 100,
  }, {
    title: '收款用途',
    dataIndex: 'receiptUse',
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
    title: '公司',
    dataIndex: 'companyName',
    width: 100,
  }, {
    title: '收款日期',
    dataIndex: 'glDate',
    width: 100,
    render: text => moment(text).format(dateFormat),
  }, {
    title: '银行流水号',
    dataIndex: 'bankTransactionNo',
    width: 200,
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
    width: 150,
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
    this.setState({ selectedRowKeys: [], selectedRows: [] })
    this.props.getContractChangeList(this.queryParam)
  }
  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <ContractChangeSearchWithForm
          onQuery={this.handleChangeParam}
        />
        <br /><br />
        <Table
          rowKey="receiptClaimId"
          rowSelection={rowSelection}
          columns={this.columns}
          bordered
          size="middle"
          dataSource={this.props.contractChangeList.result}
          scroll={{ x: '260%', y: this.state.tableHeight }}
          pagination={{
            current: this.props.contractChangeList.pageNo,
            total: this.props.contractChangeList.count,
            pageSize: this.props.contractChangeList.pageSize,
            onChange: this.handleChangePage,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize,
          }}
        />
      </div>
    )
  }
}

ContractList.propTypes = {
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  // }).isRequired,
  getContractChangeList: PropTypes.func.isRequired,
  contractChangeList: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
}
