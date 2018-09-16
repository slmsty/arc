/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Button } from 'antd'

class TransferNotice extends React.Component {
  columns = [{
    title: 'id',
    dataIndex: 'orderListLineId',
    width: 150,
  }, {
    title: '详细信息',
    dataIndex: 'statusMessage',
  },
  ]
  render() {
    return (
      <Modal
        width={600}
        visible={true}
        onOk={this.props.closeNotice}
        onCancel={this.props.closeNotice}
        title=""
        style={{ top: 20, display: this.props.sendInfo.orderPushDetailResultList.length ? 'true' : 'fasle' }}
        footer={[
          <Button type="primary" onClick={this.props.closeNotice}>
            确定
          </Button>,
        ]}
      >
        <div style={{ margin: '10px' }}> {this.props.sendInfo.description}</div>
        <div style={{ display: this.props.sendInfo.orderPushDetailResultList.length ? 'block' : 'none' }}>
          <Table
            rowKey="orderListLineId"
            columns={this.columns}
            bordered
            size="small"
            dataSource={this.props.sendInfo.orderPushDetailResultList}
          />
        </div>
      </Modal>
    )
  }
}

export default TransferNotice
