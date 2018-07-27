import React from 'react'
import { Button, Row, Col, Table, Modal, Icon, Form, message } from 'antd'
import BillApproveDetail from '../myApply/billApproveDetail'
import requestJsonFetch from '../../http/requestJsonFecth'
import {checkEmail} from "../../util/common"
import UrlModalCom from '../common/getUrlModal'
import './bigSignAuditDetail.less'

class BigSignAuditDetail extends React.Component {
  constructor(props) {
    super(props)
    const { custInfo, comInfo } = props.applicationInfo.serviceDetail
    this.state = {
      dataSource: [],
      loading: false,
      selectedRows: [],
      showApproveDetail: false,
      billType: 'BILLING_CONTRACT',
      approveData: {},
      custInfo: custInfo,
      comInfo: comInfo,
      showContractLink: false,
    }
    this.isArAdminRole = props.roles.map(role => role.roleCode).includes('ar_admin')
  }

  componentDidMount() {
    const { contractIds } = this.props.applicationInfo.serviceDetail
    if(contractIds.length > 0) {
      this.props.getContractUrl(contractIds)
    }
  }

  setFormValidate = (v) => {
    this.setState({
      approveData: v.serviceDetail,
      custInfo: v.custInfo,
      comInfo: v.comInfo,
    })
  }

  billStartWorkFlow = (billingApplicationId) => {
    this.props.form.validateFields((err, values) => {
      for(let i = 0; i< this.state.approveData.length; i++) {
        const record = this.state.approveData[i]
        if(record.billingAmount <= 0) {
          message.error(`第${i+1}行【开票含税金额】必须大于0`)
          err = true
          break
        }
      }
      if(this.isArAdminRole) {
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
      if(err) {
        return false
      }
      if(!err) {
        this.setState({
          loading: true,
        })
        const { serviceType } = this.props.applicationInfo
        const params = {
          ...values,
          billingApplicationId,
          billingCustInfoId: this.state.custInfo.billingCustInfoId,
          billingComInfoId: this.state.comInfo.billingComInfoId,
          billingApplicationType: values.billFlow ? values.billFlow : serviceType,
          billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
          appLineItems: this.state.approveData.map(record => ({
            ...record,
            lineNo: record.lineNo + 1,
          })),
          receiptEmail: values.receiptEmail.length > 0 ? values.receiptEmail.join(',') : '',
        }
        requestJsonFetch('/arc/billingApplication/workFlowEdit', {
          method: 'POST',
          body: params,
        }, (res) => {
          const {resultCode, resultMessage } = res
          if (resultCode === '000000') {
            const params = {
              billingApplicationId,
              billingApplicationType: this.state.billType,
            }
            this.props.billStartWorkFlow(params).then(res => {
              if(res && res.response) {
                this.setState({
                  loading: false,
                })
              }
              this.props.onCancel()
            })
          } else {
            message.error(resultMessage, 5)
            this.setState({
              loading: false,
            })
          }
        })
      }
    })
  }

  setBillApplicationType = (type) => {
    this.setState({
      billType: type,
    })
  }

  render() {
    const { applyPersonName, applyPersonPhone, applyPersonDept, applyPersonEmail, serviceType, serviceTypeName, serviceDetail } = this.props.applicationInfo
    return (
      <Modal
        title="审核详情"
        width="1100px"
        style={{ top: 20 }}
        visible={true}
        wrapClassName="vertical-center-modal"
        onCancel={() => this.props.onCancel()}
        footer={[
          <Button key="submit" type="primary" loading={this.state.loading} onClick={() => this.billStartWorkFlow(serviceDetail.billingApplicationId)}>
            {!this.state.loading ? <Icon type="check" /> : ''}发起审批
          </Button>,
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
          <div>
            <h3 className="bill-title">申请人信息</h3>
            <Row gutter={30}>
              <Col span={3}>申请人: </Col><Col span={9}>{applyPersonName}</Col>
              <Col span={3}>申请人部门:</Col><Col span={9}>{applyPersonDept}</Col>
            </Row>
            <Row gutter={30}>
              <Col span={3}>联系电话:</Col><Col span={9}>{applyPersonPhone}</Col>
              <Col span={3}>邮箱地址:</Col><Col span={9}>{applyPersonEmail}</Col>
            </Row>
          </div>
          <div>
            <h3 className="bill-title">{serviceTypeName}详情</h3>
            <BillApproveDetail
              serviceDetail={serviceDetail}
              applyType={serviceType}
              billApplySave={this.props.billApplySave}
              isApprove={true}
              setBillApplicationType={this.setBillApplicationType}
              form={this.props.form}
              setFormValidate={this.setFormValidate}
              showSave={false}
              isBigSign={true}
              isArAdminRole={this.isArAdminRole}
            />
          </div>
        </Form>
        {
          this.state.showContractLink ?
            <UrlModalCom
              closeModal={() => this.setState({showContractLink: false}) }
              contractUrl={this.props.contractUrl}
            /> : null
        }
      </Modal>
    )
  }
}

export default Form.create()(BigSignAuditDetail)
