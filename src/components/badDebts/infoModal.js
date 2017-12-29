/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Input, Form, Table } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
class BadDebtsInfoModal extends React.Component {
  render() {
    const applyInfoDatas = this.props.data
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: '节点',
      dataIndex: 'projectNode',
      width: 50,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '项目编码',
      dataIndex: 'projectNo',
      width: 100,
    }, {
      title: '合同编码',
      dataIndex: 'contractNo',
      width: 200,
    }, {
      title: '合同名称',
      dataIndex: 'contractName',
      width: 300,
    }, {
      title: '付款条款',
      dataIndex: 'paymentName',
      width: 100,
    }, {
      title: '划销金额',
      dataIndex: 'badDebtAmount',
      width: 100,
      render: (text, record) => (text ? text.toFixed(2) : text),
    }, {
      title: '申请日期',
      dataIndex: 'applicationDate',
      width: 150,
    }, {
      title: '应收日期',
      dataIndex: 'arDate',
      width: 150,
    }, {
      title: '应收金额',
      dataIndex: 'billedArBalance',
      width: 100,
      render: (text, record) => (text ? text.toFixed(2) : text),
    }, {
      title: 'GL已提坏账准备金额',
      dataIndex: 'badDebtProvisionAmount',
      width: 150,
      render: (text, record) => (text ? text.toFixed(2) : text),
    }, {
      title: '备注',
      dataIndex: 'applicantRemark',
      width: 80,
    },
    ]
    return (
      <div>
        <Modal
          width={1024}
          title="审批详情"
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          onOk={this.props.onCancel}
        >
          <Form>
            <h2>申请人信息</h2>
            <br />
            <Row>
              <Col style={{ textAlign: 'right' }} span={3} key={1}>申请人：</Col>
              <Col span={5} key={2}>{applyInfoDatas.applyPersonName}</Col>
              <Col style={{ textAlign: 'right' }} span={3} key={3}>申请人部门：</Col>
              <Col span={5} key={4}>{applyInfoDatas.applyPersonDept}</Col>
            </Row>
            <Row>
              <Col style={{ textAlign: 'right' }} span={3} key={5}>联系电话：</Col>
              <Col span={5} key={6}>{applyInfoDatas.applyPersonPhone}</Col>
              <Col style={{ textAlign: 'right' }} span={3} key={7}>邮箱地址：</Col>
              <Col span={5} key={8}>{applyInfoDatas.applyPersonEmail}</Col>
            </Row>
            <br />
            <hr style={{ borderTop: '1px solid #d9d9d9' }} />
            <br />
            <div style={{ display: applyInfoDatas.serviceType === 'badDebt' ? 'block' : 'none' }}>
              <h2>坏账划销申请</h2>
              <Table
                rowKey="receiptClaimId"
                columns={columns}
                bordered
                size="small"
                scroll={{ x: '1480px' }}
                dataSource={applyInfoDatas.serviceDetail}
              />
            </div>
            <br />
            <br />
            <hr style={{ borderTop: '1px solid #d9d9d9' }} />
            <br />
            <h2>审批意见</h2>
            <br />
            { applyInfoDatas.approveInfoList ?
              applyInfoDatas.approveInfoList.map((item, index) => {
                return (
                  <div key={index}>
                    <Row>
                      <Col style={{ textAlign: 'left' }} span={3}>{item.taskName}：</Col>
                      <Col span={5}>{item.assigneeName}</Col>
                      <Col style={{ textAlign: 'right' }} span={3}>审批结果：</Col>
                      <Col span={4}>{item.approveType}</Col>
                      <Col style={{ textAlign: 'right' }} span={3}>审批时间：</Col>
                      <Col span={5}>{item.approveDate}</Col>
                    </Row>
                    <Row>
                      <Col style={{ textAlign: 'left' }} span={4}>审批意见：</Col>
                      <Row>
                        <Col style={{ textAlign: 'left' }} span={24}>
                          &nbsp;&nbsp;{item.approveRemark}
                        </Col>
                      </Row>
                    </Row>
                    <br />
                    <hr style={{ borderTop: '1px solid #d9d9d9' }} />
                    <br />
                  </div>
                )
              }) : ''
            }
            <br />
          </Form>
        </Modal>
      </div>
    )
  }
}
BadDebtsInfoModal.propTypes = {
  onCancel: PropTypes.bool.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
}
const BadDebtsInfoModalWithForm = Form.create()(BadDebtsInfoModal)

export default BadDebtsInfoModalWithForm
