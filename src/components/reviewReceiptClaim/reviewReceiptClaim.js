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
  dataIndex: '1',
  key: '1',
  width: 100,
  fixed: 'left',
}, {
  title: '收款日期',
  dataIndex: '2',
  key: '2',
  width: 100,
}, {
  title: '收款分类',
  dataIndex: '3',
  key: '3',
  width: 100,
}, {
  title: '业务实体',
  dataIndex: '4',
  key: '4',
  width: 100,
}, {
  title: '客户名称',
  dataIndex: '5',
  key: '5',
  width: 100,
}, {
  title: '认款金额',
  dataIndex: '6',
  key: '6',
  width: 100,
}, {
  title: '收款用途',
  dataIndex: '7',
  key: '7',
  width: 100,
}, {
  title: '备注',
  dataIndex: '8',
  key: '8',
  width: 100,
}, {
  title: '币种',
  dataIndex: '9',
  key: '9',
  width: 100,
}, {
  title: '收款金额',
  dataIndex: '10',
  key: '10',
  width: 100,
}, {
  title: '订单号',
  dataIndex: '11',
  key: '11',
  width: 100,
}, {
  title: '项目编号',
  dataIndex: '12',
  key: '12',
  width: 100,
}, {
  title: '付款百分比',
  dataIndex: '13',
  key: '13',
  width: 100,
}, {
  title: '合同编码',
  dataIndex: '14',
  key: '14',
  width: 100,
}, {
  title: '合同名称',
  dataIndex: '15',
  key: '15',
  width: 100,
}, {
  title: '发票号',
  dataIndex: '16',
  key: '16',
  width: 100,
}, {
  title: 'SBU',
  dataIndex: '17',
  key: '17',
  width: 100,
}, {
  title: '部门',
  dataIndex: '18',
  key: '18',
  width: 100,
}, {
  title: '收款注销标识',
  dataIndex: '19',
  key: '19',
  width: 100,
}, {
  title: '银行流水号',
  dataIndex: '20',
  key: '20',
  width: 100,
}, {
  title: '付款客户名称',
  dataIndex: '21',
  key: '21',
  width: 100,
}, {
  title: '客户付款银行',
  dataIndex: '22',
  key: '22',
  width: 100,
}, {
  title: '客户付款银行账号',
  dataIndex: '23',
  key: '23',
  width: 100,
}, {
  title: '收款编号',
  dataIndex: '24',
  key: '24',
  width: 100,
}, {
  title: '认款人',
  dataIndex: '25',
  key: '25',
  width: 100,
}, {
  title: '复核人',
  dataIndex: '26',
  key: '26',
  width: 100,
},
]
export default class ReviewReceiptClaim extends React.Component {
  state = {
  }
  componentDidMount() {
  }
  render() {
    const rowSelection = {
      type: 'checkBox',
    }
    return (
      <div>
        <ReviewReceiptClaimSearchWithForm />
        <Button type="danger">审批</Button>&nbsp;&nbsp;
        <Button type="primary">认款退回</Button>&nbsp;&nbsp;
        <Button type="dashed">传送AR</Button>
        <br /><br />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          bordered
          size="middle"
          pagination="true"
          scroll={{ x: '260%', y: true }}
        />
      </div>
    )
  }
}
