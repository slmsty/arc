import React from 'react'
import { Modal, Row, Col, Button, Input, Form, Table } from 'antd'
import { contentCols, totalColumns, detailColumns, normalTypes, proApplyColumns, billDetailColumns } from '../billApplication/billColumns'
import './billApproveDetail.css'
const FormItem = Form.Item
const { TextArea } = Input
const BILL_APPLY_TYPE = ['BILLING_NORMAL', 'BILLING_CONTRACT', 'BILLING_EXCESS', 'BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT', 'BILLING_RED', 'BILLING_RED_OTHER', 'BILLING_OTHER', 'BILLING_INVALID']

class MyApplyEdit extends React.Component {
  render() {
    const applyInfoDatas = this.props.applyInfoData
    return (
      <div>
        <Modal
          width='1024px'
          title="审批详情"
          visible={this.props.infoVisitable}
          onCancel={this.props.closeModal}
          onOk={this.props.closeClaim}
        >
          <div className="arc-info">
            <h1>项目信息</h1>
            <Table
              columns={proApplyColumns}
              bordered
              size="small"
              scroll={{ x: '1570px' }}
              dataSource={[]}
              pagination={false}
            />
          </div>
          <div className="arc-info">
            <h1>开票结果详情</h1>
            <Table
              rowKey="id"
              size="small"
              bordered
              columns={detailColumns}
              dataSource={[]}
              pagination={false}
            />
          </div>
        </Modal>
      </div>
    )
  }
}


export default MyApplyEdit

