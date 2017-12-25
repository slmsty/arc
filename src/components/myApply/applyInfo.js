/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Input, Form, Table } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
class ApplyInfoModal extends React.Component {
  applyComfirm = () => {
    const applyComfirmQueryParam = {
      arcFlowId: this.props.applyData.arcFlowId,
      processInstanceId: this.props.applyData.processInstanceId,
      businessKey: this.props.applyData.businessKey,
      taskId: this.props.applyData.taskId,
      approveType: '',
      approveRemark: '',
    }
    const param = this.props.form.getFieldsValue()
    param.approveRemark = param.approveRemark ? this.trim(param.approveRemark) : param.approveRemark
    param.approveType = 'agree'
    applyComfirmQueryParam.approveRemark = param.approveRemark
    applyComfirmQueryParam.approveType = param.approveType
    this.props.applyComfirm(applyComfirmQueryParam)
  }
  applyReject = () => {
    const applyRejectQueryParam = {
      arcFlowId: this.props.applyData.arcFlowId,
      processInstanceId: this.props.applyData.processInstanceId,
      businessKey: this.props.applyData.businessKey,
      taskId: this.props.applyData.taskId,
      approveType: '',
      approveRemark: '',
    }
    // console.log(applyRejectQueryParam)
    const param = this.props.form.getFieldsValue()
    param.approveRemark = param.approveRemark ? this.trim(param.approveRemark) : param.approveRemark
    param.approveType = 'cancel'
    applyRejectQueryParam.approveRemark = param.approveRemark
    applyRejectQueryParam.approveType = param.approveType
    this.props.applyReject(applyRejectQueryParam)
  }
  trim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }
  render() {
    const applyInfoDatas = this.props.applyInfoData
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
          visible={this.props.infoVisitable}
          onCancel={this.props.closeClaim}
          footer={[
            <Button key="submit" type="primary" onClick={this.applyComfirm}>
              同意
            </Button>,
            <Button type="primary" key="reset" onClick={this.applyReject}>
              驳回
            </Button>,
          ]}
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
                size="middle"
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
                    <br />
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
                  </div>
                )
              }) : ''
            }
            <br />
            <h3 style={{ color: '#F4A034' }}>审批意见</h3>
            <Row>
              <Col style={{ textAlign: 'left' }} span={24}>
                <FormItem>
                  {getFieldDecorator('approveRemark')(
                    <TextArea rows={5} placeholder="请输入审批意见"></TextArea>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
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
