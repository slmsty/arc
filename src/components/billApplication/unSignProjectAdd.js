import React from 'react'
import { Form, Button, Input, Row, Col, Select, DatePicker, Modal, Icon, message } from 'antd'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSearch from './selectSearch'
import InputSearch from './inputSearch'
import ContractApproveSearch from './contractApproveSearch'
import requestJsonFetch from '../../http/requestJsonFecth'
import moment from 'moment'
import { normalTypes } from './billColumns'
import { clientCols, comCols, proCols, invoiceCols, contractApproveCols } from './billColumns'
const FormItem = Form.Item
const needSelectType = ['BILLING_CONTRACT', 'BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT']

class UnSignProjectAdd extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      reasonId: props.record.advanceBillingReason,
      contractInfo: {
        approvalStatus: '',
        approvalStatusName: '',
        comName: '',
        contractApprovalNo: '',
        contractCurrency: '',
        contractName: '',
        custName: '',
        isContracted: '',
        isContractedName: '',
        contractCurrency: '',
      },
      saveLoading: false,
    }
    this.statusMap = new Map()
  }

  handleOnChange = (v) => {
    this.statusMap.set(v.approvalStatusName, v.approvalStatus)
    this.props.form.setFieldsValue({
      approvalStatus: v.approvalStatusName,
      comName: ['', v.comName],
      custName: ['', v.custName],
      contractCurrency: v.contractCurrency,
      contractName: v.contractName,
    })
    if(typeof v.forecastNo !== 'undefined') {
      requestJsonFetch(`/arc/billingApplication/searchProjectApproveInfo/${v.forecastNo}`, {
        method: 'GET',
      }, (res) => {
        if(res && res.resultCode === '000000') {
          this.props.form.setFieldsValue({
            projectNo:  this.props.isProCodeEdit ? res.data : {tempProjectNo: res.data}
          })
        }
      });
    }
  }

  handleOk = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if(!err) {
        const { record, isAdd } = this.props;
        const params = isAdd ? {
          ...values,
          billingApplicationType: this.props.billType,
          billingComInfoId: values.comName[0],
          comName: values.comName[1],
          billingCustInfoId: values.custName[0],
          custName: values.custName[1],
          receiptReturnDate: values.receiptReturnDate ? values.receiptReturnDate.format('YYYY-MM-DD') : '',
          projectNo: this.props.isProCodeEdit ? values.projectNo : values.projectNo.tempProjectNo,
          sbuNo: values.projectNo ? values.projectNo.sbuNo : '',
          sbuName: values.projectNo ? values.projectNo.sbuName : '',
          costcenterNo: values.projectNo ? values.projectNo.costcenterNo : '',
          costcenterName: values.projectNo ? values.projectNo.costcenterName : '',
          tempProjectId: values.projectNo ? values.projectNo.tempProjectId : '',
          contractApprovalNo: values.contractApprovalNo ? values.contractApprovalNo.contractApprovalNo : '',
          approvalStatus: values.approvalStatus ? this.statusMap.get(values.approvalStatus) : '',
        } : {
          ...values,
          billingApplicationType: this.props.billType,
          arBillingId: record.arBillingId,
          contractItemId: record.contractItemId,
          fundId: record.fundId,
          billingComInfoId: values.comName[0],
          comName: values.comName[1],
          billingCustInfoId: values.custName[0],
          custName: values.custName[1],
          receiptReturnDate: values.receiptReturnDate ? values.receiptReturnDate.format('YYYY-MM-DD') : '',
          billingOutcomeId: normalTypes.includes(this.props.billType) && values.billingOutcomeId ? values.billingOutcomeId[0] : '',
          projectNo: this.props.isProCodeEdit ? values.projectNo : values.projectNo.tempProjectNo,
          sbuNo: values.projectNo ? values.projectNo.sbuNo : '',
          sbuName: values.projectNo ? values.projectNo.sbuName : '',
          costcenterNo: values.projectNo ? values.projectNo.costcenterNo : '',
          costcenterName: values.projectNo ? values.projectNo.costcenterName : '',
          tempProjectId: values.projectNo ? values.projectNo.tempProjectId : '',
          contractApprovalNo: values.contractApprovalNo ? values.contractApprovalNo.contractApprovalNo : '',
          approvalStatus: values.approvalStatus ? this.statusMap.get(values.approvalStatus) : '',
        }
        this.setState({
          saveLoading: true
        })
        this.props.billAction(params).then(res => {
          if(res && res.response) {
            this.setState({
              saveLoading: false
            })
          }

        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { record, isAdd, visible, billType } = this.props
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    if(record.approvalStatus) {
      this.statusMap.set(record.approvalStatusName, record.approvalStatus)
    }
    return (
      <div>
        <Modal
          width="650px"
          title={isAdd ? '未大签添加' : '未大签编辑'}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.props.onCancel()}
          footer={[
            <Button key="submit" type="primary" loading={this.state.saveLoading} onClick={this.handleOk}>
              {!this.state.saveLoading ? <Icon type="check" /> : ''}保存
            </Button>,
          ]}
          maskClosable={false}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="合同审批流水号">
                  {getFieldDecorator('contractApprovalNo',{
                    initialValue: {contractApprovalNo: record.contractApprovalNo},
                  })(
                    <ContractApproveSearch
                      width='900px'
                      url="/arc/billingApplication/searchContractApproveInfo"
                      columns={contractApproveCols}
                      label="合同审批流水号"
                      idKey="contractApprovalNo"
                      valueKey="contractApprovalNo"
                      showSearch={true}
                      onChange={this.handleOnChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="合同审批状态">
                  {
                    getFieldDecorator('approvalStatus',{
                      initialValue: record.approvalStatusName
                    })(
                      <Input
                        placeholder="合同审批状态"
                      />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="签约公司">
                  {getFieldDecorator('comName', {initialValue: record.comName ? ['', record.comName] : '' , rules: [{ required: true, message: '请选择签约公司!' }]} )(
                    <SelectSearch
                      width='700px'
                      url="/arc/billingApplication/company/search"
                      columns={comCols}
                      label="公司名称"
                      idKey="billingComInfoId"
                      valueKey="comName"
                      showSearch={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="客户名称">
                  {
                    getFieldDecorator('custName',{
                      initialValue: record.custName ? ['', record.custName] : '', rules: [{ required: true, message: '请选择客户名称!' }]
                    })(
                      <SelectSearch
                        width='800px'
                        url="/arc/billingApplication/custom/search"
                        columns={clientCols}
                        label="客户名称"
                        idKey="billingCustInfoId"
                        valueKey="custName"
                        showSearch={true}
                      />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="项目编码">
                  {getFieldDecorator('projectNo', {initialValue: this.props.isProCodeEdit ? record.projectNo : {tempProjectNo: record.projectNo} ,rules: [{ required: true, message: '请选择项目编码!' }]})(
                    this.props.isProCodeEdit ?
                      <Input disabled={this.props.billType === 'BILLING_UN_CONTRACT_PROJECT'? false : true}/>
                      :
                      <InputSearch
                        url="/arc/billingApplication/projectNo/search"
                        columns={proCols}
                        label="项目编码"
                        idKey="tempProjectId"
                        valueKey="tempProjectNo"
                        billType={this.props.billType}
                        showSearch={true}
                        width="800px"
                      />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="币种">
                  {getFieldDecorator('contractCurrency', { initialValue : record.contractCurrency, rules: [{ required: true, message: '请选择币种!' }]})(
                    <SelectInvokeApi
                      typeCode="COMMON"
                      paramCode="CURRENCY"
                      placeholder="请选择币种"
                      hasEmpty
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            {
              this.props.billType === 'BILLING_UN_CONTRACT_PROJECT' || this.props.billType === 'BILLING_UN_CONTRACT_UN_PROJECT' || this.props.billType === 'BILLING_UN_CONTRACT' ?
                <Row gutter={30}>
                  <Col span={12} key={1}>
                    <FormItem {...formItemLayout} label="合同名称">
                      {getFieldDecorator('contractName', {initialValue : record.contractName, rules: [{ required: true, message: '请填写合同名称!' }]})(
                        <Input
                          placeholder="请输入合同名称"/>
                      )}
                    </FormItem>
                  </Col>
                </Row> : null
            }
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="提前开票原因">
                  {
                    getFieldDecorator('advanceBillingReason',{
                      initialValue: record.advanceBillingReason, rules: [{ required: true, message: '请填写提前开票原因!' }]
                    })(
                      <SelectInvokeApi
                        typeCode="BILLING_APPLICATION"
                        paramCode="ADVANCE_BILLING_REASON"
                        placeholder="提前开票原因"
                        hasEmpty
                        onChange={(value) => this.setState({reasonId: value})}
                      />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="预计回款日期">
                  {
                    getFieldDecorator('receiptReturnDate', {
                      initialValue: record.receiptReturnDate ? moment(record.receiptReturnDate, 'YYYY-MM-DD') : moment(), rules: [{ required: true, message: '请选择预计回款日期!' }]}
                    )(<DatePicker format="YYYY-MM-DD"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            {
              //fix 后端接口添加reasonId
              this.state.reasonId === 'other' || this.state.reasonId === '其它' ?
                <Row gutter={30}>
                  <Col span={12} key={1}>
                    <FormItem {...formItemLayout} label="提前开票备注">
                      {getFieldDecorator('advanceBillingRemark', {initialValue : record.advanceBillingRemark, rules: [{ required: this.state.reasonId === 'other', message: '请填写提前开票备注!' }]})(
                        <Input placeholder="提前开票备注"/>
                      )}
                    </FormItem>
                  </Col>
                </Row> : null
            }
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(UnSignProjectAdd)
