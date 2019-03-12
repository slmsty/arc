/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Input, Form, Table } from 'antd'
import EditReturnModal from './BDModal2'

let sendFlag = false
let editFlag = false
const columns = [
  {
    title: 'GL已提坏账金额',
    dataIndex: 'badDebtProvisionAmount',
    width: 140,
  },
  {
    title: 'Billed AR余额',
    dataIndex: 'billedArBalance',
    width: 140,
  },
  {
    title: '坏账划销金额',
    dataIndex: 'badDebtAmount',
    width: 140,
  },
  {
    title: '已划销退回金额',
    dataIndex: 'badDebtReturnAmount',
    width: 140,
  },
  {
    title: <span>划销退回金额<em style={{ color: '#FF0000' }}>*</em></span>,
    dataIndex: 'badDebtBackAmount',
    width: 140,
  },
  {
    title: <span>GL日期<em style={{ color: '#FF0000' }}>*</em></span>,
    dataIndex: 'glDate',
    width: 80,
  },
  {
    title: '备注',
    dataIndex: 'badDebtBackRemark',
    width: 300,
  },
  {
    title: 'Billed AR金额',
    dataIndex: 'billedArAmount',
    width: 140,
  },
  {
    title: '回款金额',
    dataIndex: 'receiptAmount',
    width: 140,
  },
  {
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 140,
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    width: 140,
  },
  {
    title: '签约公司',
    dataIndex: 'companyName',
    width: 300,
  },
  {
    title: '客户名称',
    dataIndex: 'custName',
    width: 300,
  },
  {
    title: '币种',
    dataIndex: 'contractCurrency',
    width: 60,
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    width: 300,
  },
  {
    title: 'SBU',
    dataIndex: 'sbuName',
    width: 140,
  },
  {
    title: '合同金额',
    dataIndex: 'contractAmount',
    width: 140,
  },
  {
    title: 'Billed AR日期',
    dataIndex: 'billedArDate',
    width: 100,
  },
]
class ReturnModal extends React.Component {
  state = {
    sendFlag: false,
    editFlag: true,
    selectedRowKeys: [],
    selectedEidtRows: [],
    showEditModal: false,
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const rows = selectedRows
   
    this.setState({
      selectedRowKeys,
      selectedEidtRows: selectedRows,
      editFlag: !(rows.length > 0),
      sendFlag: (rows.length > 0 && rows.every(o => o.status === '21' || o.status === '24')),
    })
  }
  doEdit = () => {
    this.setState({
      showEditModal: true,
    })
  }
  editCancel = () => {
    this.setState({
      showEditModal: false,
      selectedEidtRows: [],
    })
  }
  editDone = (params) => {
    this.props.returnEditClim(params)
    this.setState({
      showEditModal: false,
      senFlag: true,
      editFlag: true,
      selectedEidtRows: [],
    })
  }
  sendErp = () => {
    let params = []
    params[0] = this.props.dataSource[0].badDebtId
    this.props.sendErp(params)
    this.returnModalCancel()
  }
  returnModalCancel = () => {
    this.setState({
      showEditModal: false,
      sendFlag: false,
      selectedEidtRows: [],
      editFlag: false,
    })
    this.props.onCancel()
  }
  render() {
    const applyInfoDatas = this.props.dataSource
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <Modal
          width={1080}
          title="划销退回"
          visible={this.props.visible}
          onCancel={this.returnModalCancel}
          footer={[
            <Button key="close" onClick={this.close}>关闭</Button>
          ]}
        >
          <Row>
            <Col span={24}>
              <Button onClick={this.doEdit} style={{ marginRight: '20px' }} disabled={this.state.editFlag}>编辑</Button>
              <Button onClick={this.sendErp} type="primary" disabled={!this.state.sendFlag}>传送ERP</Button>
            </Col>
          </Row>
          <br />
          <Table
            style={{ backgroundColor: '#FFFFFF' }}
            rowKey="badDebtId"
            rowSelection={rowSelection}
            bordered
            size="small"
            pagination={false}
            columns={columns}
            dataSource={applyInfoDatas}
            scroll={{ x: 3042 }}
          />
        </Modal>
        <EditReturnModal
          visible={this.state.showEditModal}
          onCancel={this.editCancel}
          onOk={this.editDone}
          o={applyInfoDatas}
        />
      </div>
    )
  }
}
ReturnModal.propTypes = {
  onCancel: PropTypes.bool.isRequired,
}
// const ReturnModalWithForm = Form.create()(ReturnModal)

export default ReturnModal
