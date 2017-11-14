/**
 * Created by liangshuang on 17/11/10.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'

const columns = [{
  title: 'id',
  dataIndex: 'receiptClaimId',
  width: 80,
}, {
  title: '详细信息',
  dataIndex: 'remark',
},
]
export default class TransferNoticeCom extends React.Component {
  render() {
    const successDataLengh = this.props.showData.succressIds.length
    const failData = this.props.showData.failures
    return (<div>
      <div style={{ display: successDataLengh > 0 ? 'true' : 'false' }}>
        成功传送AR {successDataLengh} 条输入
      </div>
      <Modal
        visible={this.props.showVisition}
        onOk={this.props.showOk}
        onCancel={this.props.showCancel}
        title="请选择GL日期"
      >
        <Table
          rowKey="receiptClaimId"
          columns={columns}
          dataSource={failData}
          bordered
          size="middle"
        />
      </Modal>
    </div>)
  }
}

