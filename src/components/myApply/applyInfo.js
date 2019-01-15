import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Input, Form, Table, message } from 'antd'
import BillApproveDetail from './billApproveDetail'
import ContractApproveFile from '../common/ContractApproveFile'
import BillDetail from './billDetail'
import ReceiptApplyDetail from './receiptApplyDetail'
import requestJsonFetch from '../../http/requestJsonFecth'
import { hideContractUrl } from '../billApplication/billColumns'
import { checkEmail } from "../../util/common"
import './billApproveDetail.less'

const FormItem = Form.Item
const { TextArea } = Input
const EDIT_ROLE_TYPE = ['ar_admin', 'ar_finance_account', 'tax_auditor', 'project_manager']
const BILL_APPLY_TYPE = ['BILLING_NORMAL', 'BILLING_CONTRACT', 'BILLING_EXCESS', 'BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT', 'BILLING_RED', 'BILLING_RED_OTHER', 'BILLING_OTHER', 'BILLING_INVALID']

class ApplyInfoModal extends React.Component {
  constructor(props) {
    super(props)
    const { serviceDetail } = props.applyInfoData
    this.state = {
      formValidate: false,
      showContractLink: false,
      approveData: {
        serviceDetail: serviceDetail ? serviceDetail.appLineList : [],
        custInfo: serviceDetail ? serviceDetail.custInfo : {},
        comInfo: serviceDetail ? serviceDetail.comInfo : {},
      },
      approveLoading: false,
      rejectLoading: false,
      approvalDetails:false,
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

  applyConfirm = (type) => {
      this.props.form.validateFields((err, values) => {
        const { serviceDetail, taskCode, serviceType } = this.props.applyInfoData
        if(taskCode === 'ar_admin') {
          const invalidEmail =  Array.isArray(values.receiptEmail) ? values.receiptEmail.filter(email => !checkEmail(email)) : []
          if(invalidEmail.length > 0) {
            this.props.form.setFields({
              receiptEmail: {
                value: values.receiptEmail,
                errors: [new Error(`邮箱${invalidEmail.join(',')}格式有误，请重新输入`)],
              },
            });
            err = true
          }
        }
        if(!err) {
          if(BILL_APPLY_TYPE.includes(this.props.applyInfoData.serviceType) && EDIT_ROLE_TYPE.includes(this.props.applyInfoData.taskCode)) {
            const isAgainInvoice = serviceDetail.isAgainInvoice
            const isTaxAndFinance = taskCode === 'tax_auditor' || taskCode === 'ar_finance_account'
            if(isAgainInvoice !== 'false') {
              let map = new Map()
              const dataSource = this.state.approveData.serviceDetail
              for(let i = 0; i< dataSource.length; i++) {
                const record = dataSource[i]
                if(taskCode === 'ar_admin') {
                  if(this.fieldCheck(record.billingAmount)) {
                    message.warning(`请填写第${i + 1}行的含税金额`)
                    err = true
                  } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
                    message.warning(`请填写第${i + 1}行的税率`)
                    err = true
                  } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType)) {
                    message.warning(`请填写第${i + 1}行的优惠政策类型`)
                    err = true
                  }
                } else if(isTaxAndFinance) {
                  if(taskCode !== 'tax_auditor' && this.fieldCheck(record.billingContent)) {
                    message.warning(`请填写第${i + 1}行的开票内容`)
                    err = true
                  } else if(this.fieldCheck(record.billingAmount)) {
                    message.warning(`请填写第${i + 1}行的含税金额`)
                    err = true
                  } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
                    message.warning(`请填写第${i + 1}行的税率`)
                    err = true
                  } else if(this.fieldCheck(record.taxCategoryCode) && taskCode === 'ar_finance_account') {
                    message.warning(`请填写第${i + 1}行的税收分类编码`)
                    err = true
                  } else if(this.fieldCheck(record.prefPolicySign) && taskCode === 'ar_finance_account') {
                    message.warning(`请填写第${i + 1}行的优惠政策`)
                    err = true
                  } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType) && taskCode === 'ar_finance_account') {
                    message.warning(`请填写第${i + 1}行的优惠政策类型`)
                    err = true
                  }
                  //税率容差控制 税率为0不能修改税额和不含税金额
                  const excludeTaxAmount = record.billingAmount / (1 + parseFloat(record.billingTaxRate))
                  const taxAmount = parseFloat((record.billingAmount - excludeTaxAmount).toFixed(2))
                  const taxTolerance = parseFloat((taxAmount - record.billingTaxAmount).toFixed(2))
                  if(parseFloat(record.billingTaxRate) === 0) {
                    if(Math.abs(taxTolerance) > 0) {
                      message.warning(`第【${i + 1}】行税率为0%，税额只能为0，请调整!`)
                      err = true
                      break
                    }
                  } else {
                    if(Math.abs(taxTolerance) > 0.06) {
                      message.warning(`第【${i + 1}】行不含税金额或者税额容差超过6分钱，请调整！`)
                      err = true
                      break
                    }
                  }
                  let sumAmount = map.get(record.groupNo) || 0
                  map.set(record.groupNo, taxTolerance + sumAmount)
                }
              }
              if(isTaxAndFinance) {
                for(let [key, value] of map) {
                  if(Math.abs(value) > 0.62) {
                    message.warning(`组号【${key}】发票不含税金额合计或者税额合计容差超过0.62分钱，请调整`)
                    err = true
                    break;
                  }
                }
              }
            }
            if(err) {
              return false
            }
            if(type === 'confirm') {
              this.setState({
                approveLoading: true,
              })
            } else if(type === 'reject') {
              this.setState({
                rejectLoading: true,
              })
            }

            const params = isAgainInvoice !== 'false' ? {
              ...values,
              billingCustInfoId: this.state.approveData.custInfo.billingCustInfoId,
              billingComInfoId: this.state.approveData.comInfo.billingComInfoId,
              billingApplicationId: serviceDetail.billingApplicationId,
              billingApplicationType: serviceType,
              billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
              billingApplicantRemark: values.billingApplicantRemark ? values.billingApplicantRemark.trim() : '',
              billingApplicantRequest: values.billingApplicantRequest ? values.billingApplicantRequest.trim() : '',
              appLineItems: this.state.approveData.serviceDetail.map(record => ({
                ...record,
                lineNo: record.lineNo + 1,
              })),
              receiptEmail: values.receiptEmail.length > 0 ? values.receiptEmail.join(',') : '',
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
                if(type === 'confirm') {
                  this.approveConfirm(values)
                } else if(type === 'reject') {
                  this.applyReject(values)
                  this.setState({approvalDetails:false})
                }
              } else {
                this.setState({
                  approveLoading: false,
                  rejectLoading: false,
                })
                message.error(resultMessage, 5)
              }
            })
          } else {
            if(type === 'confirm') {
              this.setState({
                approveLoading: true,
              })
              this.approveConfirm(values)
            } else if(type === 'reject') {
              this.setState({
                rejectLoading: true,
              })
              this.setState({approvalDetails:false})
              this.applyReject(values)
            }
          }
        }
      })
  }
  approvalDetails=()=>{
    this.props.form.validateFields((err, values) => {
        const { serviceDetail, taskCode, serviceType } = this.props.applyInfoData
        if(taskCode === 'ar_admin') {
          const invalidEmail =  Array.isArray(values.receiptEmail) ? values.receiptEmail.filter(email => !checkEmail(email)) : []
          if(invalidEmail.length > 0) {
            this.props.form.setFields({
              receiptEmail: {
                value: values.receiptEmail,
                errors: [new Error(`邮箱${invalidEmail.join(',')}格式有误，请重新输入`)],
              },
            });
            err = true
          }
        }
        if(!err) {
          if(BILL_APPLY_TYPE.includes(this.props.applyInfoData.serviceType) && EDIT_ROLE_TYPE.includes(this.props.applyInfoData.taskCode)) {
            const isAgainInvoice = serviceDetail.isAgainInvoice
            const isTaxAndFinance = taskCode === 'tax_auditor' || taskCode === 'ar_finance_account'
            if(isAgainInvoice !== 'false') {
              let map = new Map()
              const dataSource = this.state.approveData.serviceDetail
              for(let i = 0; i< dataSource.length; i++) {
                const record = dataSource[i]
                if(taskCode === 'ar_admin') {
                  if(this.fieldCheck(record.billingAmount)) {
                    message.warning(`请填写第${i + 1}行的含税金额`)
                    err = true
                  } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
                    message.warning(`请填写第${i + 1}行的税率`)
                    err = true
                  } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType)) {
                    message.warning(`请填写第${i + 1}行的优惠政策类型`)
                    err = true
                  }
                } else if(isTaxAndFinance) {
                  if(taskCode !== 'tax_auditor' && this.fieldCheck(record.billingContent)) {
                    message.warning(`请填写第${i + 1}行的开票内容`)
                    err = true
                  } else if(this.fieldCheck(record.billingAmount)) {
                    message.warning(`请填写第${i + 1}行的含税金额`)
                    err = true
                  } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
                    message.warning(`请填写第${i + 1}行的税率`)
                    err = true
                  } else if(this.fieldCheck(record.taxCategoryCode) && taskCode === 'ar_finance_account') {
                    message.warning(`请填写第${i + 1}行的税收分类编码`)
                    err = true
                  } else if(this.fieldCheck(record.prefPolicySign) && taskCode === 'ar_finance_account') {
                    message.warning(`请填写第${i + 1}行的优惠政策`)
                    err = true
                  } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType) && taskCode === 'ar_finance_account') {
                    message.warning(`请填写第${i + 1}行的优惠政策类型`)
                    err = true
                  }
                  //税率容差控制 税率为0不能修改税额和不含税金额
                  const excludeTaxAmount = record.billingAmount / (1 + parseFloat(record.billingTaxRate))
                  const taxAmount = parseFloat((record.billingAmount - excludeTaxAmount).toFixed(2))
                  const taxTolerance = parseFloat((taxAmount - record.billingTaxAmount).toFixed(2))
                  if(parseFloat(record.billingTaxRate) === 0) {
                    if(Math.abs(taxTolerance) > 0) {
                      message.warning(`第【${i + 1}】行税率为0%，税额只能为0，请调整!`)
                      err = true
                      break
                    }
                  } else {
                    if(Math.abs(taxTolerance) > 0.06) {
                      message.warning(`第【${i + 1}】行不含税金额或者税额容差超过6分钱，请调整！`)
                      err = true
                      break
                    }
                  }
                  let sumAmount = map.get(record.groupNo) || 0
                  map.set(record.groupNo, taxTolerance + sumAmount)
                }
              }
              if(isTaxAndFinance) {
                for(let [key, value] of map) {
                  if(Math.abs(value) > 0.62) {
                    message.warning(`组号【${key}】发票不含税金额合计或者税额合计容差超过0.62分钱，请调整`)
                    err = true
                    break;
                  }
                }
              }
            }
            if(err) {
              return false
            }
           else{

        this.setState({approvalDetails:true})

           }

            
    
          }
        }
      })
}

  approveConfirm = (values) => {
    const approveParams = {
      arcFlowId: this.props.applyData.arcFlowId,
      processInstanceId: this.props.applyData.processInstanceId,
      businessKey: this.props.applyData.businessKey,
      taskId: this.props.applyData.taskId,
      approveType: 'agree',
      approveRemark: values.approveRemark ? values.approveRemark.trim() : '',
    }
    this.props.approveComfirm(approveParams).then(res => {
      if(res && res.response && res.response.resultCode === '000000') {
        message.success('审批成功')
        this.props.closeClaim()
      }
      this.setState({
        approveLoading: false
      })
    })
  }
  applyReject = (values) => {
    //按钮提交后显示loading
    const rejectParams = {
      ...values,
      approveType: 'cancel',
      arcFlowId: this.props.applyData.arcFlowId,
      processInstanceId: this.props.applyData.processInstanceId,
      businessKey: this.props.applyData.businessKey,
      taskId: this.props.applyData.taskId,
      approveRemark: values.approveRemark ? values.approveRemark.trim() : '',
    }
    this.props.approveReject(rejectParams).then(res => {
      if(res && res.response && res.response.resultCode === '000000') {
        message.success('驳回成功')
        this.props.closeClaim()
      }
      this.setState({
        rejectLoading: false,
      })
    })
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
      width: 350,
    },
    ]
    return (
      <div>
      {this.state.approvalDetails?   <Modal  title="驳回确认" onCancel={()=>this.setState({approvalDetails:false})}  onOk={()=> this.applyConfirm('reject')} visible={this.state.approvalDetails}>确认驳回审批？</Modal>:null}
        <Modal
          width={1024}
          title="审批详情"
          visible={this.props.infoVisitable}
          onCancel={this.props.closeClaim}
          footer={[
            <Button type="primary" disabled={this.state.approveLoading} loading={this.state.rejectLoading} key="reset" onClick={() => this.approvalDetails()}>
              驳回
            </Button>,
            <Button key="submit" disabled={this.state.rejectLoading} loading={this.state.approveLoading} type="primary" onClick={() => this.applyConfirm('confirm')}>
              同意
            </Button>
          ]}
          maskClosable={false}
        >
          <Form>
            <ContractApproveFile
              billType={applyInfoDatas.serviceType}
              contractUrl={this.props.contractUrl}
            />
            <h2>申请人信息</h2>
            <br />
            <Row>
              <Col style={{ textAlign: 'right' }} span={3} key={1}>申请人：</Col>
              <Col span={8} key={2}>{applyInfoDatas.applyPersonName}</Col>
              <Col style={{ textAlign: 'right' }} span={3} key={3}>申请人部门：</Col>
              <Col span={8} key={4}>{applyInfoDatas.applyPersonDept}</Col>
            </Row>
            <Row>
              <Col style={{ textAlign: 'right' }} span={3} key={5}>联系电话：</Col>
              <Col span={8} key={6}>{applyInfoDatas.applyPersonPhone}</Col>
              <Col style={{ textAlign: 'right' }} span={3} key={7}>邮箱地址：</Col>
              <Col span={8} key={8}>{applyInfoDatas.applyPersonEmail}</Col>
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
                    scroll={{ x: 1750 }}
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
            {
              applyInfoDatas.serviceType === 'RECEIPT' ?
                <div>
                  <h2>收据申请</h2>
                  <ReceiptApplyDetail
                    serviceDetail={applyInfoDatas.serviceDetail}
                  />
                </div> : null
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
