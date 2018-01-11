/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Input, Form, Table, message } from 'antd'

class CancelModal extends React.Component {
  state = {
    selectedRowKeys: '',
    selectedRows: '',
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  // 作废
  disableItem = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要作废的数据')
      return
    }
    if (this.state.selectedRowKeys.length > 1) {
      message.error('一次只能作废一条数据')
      return
    }
    const that = this
    let successMsg = `作废成功${this.state.selectedRowKeys.length}条数据`
    let failMsg = `${this.state.selectedRowKeys.length}条数据作废失败，且提示失败原因`
    Modal.info({
      content: failMsg,
    })
  }
  render() {
    let dataSource = this.props.data
    console.log(dataSource)
    const columns = [{
      title: '项目编码',
      dataIndex: 'projectCode',
      width: 80,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '签约公司',
      dataIndex: 'invoiceCompany',
      width: 100,
    }, {
      title: '合同编码',
      dataIndex: 'contractCode',
      width: 200,
    }, {
      title: '付款条件',
      dataIndex: 'paymentTerm',
      width: 300,
    }, {
      title: '付款条款',
      dataIndex: 'paymentName',
      width: 100,
    }, {
      title: '付款阶段',
      dataIndex: 'paymentPhrases',
      width: 100,
      render: (text, record) => (
        <a href="javascript:;">{text}</a>
      ),
    }, {
      title: '付款金额',
      dataIndex: 'paymentAmount',
      width: 150,
    }, {
      title: 'Billed AR金额',
      dataIndex: 'arAmount',
      width: 150,
      render: (text, record) => (text ? text.toFixed(2) : text),
    }, {
      title: '已开票金额',
      dataIndex: 'invoiceAmount',
      width: 100,
    }, {
      title: '作废金额',
      dataIndex: 'badDebtProvisionAmount',
      width: 150,
      render: (text, record) => (text ? text.toFixed(2) : text),
    },
    ]
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <Modal
          width={1024}
          title="作废详情"
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          onOk={this.props.onOk}
          footer={null}
        >
          <Button onClick={this.disableItem}>作废</Button> &nbsp;&nbsp;
          <br />
          <br />
          <Table
            rowKey="receiptClaimId"
            rowSelection={rowSelection}
            columns={columns}
            pagination ={false}
            bordered
            size="small"
            scroll={{ x: '1400px' }}
            dataSource={dataSource}
          />
        </Modal>
      </div>
    )
  }
}
CancelModal.propTypes = {
  closeClaim: PropTypes.func.isRequired,
  applyReject: PropTypes.func.isRequired,
  applyComfirm: PropTypes.func.isRequired,
  infoVisitable: PropTypes.bool.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
}
const CancelModalWithForm = Form.create()(CancelModal)

export default CancelModalWithForm
