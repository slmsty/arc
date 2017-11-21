/* eslint-disable react/prefer-stateless-function,max-len,react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Card, Row, Col, Button, Table, Icon, message, Popconfirm } from 'antd'
import ProjectReceiptClaimSelectFundWithForm from './projectReceiptClaimSelectFundSearch'
import EditableNumberCell from '../common/editableNumberCell'
import EditableTextCell from '../common/editableTextCell'
import EditableSelectCell from '../common/editableSelectCell'
import SelectCustomer from '../common/selectCustomer'

export default class ProjectReceiptClaimModal extends React.Component {
  state = {
    showSelectFund: false,
    funds: [],
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.receiptInfo !== nextProps.receiptInfo) {
      this.setState({ funds: [] })
    }
  }
  edited = false
  columns = [{
    title: '客户名称',
    dataIndex: 'cust',
    width: 200,
    render: (text, record, index) => (<SelectCustomer
      defaultQueryParam={record.custName}
      initialValue={[record.custId, record.custName]}
      onChange={value => this.handleClaimFundChange(index, value, 'cust')}
    />),
  }, {
    title: '认款金额',
    dataIndex: 'claimAmount',
    width: 100,
    render: (text, record, index) => (<EditableNumberCell
      editable
      value={text}
      min={0}
      max={this.props.receiptInfo.receiptCurrency === record.contractCurrency && this.props.receiptInfo.receiptAmount > record.receivableBalance ? record.receivableBalance : this.props.receiptInfo.receiptAmount}
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
    title: '认款合同币种金额',
    dataIndex: 'claimContractAmount',
    width: 150,
    render: (text, record, index) => {
      const editable = this.props.receiptInfo.receiptCurrency !== record.contractCurrency
      return (<EditableNumberCell
        editable={editable}
        value={text}
        min={0}
        max={this.props.receiptInfo.receiptCurrency === record.contractCurrency && this.props.receiptInfo.receiptAmount < record.receivableBalance ? this.props.receiptInfo.receiptAmount : record.receivableBalance}
        onChange={value => this.handleClaimFundChange(index, value, 'claimContractAmount')}
      />)
    },
  }, {
    title: '备注',
    dataIndex: 'accountantApproveMessage',
    width: 200,
    render: (text, record, index) => {
      const editable = true
      return (<EditableTextCell
        editable={editable}
        value={text}
        onChange={value => this.handleClaimFundChange(index, value, 'accountantApproveMessage')}
      />)
    },
  }, {
    title: '应收余额',
    dataIndex: 'fundReceivableBalance',
    width: 100,
  }, {
    title: '应收金额',
    dataIndex: 'receiptAmount',
    width: 100,
  }, {
    title: '合同币种',
    dataIndex: 'contractCurrency',
    width: 100,
  }, {
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 200,
  }, {
    title: '付款条款',
    dataIndex: 'paymentName',
    width: 100,
  }, {
    title: '付款百分比',
    dataIndex: 'paymentPercent',
    width: 100,
  }, {
    title: '合同编码',
    dataIndex: 'contractNo',
    width: 200,
  }, {
    title: '合同名称',
    dataIndex: 'contractName',
    width: 300,
  }, {
    title: 'SBU',
    dataIndex: 'sbuId',
    width: 100,
  }, {
    title: '部门',
    dataIndex: 'deptName',
    width: 100,
  }, {
    title: '项目经理',
    dataIndex: 'manager',
    width: 100,
  }, {
    title: '发票号',
    dataIndex: 'invoiceNo',
    width: 100,
  }, {
    title: '操作',
    dataIndex: 'operate',
    width: 50,
    align: 'center',
    fixed: 'right',
    render: (text, record, index) => (
      <Popconfirm title="您确定要取消认款到这条合同吗？" onConfirm={() => this.handleDeleteFund(index)} okText="是" cancelText="否">
        <Icon type="delete" />
      </Popconfirm>
    ),
  },
  ]
  handleClaimFundChange = (index, value, key) => {
    if (index >= 0 && index < this.state.funds.length) {
      const funds = this.state.funds
      if (key === 'cust') {
        funds[index].custId = value[0]
        funds[index].custName = value[1]
      } else {
        funds[index][key] = value
        if (key === 'claimAmount' && this.props.receiptInfo.receiptCurrency === funds[index].contractCurrency) {
          funds[index].claimContractAmount = value
        }
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
      }
      if (!this.state.funds[i].receiptUse) {
        message.error(`第${i + 1}条收款用途没有选择`)
        return
      }
      if (this.state.funds[i].claimContractAmount === 0) {
        message.error(`第${i + 1}条认款合同币种金额没有填写`)
        return
      }
      totalClaimAmount += this.state.funds[i].claimAmount
    }
    if (totalClaimAmount.toFixed(2) !== this.props.receiptInfo.receiptAmount.toFixed(2)) {
      message.error('认款金额合计与收款金额不相等，不能进行认款')
      return
    }
    const self = this
    const claimItemsConfirm = this.state.funds.map(fund => (<p>条款【{fund.paymentName + (fund.claimContractAmount === fund.fundReceivableBalance ? '】全部认款' : '】认款后应收余额不为0')}</p>))
    Modal.confirm({
      title: '确认认款',
      content: claimItemsConfirm,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        const claimItems = self.state.funds.map(fund => ({
          fundId: fund.fundId,
          contractItemId: fund.contractItemId,
          claimAmount: fund.claimAmount,
          receiptUse: fund.receiptUse,
          claimContractAmount: fund.claimContractAmount,
          remark: fund.accountantApproveMessage,
          custId: fund.custId,
          custName: fund.custName,
        }))
        self.props.submitClaim({
          receiptClaimId: self.props.receiptInfo.receiptClaimId,
          claimItems,
        })
      },
    })
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
          const fund = addFund
          if (this.props.receiptInfo.receiptCurrency === addFund.contractCurrency) {
            fund.claimAmount = this.props.receiptInfo.receiptAmount < addFund.receivableBalance ? this.props.receiptInfo.receiptAmount : addFund.receivableBalance
            fund.claimContractAmount = fund.claimAmount
          } else {
            fund.claimAmount = this.props.receiptInfo.receiptAmount
            fund.claimContractAmount = addFund.receivableBalance
          }
          fund.receiptAmount = addFund.arAmount
          fund.fundReceivableBalance = addFund.receivableBalance
          fund.receiptUse = 'On account'
          fund.custId = ''
          funds.push(fund)
        }
      })
      this.setState({ funds })
    }
    this.edited = true
    this.setState({ showSelectFund: false })
  }
  handleDeleteFund = (fundIdx) => {
    const funds = this.state.funds
    funds.splice(fundIdx, 1)
    this.setState({ funds })
    this.edited = true
  }
  handleCloseClaim = () => {
    if (this.edited && this.state.funds.length > 0) {
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
    } else {
      this.props.closeClaim()
    }
  }
  render() {
    return (
      <div>
        <Modal
          wrapClassName="vertical-center-modal"
          width={1024}
          title="项目认款"
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
              <Col style={{ textAlign: 'right' }} span={3} key={1}>付款客户名称：</Col>
              <Col span={5} key={2}>{this.props.receiptInfo.payCustName}</Col>
            </Row>
          </Card>
          <br />
          <Button key="add" type="primary" onClick={() => { this.setState({ showSelectFund: true }) }}><Icon type="plus-circle-o" />增加合同百分比</Button>&nbsp;&nbsp;
          <br />
          <br />
          <Table
            rowKey="fundId"
            columns={this.columns}
            bordered
            size="middle"
            locale={{
              emptyText: '请增加合同百分比',
            }}
            dataSource={this.state.funds}
            pagination={false}
            scroll={{ x: 2500 }}
          />
        </Modal>
        <ProjectReceiptClaimSelectFundWithForm
          receiptClaimFundList={this.props.receiptClaimFundList}
          getPhaseCompleted={this.props.getPhaseCompleted}
          receiptInfo={this.props.receiptInfo}
          visible={this.state.showSelectFund}
          onClose={this.handleCloseSelectFunds}
          getPhase={this.props.getPhase}
        />
      </div>
    )
  }
}

ProjectReceiptClaimModal.propTypes = {
  receiptInfo: PropTypes.shape({
    receiptClaimId: PropTypes.number,
    receiptAmount: PropTypes.number,
    bankTransactionNo: PropTypes.string,
    receiptNo: PropTypes.string,
    payCustName: PropTypes.string,
    paymentNameId: PropTypes.string,
    receiptCurrency: PropTypes.string,
  }).isRequired,
  receiptClaimFundList: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.arrayOf.isRequired,
  }).isRequired,
  closeClaim: PropTypes.func.isRequired,
  submitClaim: PropTypes.func.isRequired,
  getPhase: PropTypes.func.isRequired,
  getPhaseCompleted: PropTypes.number.isRequired,
}
