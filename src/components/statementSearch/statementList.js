/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Row, Col, Form, Radio, DatePicker, Input, Icon } from 'antd'

import StatementWithFrom from './statementWithFrom'

const columns = [{
  title: '签约公司',
  dataIndex: 'signCompany',
  width: 100,
  fixed: 'left',
}, {
  title: '项目编码',
  dataIndex: 'projectIds',
  width: 200,
}, {
  title: '节点',
  dataIndex: 'node',
  width: 100,
}, {
  title: '付款百分比',
  dataIndex: 'paymentPercent',
  width: 100,
}, {
  title: '币种',
  dataIndex: 'receiptCurrency',
  width: 100,
}, {
  title: '应收金额',
  dataIndex: 'reciptAmount',
  width: 100,
  render: (text, record, index) => (text ? text.toFixed(2) : text),
}, {
  title: '收款日期',
  dataIndex: 'receiptDate',
  width: 150,
}, {
  title: '收款编号',
  dataIndex: 'receiptNo',
  width: 200,
}, {
  title: '收款金额',
  dataIndex: 'receiptAmount',
  width: 100,
  render: (text, record, index) => (text ? text.toFixed(2) : text),
}, {
  title: '客户名称',
  dataIndex: 'custName',
  width: 200,
}, {
  title: '合同编码',
  dataIndex: 'contractNo',
  width: 200,
}, {
  title: '合同名称',
  dataIndex: 'contractName',
  width: 300,
}, {
  title: '项目经理',
  dataIndex: 'projectManager',
  width: 100,
}, {
  title: '销售经理',
  dataIndex: 'saleManager',
  width: 100,
}, {
  title: '立项部门',
  dataIndex: 'buildPart',
  width: 100,
}, {
  title: '已开票金额',
  dataIndex: 'billedMoney',
  width: 100,
  render: (text, record, index) => (text ? text.toFixed(2) : text),
},
]
export default class StatementListIndex extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
    stateType: '',
  }
  queryParms = () => {
  }
  render() {
    return (
      <div>
        <StatementWithFrom />
        <br />
        <br />
        <Row  style={{ lineHeight: '28px' }}>
          <Col span={24} style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 'bold' }}>
            <span>收款汇总金额：</span><span className="primary-color" style={{ color: '#F4A034' }}></span>
          </Col>
        </Row>
        <Table
          columns={columns}
          bordered
          size="middle"
          scroll={{ x: '2250px' }}
        />
      </div>
    )
  }
}
