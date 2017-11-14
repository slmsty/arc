/**
 * Created by liangshuang on 17/11/14.
 */
/**
 * Created by liangshuang on 17/11/10.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table } from 'antd'

const columns = [{
  title: 'id',
  dataIndex: 'receiptClaimId',
  width: 80,
}, {
  title: '详细信息',
  dataIndex: 'remark',
},
]
class TransferNoticeCom extends React.Component {
  // const param = this.props.form.getFieldsValue()
  handleQuery = () => {
    // 验证通过后查询
  }
  render() {
    const successDataLengh = this.props.showData.succressIds.length
    const failData = this.props.showData.failures
    return (<div>
      <Modal
        visible={this.props.showVisition}
        onOk={this.props.showOk}
        onCancel={this.props.showCancel}
        title="请选择GL日期"
      >
        <div style={{ display: successDataLengh > 0 ? 'true' : 'false' }}>
          成功传送AR {successDataLengh} 条输入
        </div>
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
TransferNoticeCom.propTypes = {
}

export default TransferNoticeCom
