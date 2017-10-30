/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Card, Row, Col, Button, Table, Icon } from 'antd'
import ProjectReceiptClaimSelectContractWithForm from './projectReceiptClaimSelectContractSearch'

const columns = [{
  title: '客户名称',
  dataIndex: '1',
  key: '1',
  width: 100,
}, {
  title: '认款金额',
  dataIndex: '2',
  key: '2',
  width: 100,
}, {
  title: '收款用途',
  dataIndex: '3',
  key: '3',
  width: 100,
}, {
  title: '备注',
  dataIndex: 'remark',
  key: 'remark',
  width: 100,
}, {
  title: '应收余额',
  dataIndex: '4',
  key: '4',
  width: 100,
}, {
  title: '应收金额',
  dataIndex: '5',
  key: '5',
  width: 100,
}, {
  title: '项目编码',
  dataIndex: '6',
  key: '6',
  width: 100,
}, {
  title: '合同编码',
  dataIndex: '7',
  key: '7',
  width: 100,
}, {
  title: '合同名称',
  dataIndex: '8',
  key: '8',
  width: 100,
}, {
  title: '项目阶段',
  dataIndex: '9',
  key: '9',
  width: 100,
}, {
  title: '付款百分比',
  dataIndex: '10',
  key: '10',
  width: 100,
}, {
  title: '发票号',
  dataIndex: '11',
  key: '11',
  width: 100,
}, {
  title: 'SBU',
  dataIndex: '12',
  key: '12',
  width: 100,
},
]

export default class ProjectReceiptClaimModal extends React.Component {
  state = {
    showSelectContract: false,
    contracts: [],
  }
  handleSubmit = () => {
    this.props.submitClaim()
  }
  handleCloseSelectContract = (contracts) => {
    this.setState({ showSelectContract: false, contracts: this.state.contracts.push(contracts) })
  }
  render() {
    const rowSelection = {
      type: 'checkBox',
    }
    return (
      <div>
        <Modal
          width={1024}
          title="项目认款"
          visible={this.props.receiptInfo.receiptClaimId}
          onCancel={() => { this.props.closeClaim(false) }}
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
          <Button key="add" type="primary" onClick={() => { this.setState({ showSelectContract: true }) }}><Icon type="plus-circle-o" />增加合同百分比</Button>&nbsp;&nbsp;
          <Button type="danger">删除</Button>
          <br />
          <br />
          <Table
            rowSelection={rowSelection}
            columns={columns}
            bordered
            size="middle"
            scroll={{ x: '150%', y: true }}
          />
        </Modal>
        <ProjectReceiptClaimSelectContractWithForm
          visible={this.state.showSelectContract}
          onClose={this.handleCloseSelectContract}
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
  closeClaim: PropTypes.func.isRequired,
  submitClaim: PropTypes.func.isRequired,
}
