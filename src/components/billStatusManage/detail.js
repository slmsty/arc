/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Input, Form, Table, message } from 'antd'

class ApplyInfoModal extends React.Component {
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
    let dataSource = []
    dataSource.push(this.props.data)
    console.log(dataSource)
    const columns = [{
      title: '数据状态',
      dataIndex: 'splitStatus',
      width: 80,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '发票号码',
      dataIndex: 'contractInnerNo',
      width: 100,
    }, {
      title: '签约公司',
      dataIndex: 'projectId',
      width: 200,
    }, {
      title: '开票客户名称',
      dataIndex: 'contractName',
      width: 300,
    }, {
      title: '发票类型',
      dataIndex: 'paymentName',
      width: 100,
    }, {
      title: '发票代码',
      dataIndex: 'badDebtAmount',
      width: 100,
      render: (text, record) => (
        <a href="javascript:;">{text}</a>
      ),
    }, {
      title: '开票日期',
      dataIndex: 'applicationDate',
      width: 150,
    }, {
      title: '含税金额',
      dataIndex: 'arDate',
      width: 150,
      render: (text, record) => (text ? text.toFixed(2) : text),
    }, {
      title: '税率',
      dataIndex: 'billedArBalance',
      width: 100,
    }, {
      title: '不含税金额',
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
          title="发票详情"
          visible={this.props.detailVisible}
          onCancel={this.props.closeDetailModal}
          onOk={this.props.closeDetailModal}
        >
          <Button onClick={this.disableItem}>作废</Button> &nbsp;&nbsp;
          <br />
          <br />
          <Table
            rowKey="receiptClaimId"
            rowSelection={rowSelection}
            columns={columns}
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
ApplyInfoModal.propTypes = {
  closeClaim: PropTypes.func.isRequired,
  applyReject: PropTypes.func.isRequired,
  applyComfirm: PropTypes.func.isRequired,
  infoVisitable: PropTypes.bool.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
}
const ApplyInfoModalWithForm = Form.create()(ApplyInfoModal)

export default ApplyInfoModalWithForm
