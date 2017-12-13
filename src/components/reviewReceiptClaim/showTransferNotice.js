/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Button } from 'antd'

class SelectCustomer extends React.Component {
  transfercolumns = [{
    title: 'id',
    dataIndex: 'receiptClaimId',
    width: 150,
  }, {
    title: '详细信息',
    dataIndex: 'statusRemark',
  },
  ]
  render() {
    return (
      <div>
        <Modal
          visible={this.props.showtrNotice}
          onOk={this.props.showTranNotice}
          onCancel={this.props.showTranNotice}
          title=""
          style={{ top: 20, display: this.props.transferNoticeSuccess ? 'true' : 'fasle' }}
          footer={[
            <Button key="cofirm" type="primary" onClick={this.props.showTranNotice}>
              确定
            </Button>,
          ]}
        >
          <div style={{ marign: '10px' }}> 成功传送AR：<span style={{ color: 'red' }}>{this.props.transferNoticeSuccessLength}</span> 条</div>
          <div style={{ display: this.props.transfNoticeFailureLength ? 'block' : 'none' }}>
            传送AR失败：<span style={{ color: 'red' }}>{this.props.transfNoticeFailureLength}</span> 条
            <Table
              rowKey="receiptClaimId"
              columns={this.transfercolumns}
              bordered
              size="middle"
              dataSource={this.props.transfNoticeData.failures}
              // style={{ display: this.props.transfNoticeData.failures.length ? 'ture' : 'false' }}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

SelectCustomer.propTypes = {
  // value: PropTypes.arrayOf(PropTypes.string),
  // initialValue: PropTypes.arrayOf(PropTypes.string),
}

// const SelectCustomerWithForm = Form.create()(SelectCustomer)

export default SelectCustomer
