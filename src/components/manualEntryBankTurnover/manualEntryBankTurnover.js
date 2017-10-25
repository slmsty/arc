/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Table, Button, notification, Icon } from 'antd'
import PropTypes from 'prop-types'
import ManualEntryBankTurnoverSearchWithForm from './manualEntryBankTurnoverSearch'
import EditManualEntryBankTurnoverDataWithForm from './editManualEntryBankTurnoverData'

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

const openNotificationWithIcon = (msg) => {
  notification.error({
    message: '错误',
    description: msg,
  })
}

export default class ManualEntryBankTurnover extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.router = this.context.router
  }
  state = {
    selectedRowKeys: [],
    loading: false,
    editVisible: false,
    editKey: null,
  }
  componentDidMount() {
    this.handleQuery()
  }

  handleSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
    console.log(selectedRowKeys)
  }
  handleEdit = (key) => {
    this.state.editKey = key
    this.setState({ editVisible: true })
  }
  handleDelete = (key) => {
    console.log('delete:' + key)
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
          receiptMethod: ['方法1', '方法2', '方法3'][Math.ceil(Math.random() * 3) - 1],
          bankTurnoverAcct: ['39092300001', '39092300002', '39092300003', '39092300004', '39092300005'][Math.ceil(Math.random() * 5) - 1],
          custPayMethod: ['支付宝', '微信'][Math.ceil(Math.random() * 2) - 1],
          payCustName: ['北京市某某信息技术有限公司', '河北矿业', '中国电信', '中国移动北京分公司', '天津电话好多好多公司'][Math.ceil(Math.random() * 5) - 1],
          custPayBank: ['中国银行保定朝阳北大街支行', '中国银行朝外大街支行', '中国银行北京石景山支行营业部', '中国银行江北支行（营业部）', '中国银行海宁袁花支行', '中国银行福州市晋安支行营业部', '交通银行上海市分行', '交通银行无锡分行'][Math.ceil(Math.random() * 8) - 1],
          custPayBankAcct: ['40092300001', '40092300002', '40092300003', '40092300004', '40092300005'][Math.ceil(Math.random() * 5) - 1],
          currency: ['CNY', 'USD', 'JPY', 'EUR', 'GBP'][Math.ceil(Math.random() * 5) - 1],
          amount: formatMoney(Math.ceil(Math.random() * 10000000) / 100),
          custName: ['北京市某某信息技术有限公司', '河北矿业', '中国电信', '中国移动北京分公司', '天津电话好多好多公司'][Math.ceil(Math.random() * 5) - 1],
          turnoverType: ['项目', '百一测评'][Math.ceil(Math.random() * 2) - 1],
        })
      }
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  handleExcept = () => {
    if (!this.state.selectedRowKeys.length) {
      openNotificationWithIcon('请选择想要排除的数据。')
    } else {
      console.log('调用排除接口，传递数据：[' + this.state.selectedRowKeys + ']，然后刷新列表')
      this.handleQuery()
    }
  }
  handleConfirm = () => {
    console.log('确认。。然后刷新数据。')
    this.handleQuery()
  }
  handleEditConfirm = () => {
    this.setState({ editVisible: false })
    this.handleQuery()
  }
  handleEditCancel = () => {
    this.setState({ editVisible: false })
  }
  render() {
    const { loading, selectedRowKeys, editVisible } = this.state
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }

    return (
      <div>
        <ManualEntryBankTurnoverSearchWithForm
          query={this.handleQuery}
        />
        <Button type="default" onClick={() => { this.context.router.push('/batchImport') }}>批量导入</Button>&nbsp;&nbsp;
        <Button type="default" onClick={this.handleExcept}>排除</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={this.handleConfirm}>确认</Button>
        <br /><br />
        <Table
          rowSelection={rowSelection}
          columns={[{
            title: '数据状态',
            dataIndex: 'dataStatus',
            key: 'dataStatus',
            width: 80,
            fixed: 'left',
          }, {
            title: '收款日期',
            dataIndex: 'receiptDate',
            key: 'receiptDate',
            width: 90,
          }, {
            title: '收款方式',
            dataIndex: 'receiptMethod',
            key: 'receiptMethod',
            width: 100,
          }, {
            title: '银行流水号',
            dataIndex: 'bankTurnoverAcct',
            key: 'bankTurnoverAcct',
            width: 150,
          }, {
            title: '客户付款方式',
            dataIndex: 'custPayMethod',
            key: 'custPayMethod',
            width: 100,
          }, {
            title: '付款客户名称',
            dataIndex: 'payCustName',
            key: 'payCustName',
            width: 300,
          }, {
            title: '客户付款银行',
            dataIndex: 'custPayBank',
            key: 'custPayBank',
            width: 300,
          }, {
            title: '客户付款银行账号',
            dataIndex: 'custPayBankAcct',
            key: 'custPayBankAcct',
            width: 150,
          }, {
            title: '币种',
            dataIndex: 'currency',
            key: 'currency',
            width: 45,
          }, {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
          }, {
            title: '客户名称',
            dataIndex: 'custName',
            key: 'custName',
            width: 300,
          }, {
            title: '流水分类',
            dataIndex: 'turnoverType',
            key: 'turnoverType',
            width: 100,
          }, {
            title: '操作',
            dataIndex: 'ope',
            key: 'ope',
            width: 60,
            textAlign: 'center',
            fixed: 'right',
            render: (text, record) => {
              return (
                <div style={{ fontWeight: 'bold' }}>
                  <Icon type="edit" onClick={() => this.handleEdit(record.key)} />&nbsp;&nbsp;&nbsp;&nbsp;
                  <Icon type="delete" onClick={() => this.handleDelete(record.key)} />
                </div>
              )
            },
          }]}
          dataSource={data}
          bordered
          size="middle"
          pagination="true"
          scroll={{ x: '1875px' }}
        />
        <EditManualEntryBankTurnoverDataWithForm
          width={800}
          onConfirm={this.handleEditConfirm}
          onCancel={this.handleEditCancel}
          editKey={this.state.editKey}
          visible={this.state.editVisible}
        />
      </div>
    )
  }
}

ManualEntryBankTurnover.propTypes = {
}

ManualEntryBankTurnover.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
