/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Card, Row, Col, Button, Table, Icon } from 'antd'
import NoProjectReceiptClaimSelectOrderWithForm from './noProjectReceiptClaimSelectOrderSearch'

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
  title: '币种',
  dataIndex: '6',
  key: '6',
  width: 100,
}, {
  title: '订单号',
  dataIndex: '7',
  key: '7',
  width: 100,
},
]

export default class ClaimModal extends React.Component {
  state = {
    showSelectOrder: false,
  }
  handleOk = () => {
    this.props.onClose(true)
  }
  handleCloseSelectOrder = (contracts) => {
    console.log(contracts)
    this.setState({ showSelectOrder: false })
  }
  render() {
    const rowSelection = {
      type: 'checkBox',
    }
    return (
      <div>
        <Modal
          width={1024}
          title="非项目认款"
          visible={this.props.visible}
          onCancel={() => { this.props.onClose(false) }}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="save" />保存
            </Button>,
          ]}
        >
          <Card>
            <Row>
              <Col style={{ textAlign: 'right' }} span={3} key={1}>收款金额：</Col>
              <Col span={5} key={2}>收款金额</Col>
              <Col style={{ textAlign: 'right' }} span={3} key={3}>银行流水号：</Col>
              <Col span={5} key={4}>收款金额</Col>
              <Col style={{ textAlign: 'right' }} span={3} key={5}>收款编号：</Col>
              <Col span={5} key={6}>收款金额</Col>
            </Row>
            <Row>
              <Col style={{ textAlign: 'right' }} span={3} key={1}>客户名称：</Col>
              <Col span={5} key={2}>收款金额</Col>
            </Row>
          </Card>
          <br />
          <Button key="add" type="primary" onClick={() => { this.setState({ showSelectOrder: true }) }}><Icon type="plus-circle-o" />增加订单</Button>&nbsp;&nbsp;
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
        <NoProjectReceiptClaimSelectOrderWithForm
          visible={this.state.showSelectOrder}
          onClose={this.handleCloseSelectOrder}
        />
      </div>
    )
  }
}

ClaimModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
