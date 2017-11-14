/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table } from 'antd'

class SelectCustomer extends React.Component {
  transfercolumns = [{
    title: 'id',
    dataIndex: 'receiptClaimId',
    width: 80,
  }, {
    title: '详细信息',
    dataIndex: 'remark',
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
          style={{ top: 20 }}
        >
          <div> 成功传送AR {this.props.transferNoticeSuccess} 条输入</div>
          <Table
            rowKey="receiptClaimId"
            columns={this.transfercolumns}
            bordered
            size="middle"
            dataSource={this.props.transfNoticeData.failures}
          />
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
