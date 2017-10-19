/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Row, Col, Table, Button } from 'antd'
import PropTypes from 'prop-types'
import CBSTurnoverWholenessConfirmSearchWithForm from './cbsTurnoverWholenessConfirmSearch'

const columns = [{
  title: '数据状态',
  dataIndex: 'dataStatus',
  key: 'dataStatus',
  width: 100,
}, {
  title: '收款日期',
  dataIndex: 'receiptDate',
  key: 'receiptDate',
  width: 100,
}, {
  title: '币种',
  dataIndex: 'currency',
  key: 'currency',
  width: 100,
}, {
  title: '收款金额',
  dataIndex: 'amount',
  key: 'amount',
  width: 100,
}, {
  title: '客户名称',
  dataIndex: 'custName',
  key: 'custName',
  width: 100,
}, {
  title: '流水分类',
  dataIndex: 'turnoverType',
  key: 'turnoverType',
  width: 100,
}, {
  title: '备注',
  dataIndex: 'comment',
  key: 'comment',
  width: 100,
},
]

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

const data = []

export default class CBSTurnoverWholenessConfirm extends React.Component {
  state = {
    selectedRowKeys: [],
    loading: false,
    summary: '',
  }
  componentDidMount() {
    this.handleQuery()
  }
  handleSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
    console.log(selectedRowKeys)
  }
  handleQuery = () => {
    this.setState({ loading: true })
    // ajax request after empty completing
    setTimeout(() => {
      for (let i = 0; i < 46; i++) {
        data.push({
          key: i,
          dataStatus: ['新建', '无需认款', '出纳待确认', '会计退回'][Math.ceil(Math.random() * 4) - 1],
          receiptDate: formatDate(new Date(new Date().valueOf() - Math.ceil(Math.random() * 2592000000))),
          currency: ['CNY', 'USD', 'JPY', 'EUR', 'GBP'][Math.ceil(Math.random() * 5) - 1],
          amount: formatMoney(Math.ceil(Math.random() * 10000000) / 100),
          custName: ['北京市某某信息技术有限公司', '河北矿业', '中国电信', '中国移动北京分公司', '天津电话好多好多公司'][Math.ceil(Math.random() * 5) - 1],
          turnoverType: ['项目', '百一测评'][Math.ceil(Math.random() * 2) - 1],
          comment: '',
        })
      }
      this.setState({
        selectedRowKeys: [],
        loading: false,
        summary: 'CNY:320,042.32  USD:320,492.49',
      })
    }, 1000)
  }
  render() {
    const { loading, selectedRowKeys } = this.state
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }
    return (
      <div>
        <CBSTurnoverWholenessConfirmSearchWithForm />
        <br />
        <Row style={{ lineHeight: '28px' }}>
          <Col span={8}>
            <Button type="default">编辑</Button>&nbsp;&nbsp;
            <Button type="default">人工录入</Button>&nbsp;&nbsp;
            <Button type="default">排除</Button>&nbsp;&nbsp;
            <Button type="primary">确认</Button>&nbsp;&nbsp;
          </Col>
          <Col span={16} style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 'bold' }}>
            <span>金额合计：</span><span className="primary-color" style={{ color: '#F4A034' }}>{this.state.summary}</span>
          </Col>
        </Row>
        <br />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
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
}
