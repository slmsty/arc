/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Table, Button } from 'antd'
import PropTypes from 'prop-types'
import CBSTurnoverWholenessConfirmSearchWithForm from './cbsTurnoverWholenessConfirmSearch'

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
  title: '币种',
  dataIndex: '3',
  key: '3',
  width: 100,
}, {
  title: '收款金额',
  dataIndex: '4',
  key: '4',
  width: 100,
}, {
  title: '客户名称',
  dataIndex: '5',
  key: '5',
  width: 100,
}, {
  title: '是否项目',
  dataIndex: '6',
  key: '6',
  width: 100,
}, {
  title: '备注',
  dataIndex: '7',
  key: '7',
  width: 100,
}, {
  title: '客户付款方式',
  dataIndex: '8',
  key: '8',
  width: 100,
}, {
  title: '客户付款客户名称',
  dataIndex: '9',
  key: '9',
  width: 100,
}, {
  title: '客户付款银行',
  dataIndex: '10',
  key: '10',
  width: 100,
}, {
  title: '银行流水号',
  dataIndex: '11',
  key: '11',
  width: 100,
},
]

export default class CBSTurnoverWholenessConfirm extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  handleQuery = () => {
  }
  render() {
    const rowSelection = {
      type: 'checkBox',
    }
    return (
      <div>
        <CBSTurnoverWholenessConfirmSearchWithForm />
        <Button type="secondary">编辑</Button>&nbsp;&nbsp;
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

CBSTurnoverWholenessConfirm.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
}
