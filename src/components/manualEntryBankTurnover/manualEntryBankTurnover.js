/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Table, Button } from 'antd'
import PropTypes from 'prop-types'
import ManualEntryBankTurnoverSearchWithForm from './manualEntryBankTurnoverSearch'

const columns = [{
  title: '数据状态',
  dataIndex: '1',
  key: '1',
  width: 100,
}, {
  title: '收款日期',
  dataIndex: '2',
  key: '2',
  width: 100,
}, {
  title: '收款方式',
  dataIndex: '3',
  key: '3',
  width: 100,
}, {
  title: '银行流水号',
  dataIndex: '4',
  key: '4',
  width: 100,
}, {
  title: '客户付款方式',
  dataIndex: '5',
  key: '5',
  width: 100,
}, {
  title: '付款客户名称',
  dataIndex: '6',
  key: '6',
  width: 100,
}, {
  title: '客户付款银行',
  dataIndex: '7',
  key: '7',
  width: 100,
}, {
  title: '客户付款银行账号',
  dataIndex: '8',
  key: '8',
  width: 100,
}, {
  title: '币种',
  dataIndex: '9',
  key: '9',
  width: 100,
}, {
  title: '金额',
  dataIndex: '10',
  key: '10',
  width: 100,
}, {
  title: '客户名称',
  dataIndex: '11',
  key: '11',
  width: 100,
}, {
  title: '操作',
  dataIndex: '12',
  key: '12',
  width: 100,
},
]

export default class ManualEntryBankTurnover extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  handleQuery = () => {
  }
  handleBatchImport = () => {
  }
  render() {
    const rowSelection = {
      type: 'checkBox',
    }
    return (
      <div>
        <ManualEntryBankTurnoverSearchWithForm />
        <Button type="secondary" onClick={this.handleBatchImport()}>批量导入</Button>&nbsp;&nbsp;
        <Button type="secondary">排除</Button>&nbsp;&nbsp;
        <Button type="primary">确认</Button>
        <br /><br />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          bordered
          size="middle"
          pagination="true"
          scroll={{ x: '100%', y: true }}
        />
      </div>
    )
  }
}

ManualEntryBankTurnover.propTypes = {

}
