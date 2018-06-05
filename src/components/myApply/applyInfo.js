/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Input, Form, Table, message } from 'antd'
import BillApproveDetail from './billApproveDetail'
import UrlModalCom from '../common/getUrlModal'
import BillDetail from './billDetail'
import requestJsonFetch from '../../http/requestJsonFecth'
import './billApproveDetail.css'

const FormItem = Form.Item
const { TextArea } = Input
const EDIT_ROLE_TYPE = ['ar_admin', 'ar_finance_account', 'tax_auditor', 'project_manager']
const BILL_APPLY_TYPE = ['BILLING_NORMAL', 'BILLING_CONTRACT', 'BILLING_EXCESS', 'BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT', 'BILLING_RED', 'BILLING_RED_OTHER', 'BILLING_OTHER', 'BILLING_INVALID']

class ApplyInfoModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formValidate: false,
      showContractLink: false,
      approveData: [],
    }
  }

  setFormValidate = (v) => {
    this.setState({
      approveData: v
    })
  }

  fieldCheck = (value) => {
    return value === '' || typeof value === 'undefined' || value === 0
  }

  applyConfirm = () => {
      this.props.form.validateFields((err, values) => {
        if(!err) {
          const approveParams = {
            arcFlowId: this.props.applyData.arcFlowId,
            processInstanceId: this.props.applyData.processInstanceId,
            businessKey: this.props.applyData.businessKey,
            taskId: this.props.applyData.taskId,
            approveType: 'agree',
            approveRemark: this.trim(values.approveRemark),
          }
          if(BILL_APPLY_TYPE.includes(this.props.applyInfoData.serviceType)) {
            const { serviceDetail, taskCode, serviceType } = this.props.applyInfoData
            const isAgainInvoice = serviceDetail.isAgainInvoice
            const isTaxAndFinance = taskCode === 'tax_auditor' || taskCode === 'ar_finance_account'
            if(isAgainInvoice !== 'false') {
              this.state.approveData.map((record, index) => {
                if(taskCode === 'ar_admin') {
                  if(this.fieldCheck(record.quantity)) {
                    message.error(`请填写第${index + 1}行的数量`)
                    err = true
                  } else if(this.fieldCheck(record.billingAmount)) {
                    message.error(`请填写第${index + 1}行的含税金额`)
                    err = true
                  } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
                    message.error(`请填写第${index + 1}行的税率`)
                    err = true
                  } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType)) {
                    message.error(`请填写第${index + 1}行的优惠政策类型`)
                    err = true
                  }
                } else if(isTaxAndFinance) {
                  if(taskCode !== 'tax_auditor' && this.fieldCheck(record.billingContent)) {
                    message.error(`请填写第${index + 1}行的开票内容`)
                    err = true
                  } else if(this.fieldCheck(record.quantity)) {
                    message.error(`请填写第${index + 1}行的数量`)
                    err = true
                  } else if(record.unit === '' || typeof record.unit === 'undefined') {
                    message.error(`请填写第${index + 1}行单位`)
                    err = true
                  } else if(this.fieldCheck(record.billingAmount)) {
                    message.error(`请填写第${index + 1}行的含税金额`)
                    err = true
                  } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
                    message.error(`请填写第${index + 1}行的税率`)
                    err = true
                  } else if(this.fieldCheck(record.taxCategoryCode)) {
                    message.error(`请填写第${index + 1}行的税收分类编码`)
                    err = true
                  } else if(this.fieldCheck(record.prefPolicySign)) {
                    message.error(`请填写第${index + 1}行的优惠政策`)
                    err = true
                  } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType)) {
                    message.error(`请填写第${index + 1}行的优惠政策类型`)
                    err = true
                  }
                }
              })
            }
            if(err) {
              return
            }
            const params = isAgainInvoice !== 'false' ? {
              ...values,
              billingApplicationId: serviceDetail.billingApplicationId,
              billingApplicationType: serviceType,
              billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
              appLineItems: this.state.approveData.map(record => ({
                ...record,
                lineNo: record.lineNo + 1,
              })),
            } : {
              ...values,
              billingApplicationId: serviceDetail.billingApplicationId,
              billingApplicationType: serviceType,
            }
            requestJsonFetch('/arc/billingApplication/workFlowEdit', {
              method: 'POST',
              body: params,
            }, (res) => {
              const {resultCode, resultMessage, data} = res
              if (resultCode === '000000') {
                this.props.applyComfirm(approveParams)
              } else {
                message.error(resultMessage, 5)
              }
            })
          } else {
            this.props.applyComfirm(approveParams)
          }
        }
      })
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
    const param = this.props.form.getFieldsValue()
    param.approveRemark = param.approveRemark ? this.trim(param.approveRemark) : param.approveRemark
    param.approveType = 'cancel'
    applyRejectQueryParam.approveRemark = param.approveRemark
    applyRejectQueryParam.approveType = param.approveType
    this.props.applyReject(applyRejectQueryParam)
  }
  trim = (str) => {
    return str ? str.replace(/(^\s*)|(\s*$)/g, '') : ''
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
      title: '款项名称',
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
            <Button type="primary" key="reset" onClick={this.applyReject}>
              驳回
            </Button>,
            <Button key="submit" type="primary" onClick={this.applyConfirm}>
              同意
            </Button>
          ]}
          maskClosable={false}
        >
          <Form>
            <Row>
              <Col span={14}>
                <Button
                  className="scan-document"
                  type="primary"
                  ghost
                  onClick={() => this.setState({showContractLink: true})}
                >合同审批表及合同扫描件</Button>
              </Col>
            </Row>
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
            {
              applyInfoDatas.serviceType === 'BAD_DEBT' ?
                <div>
                  <h2>坏账划销申请</h2>
                  <Table
                    rowKey="receiptClaimId"
                    columns={columns}
                    bordered
                    size="small"
                    scroll={{ x: '1480px' }}
                    dataSource={applyInfoDatas.serviceDetail}
                  />
                </div> : null
            }
            {
              BILL_APPLY_TYPE.includes(applyInfoDatas.serviceType) ?
                <div>
                  <h2>{applyInfoDatas.serviceTypeName}详情</h2>
                  {
                    EDIT_ROLE_TYPE.includes(applyInfoDatas.taskCode) ?
                      <BillApproveDetail
                        serviceDetail={applyInfoDatas.serviceDetail}
                        applyType={applyInfoDatas.serviceType}
                        billApplySave={this.props.billApplySave}
                        taskCode={applyInfoDatas.taskCode}
                        form={this.props.form}
                        setFormValidate={this.setFormValidate}
                        fileDown={this.props.fileDown}
                        showSave={true}
                      /> :
                      <BillDetail
                        serviceDetail={applyInfoDatas.serviceDetail}
                        applyType={applyInfoDatas.serviceType}
                        fileDown={this.props.fileDown}
                      />
                  }
                </div>
                : null
            }
            <br />
            <br />
            <hr style={{ borderTop: '1px solid #d9d9d9' }} />
            <br />
            <h2>审批意见</h2>
            { applyInfoDatas.approveInfoList ?
              applyInfoDatas.approveInfoList.map((item, index) => {
                return (
                  <div key={index}>
                    <br />
                    <Row>
                      <Col style={{ textAlign: 'left' }} span={3}>{item.taskName}：</Col>
                      <Col span={5}>{item.assigneeName} ({item.statusName})</Col>
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
                  {getFieldDecorator('approveRemark', {rules: [{ max: 25, message: '审批意见不能超过25个中文!' }]})(
                    <TextArea rows={5} placeholder="请输入审批意见"></TextArea>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          {
            this.state.showContractLink ?
              <UrlModalCom
                closeModal={() => this.setState({showContractLink: false}) }
                contractUrl={this.props.contractUrl}
              /> : null
          }

        </Modal>
      </div>
    )
  }
}
ApplyInfoModal.propTypes = {
  closeClaim: PropTypes.func.isRequired,
  applyReject: PropTypes.func,
  applyComfirm: PropTypes.func,
  infoVisitable: PropTypes.bool.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
}
const ApplyInfoModalWithForm = Form.create()(ApplyInfoModal)

export default ApplyInfoModalWithForm
