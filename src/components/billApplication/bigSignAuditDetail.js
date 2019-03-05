import React from 'react'
import { Button, Row, Col, Table, Modal, Icon, Form, message } from 'antd'
import BillApproveDetail from '../myApply/billApprove'
import requestJsonFetch from '../../http/requestJsonFecth'
import {checkEmail} from "../../util/common"
import ContractApproveFile from '../common/ContractApproveFile'
import './bigSignAuditDetail.less'

class BigSignAuditDetail extends React.Component {
  constructor(props) {
    super(props)
    const { serviceType, serviceDetail } = props.applicationInfo
    const { custInfo, comInfo } = serviceDetail
    this.state = {
      dataSource: [],
      loading: false,
      selectedRows: [],
      showApproveDetail: false,
      billType: serviceType,
      approveData: {},
      custInfo: custInfo,
      comInfo: comInfo,
      showContractLink: false,
      changeDisable:true,
    }
    this.isArAdminRole = props.roles.map(role => role.roleCode).includes('ar_admin')
  }

  componentWillMount() {
     
    if(this.props.changeDisable==false||this.props.changeDisable==true){
          this.setState({

            changeDisable:this.props.changeDisable,
          })
        
     }
      else{


      }
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
changeSelect=(index,value)=>{
let  c=this.state.approveData;
if(value=="客户要求提前挂账"){c[index].advanceBillingReason="cust_advance_billing"}
if (value=='回款') {c[index].advanceBillingReason="receipt_claim"}
 if(value=='其他'){c[index].advanceBillingReason="other"} 

this.setState({approveData:c});

}
changeTheTime=(index,value,dateString)=>{
  let a=value;
  if(dateString!=''){
let d=this.state.approveData;
let k=new Date(dateString);

d[index].receiptReturnDate=k.getTime();
this.setState({approveData:d});

}

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
       
        const params = {
          ...values,
          billingApplicationId,
          billingCustInfoId: this.state.custInfo.billingCustInfoId,
          billingComInfoId: this.state.comInfo.billingComInfoId,
          billingApplicationType: this.state.billType,
          billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
          appLineItems: this.state.approveData.map(record => ({
            ...record,
            lineNo: record.lineNo + 1,
          })),
          receiptEmail: values.receiptEmail.length > 0 ? values.receiptEmail.join(',') : '',
        }
        // console.log(params);
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
    const { serviceType } = this.props.applicationInfo
    this.setState({
      billType: type === 'OLD' ? serviceType : type,
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
          <ContractApproveFile
            contractUrl={this.props.contractUrl}
            billType={serviceType}
          />
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
              changeDisable={this.state.changeDisable}
              applyType={serviceType}
              billApplySave={this.props.billApplySave}
              isApprove={true}
              setBillApplicationType={this.setBillApplicationType}
              form={this.props.form}
              setFormValidate={this.setFormValidate}
              showSave={false}
              isBigSign={true}
              changeTheTime={this.changeTheTime}
              changeSelect={this.changeSelect}
              isArAdminRole={this.isArAdminRole}
              taskCode={this.props.taskCode}
            />
          </div>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(BigSignAuditDetail)
