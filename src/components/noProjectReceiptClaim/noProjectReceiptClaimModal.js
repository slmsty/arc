/* eslint-disable react/prefer-stateless-function,max-len,react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Card, Row, Col, Button, Table, Icon, message } from 'antd'
import NoProjectReceiptClaimSelectOrderWithForm from './noProjectReceiptClaimSelectOrderSearch'
import EditableNumberCell from '../common/editableNumberCell'
import EditableTextCell from '../common/editableTextCell'
import EditableSelectCell from '../common/editableSelectCell'

export default class ProjectReceiptClaimModal extends React.Component {
  state = {
    showSelectFund: false,
    selectedRowKeys: [],
    funds: [],
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }
  edited = false
  columns = [{
    title: '客户名称',
    dataIndex: 'custName',
    width: 100,
  }, {
    title: '认款金额',
    dataIndex: 'claimAmount',
    width: 100,
    render: (text, record, index) => (<EditableNumberCell
      editable
      value={text}
      min={0}
      max={record.receiptAmountDD < this.props.receiptInfo.receiptAmount ? record.receiptAmountDD : this.props.receiptInfo.receiptAmount}
      onChange={value => this.handleClaimFundChange(index, value, 'claimAmount')}
    />),
  }, {
    title: '收款用途',
    dataIndex: 'receiptUse',
    width: 100,
    render: (text, record, index) => (<EditableSelectCell
      editable
      value={text}
      options={[{ id: 'On account', name: 'On account' }, { id: 'Deposit', name: 'Deposit' }]}
      onChange={value => this.handleClaimFundChange(index, value, 'receiptUse')}
    />),
  }, {
    title: '备注',
    dataIndex: 'accountantApproveMessage',
    width: 200,
    render: (text, record, index) => {
      return (<EditableTextCell
        editable
        value={text}
        onChange={value => this.handleClaimFundChange(index, value, 'accountantApproveMessage')}
      />)
    },
  }, {
    title: '应收余额',
    dataIndex: 'receiptAmountDD',
    width: 100,
  }, {
    title: '应收金额',
    dataIndex: 'receiptAmount',
    width: 100,
  }, {
    title: '币种',
    dataIndex: 'invoiceNo',
    width: 100,
  }, {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 100,
  },
  ]
  handleClaimFundChange = (index, value, key) => {
    if (index >= 0 && index < this.state.funds.length) {
      const funds = this.state.funds
      if (key === 'claimAmount') {
        funds[index].claimAmount = value
      } else if (key === 'receiptUse') {
        funds[index].receiptUse = value
      } else if (key === 'accountantApproveMessage') {
        funds[index].accountantApproveMessage = value
      }
      this.setState({ funds })
      this.edited = true
    }
  }
  handleSubmit = () => {
    let totalClaimAmount = 0
    for (let i = 0; i < this.state.funds.length; i += 1) {
      if (this.state.funds[i].claimAmount === 0) {
        message.error(`第${i + 1}条认款金额没有填写`)
        return
      } else if (!this.state.funds[i].receiptUse) {
        message.error(`第${i + 1}条收款用途没有选择`)
        return
      }
      totalClaimAmount += this.state.funds[i].claimAmount
    }
    if (totalClaimAmount.toFixed(2) !== this.props.receiptInfo.receiptAmount.toFixed(2)) {
      message.error('认款金额合计与收款金额不相等，不能进行认款')
      return
    }
    this.props.submitClaim(this.props.receiptInfo.receiptClaimId, this.state.funds)
  }
  handleCloseSelectFunds = (addFunds) => {
    if (addFunds && addFunds.length > 0) {
      const funds = this.state.funds
      addFunds.forEach((addFund) => {
        let isExist = false
        for (let i = 0; i < funds.length; i += 1) {
          if (funds[i].fundId === addFund.fundId) {
            isExist = true
            break
          }
        }
        if (!isExist) {
          funds.push(addFund)
        }
      })
      this.setState({ funds })
    }
    this.setState({ showSelectFund: false })
    this.edited = true
  }
  handleDeleteFund = () => {
    const funds = this.state.funds
    this.state.selectedRowKeys.forEach((deleteFundId) => {
      for (let i = 0; i < funds.length; i += 1) {
        if (funds[i].fundId === deleteFundId) {
          funds.splice(i, 1)
          break
        }
      }
    })
    this.setState({ selectedRowKeys: [], funds })
    this.edited = true
  }
  handleCloseClaim = () => {
    if (this.edited) {
      const that = this
      Modal.confirm({
        title: '操作确认',
        content: '您已修改了认款数据，是否确认放弃修改',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          that.props.closeClaim()
        },
      })
    }
  }
  render() {
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <Modal
          width={1024}
          title="订单认款"
          visible={!!this.props.receiptInfo.receiptClaimId}
          onCancel={this.handleCloseClaim}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleSubmit}>
              <Icon type="save" />保存
            </Button>,
          ]}
        >
          <Card>
            <Row>
              <Col style={{ textAlign: 'right' }} span={3} key={1}>收款金额：</Col>
              <Col span={5} key={2}>{this.props.receiptInfo.receiptAmount}</Col>
              <Col style={{ textAlign: 'right' }} span={3} key={3}>银行流水号：</Col>
              <Col span={5} key={4}>{this.props.receiptInfo.bankTransactionNo}</Col>
              <Col style={{ textAlign: 'right' }} span={3} key={5}>收款编号：</Col>
              <Col span={5} key={6}>{this.props.receiptInfo.receiptNo}</Col>
            </Row>
            <Row>
              <Col style={{ textAlign: 'right' }} span={3} key={1}>客户名称：</Col>
              <Col span={5} key={2}>{this.props.receiptInfo.payCustName}</Col>
            </Row>
          </Card>
          <br />
          <Button key="add" type="primary" onClick={() => { this.setState({ showSelectFund: true }) }}><Icon type="plus-circle-o" />增加客户订单</Button>&nbsp;&nbsp;
          <br />
          <br />
          <Table
            rowKey="fundId"
            rowSelection={rowSelection}
            columns={this.columns}
            bordered
            locale={{
              emptyText: '请增加订单',
            }}
            size="middle"
            dataSource={this.state.funds}
            pagination={false}
            scroll={{ x: '150%' }}
          />
        </Modal>
        <NoProjectReceiptClaimSelectOrderWithForm
          receiptClaimOrderList={this.props.receiptClaimOrderList}
          visible={this.state.showSelectFund}
          onClose={this.handleCloseSelectFunds}
          getOrder={this.props.getOrder}
          getOrderCompleted={this.props.getOrderCompleted}
        />
      </div>
    )
  }
}

ProjectReceiptClaimModal.propTypes = {
  receiptInfo: PropTypes.shape({
    receiptClaimId: PropTypes.string.isRequired,
    receiptAmount: PropTypes.number.isRequired,
    bankTransactionNo: PropTypes.string.isRequired,
    receiptNo: PropTypes.string.isRequired,
    payCustName: PropTypes.string.isRequired,
  }).isRequired,
  receiptClaimOrderList: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
  closeClaim: PropTypes.func.isRequired,
  submitClaim: PropTypes.func.isRequired,
  getOrder: PropTypes.func.isRequired,
  getOrderCompleted: PropTypes.number.isRequired,
}
