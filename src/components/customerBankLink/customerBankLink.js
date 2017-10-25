/**
 * Created by liangshuang on 17/10/20.
 */
/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal, Form, Row, Col } from 'antd'
import CustomerBankLinkWithForm from './customerBankLinkSearch'
import EditBankLinkData from './editBankLinkData'


const data = []
export default class CustomerBankLink extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      delVisible: false,
      editVisible: false,
      selectedRow: '',
    }
    this.handleDel = this.handleDel.bind(this)
  }
  componentDidMount() {
    this.testData()
  }
  handleQuery = (record) => {
  }
  showEditModal = (e) => {
    this.setState({
      editVisible: true,
    })
  }
  handleEditOk = (e) => {
    this.setState({
      editVisible: false,
    })
  }
  handleEditCancel = (e) => {
    this.setState({
      editVisible: false,
    })
  }
  handleDel = (record) => {
    console.log(record)
    // 返回数据给后台
    this.handleQuery(record)
    // 删除成功显示按钮
    this.setState({
      delVisible: true,
    })
  }
  testData = () => {
    this.setState({ loading: true })
    // ajax request after empty completing
    setTimeout(() => {
      for (let i = 0; i < 46; i++) {
        data.push({
          key: i,
          bank: ['北京银行', '中国银行', '农业银行', '交通银行'][Math.ceil(Math.random() * 4) - 1],
          customer: ['北京市某某信息技术有限公司', '河北矿业', '中国电信', '中国移动北京分公司', '天津电话好多好多公司'][Math.ceil(Math.random() * 5) - 1],
          linkFrom: ['项目', '百一测评'][Math.ceil(Math.random() * 2) - 1],
          bankAccount:Math.random() * 1000,
          receiptMethod: ['test1', 'test2'][Math.ceil(Math.random() * 2) - 1],
        })
      }
      this.setState({
        loading: false,
      })
    }, 1000)
  }
  render() {
    const columns = [{
      title: '操作按钮',
      dataIndex: 'operateBtn',
      key: '1',
      width: 100,
      render: (text, record, index) => (
        <div>
          <Button onClick={this.showEditModal}>编辑</Button>&nbsp;&nbsp;
          <Button onClick={this.handleDel.bind(this, record)}>删除</Button>
        </div>
      ),
    }, {
      title: '客户名称',
      dataIndex: 'customer',
      key: '2',
      width: 100,
    }, {
      title: '银行名称',
      dataIndex: 'bank',
      key: '3',
      width: 100,
    }, {
      title: '银行帐号',
      dataIndex: 'bankAccount',
      key: '4',
      width: 100,
    }, {
      title: '收款方法',
      dataIndex: 'receiptMethod',
      key: '5',
      width: 100,
    }, {
      title: '关系来源',
      dataIndex: 'linkFrom',
      key: '6',
      width: 100,
    },
    ]
    const rowSelection = {
      type: 'checkBox',
      onSelect: (record, selected, selectedRows) => {
      },
    }
    return (<div>
      <CustomerBankLinkWithForm />
      <br />
      <br />
      <br />
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        size="middle"
        bordered
        pagination="true"
        scroll={{ y: true }}
      />
      { /* 删除modal */ }
      <EditBankLinkData
        onConfirm={this.handleEditOk}
        onCancel={this.handleEditCancel}
        visible={this.state.editVisible}
      />
    </div>)
  }
}
