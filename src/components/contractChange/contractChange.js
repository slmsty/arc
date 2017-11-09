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
    startDate: '',
    endDate: '',
  }
  columns = [{
    title: '收款编号',
    dataIndex: 'receiptNoInfos.receiptNo',
    width: 100,
  }, {
    title: '客户名称',
    dataIndex: 'custName',
    width: 300,
  }, {
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 100,
  }, {
    title: '付款阶段',
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
    title: 'SBU',
    dataIndex: 'sbuId',
    width: 100,
  }, {
    title: '部门',
    dataIndex: 'deptId',
    width: 100,
  }, {
    title: '应收金额',
    dataIndex: 'arAmount',
    width: 100,
  }, {
    title: '应收余额',
    dataIndex: 'receivableBalance',
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
    this.setState({ selectedRowKeys: [] })
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
          rowKey="contractItemId"
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
