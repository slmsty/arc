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
  dataIndex: 'status',
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
const data = []
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

export default class ReviewReceiptClaim extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      approve: false,
      return: false,
      transfer: false,
      submitData: [],
      returnData: [],
      transferData: [],
    }
  }

  componentDidMount() {
    this.testData()
  }
  // approve submit
  approveClick = () => {
    let submitDatas = this.state.submitData;
    alert ("审批成功" + submitDatas.length + '条数据')
  }
  // 认款退回
  returnClick = () => {
    let returnDatas = this.state.returnData
    alert ("认款退回成功" + returnDatas.length + "条数据，数据状态变为'复核退回'")
  }
  // 传送AR
  transferClick = () => {
    let transferDatas = this.state.transferData
    alert ('认款退回成功' + transferDatas.length + "条数据，数据状态变为'已传送AR'")
  }

  testData = () => {
    this.setState({ loading: true })
    // ajax request after empty completing
    setTimeout(() => {
      for (let i = 0; i < 46; i++) {
        data.push({
          key: i,
          status: ['会计已认款', '等待传送AR', '已传送AR', '传送失败'][Math.ceil(Math.random() * 4) - 1],
          2: formatDate(new Date(new Date().valueOf() - Math.ceil(Math.random() * 2592000000))),
          9: ['CNY', 'USD', 'JPY', 'EUR', 'GBP'][Math.ceil(Math.random() * 5) - 1],
          6: formatMoney(Math.ceil(Math.random() * 10000000) / 100),
          5: ['北京市某某信息技术有限公司', '河北矿业', '中国电信', '中国移动北京分公司', '天津电话好多好多公司'][Math.ceil(Math.random() * 5) - 1],
          3: ['项目', '百一测评'][Math.ceil(Math.random() * 2) - 1],
          20:Math.random() * 1000,
        })
      }
      this.setState({
        loading: false,
      })
    }, 1000)
  }
  render() {
    const rowSelection = {
      type: 'checkBox',
      onSelect: (record, selected, selectedRows) => {
      },
      onChange: (selectedRowKeys, selectedRows) => {
        const aprove = []
        for (let i = 0; i < selectedRows.length; i++) {
          aprove[i] = selectedRows[i].status
        }
        if (aprove.indexOf('会计已认款') >= 0) {
          this.setState({
            approve: true,
            submitData: selectedRows,
          })
        } else {
          this.setState({
            approve: false,
            submitData: [],
          })
        }
        if (aprove.indexOf('会计已认款') >= 0 || aprove.indexOf('等待传送AR') >= 0 || aprove.indexOf('传送失败') >= 0) {
          this.setState({
            return: true,
            returnData: selectedRows,
          })
        } else {
          this.setState({
            return: false,
            returnData: [],
          })
        }
        if (aprove.indexOf('等待传送AR') >= 0 || aprove.indexOf('传送失败') >= 0) {
          this.setState({
            transfer: true,
            transferData: selectedRows,
          })
        } else {
          this.setState({
            transfer: false,
            transferData: [],
          })
        }
      },
    }
    return (<div>
      <ReviewReceiptClaimSearchWithForm />
      <Button type="danger" disabled={!this.state.approve} onClick= { this.approveClick.bind(this)}>审批</Button>&nbsp;&nbsp;
      <Button type="primary" disabled={!this.state.return} onClick= { this.returnClick.bind(this)}>认款退回</Button>&nbsp;&nbsp;
      <Button type="dashed" disabled={!this.state.transfer} onClick= { this.transferClick.bind(this)}>传送AR</Button>
      <br /><br />
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        bordered
        size="middle"
        pagination="true"
        scroll={{ x: '260%', y: true }}
      />
    </div>)
  }
}
