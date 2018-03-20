import React from 'react'
import { Form, Button, Input, Row, Col, Select, DatePicker, Modal, Icon } from 'antd'
import SelectInvoice from '../common/SelectInvoice'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSearch from './selectSearch'
import moment from 'moment'
import { normalTypes, advanceTypes } from './billColumns'
import { clientCols, comCols, proCols, invoiceCols } from './billColumns'
const FormItem = Form.Item
const Option = Select.Option


class BillUpdate extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      reasonId: ''
    }
  }

  handleOk = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      const projectNo = this.props.isProCodeEdit ? values.projectNo : values.projectNo[1]
      if(projectNo.startsWith('V') && this.props.billType === 'BILLING_UN_CONTRACT_PROJECT') {
        this.props.form.setFields({
          projectNo: {
            errors: [new Error('项目编码不能以V打头')]
          }
        })
        err = true
      }
      if(!err) {
        const { record, isAdd } = this.props;
        const params = isAdd ? {
          ...values,
          billingApplicationType: this.props.billType,
          comName: values.comName[1],
          custName: values.custName[1],
          projectNo: this.props.isProCodeEdit ? values.projectNo : values.projectNo[1],
          receiptReturnDate: values.receiptReturnDate ? values.receiptReturnDate.format('YYYY-MM-DD') : '',
        } : {
          ...values,
          billingApplicationType: this.props.billType,
          arBillingId: record.arBillingId,
          contractItemId: record.contractItemId,
          comId: values.comName[0],
          comName: values.comName[1],
          custId: values.custName[0],
          custName: values.custName[1],
          projectNo: this.props.isProCodeEdit ? values.projectNo : values.projectNo[1],
          receiptReturnDate: values.receiptReturnDate ? values.receiptReturnDate.format('YYYY-MM-DD') : '',
          billingOutcomeId: normalTypes.includes(this.props.billType) && values.billingOutcomeId ? values.billingOutcomeId[0] : '',
        }
        this.props.billAction(params)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { record, isAdd, visible } = this.props
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    return (
      <div>
        <Modal
          width="650px"
          title={isAdd ? '发票添加' : '发票编辑'}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.props.onCancel()}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />保存
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="发票是否丢失">
                  {getFieldDecorator('isLose', {initialValue: record.isLose, rules: [{ required: false, message: '请选择丢失情况!' }]} )(
                    <Select>
                      <Option value="">请选择</Option>
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="丢失类型">
                  {
                    getFieldDecorator('loseType',{
                      initialValue: record.loseType, rules: [{ required: false, message: '请选择丢失类型!' }]
                    })(
                      <SelectInvokeApi
                        typeCode="BILLING_APPLICATION"
                        paramCode="LOSE_TYPE"
                        placeholder="请选择丢失类型"
                        hasEmpty
                        onChange={(value) => this.setState({reasonId: value})}
                      />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="签约公司">
                  {getFieldDecorator('comName', {initialValue: ['', record.comName] , rules: [{ required: true, message: '请选择签约公司!' }]} )(
                    <SelectSearch
                      url="/arc/billingApplication/company/search"
                      columns={comCols}
                      label="公司名称"
                      idKey="comId"
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
                      initialValue: ['', record.custName], rules: [{ required: true, message: '请选择客户名称!' }]
                    })(
                      <SelectSearch
                        url="/arc/billingApplication/custom/search"
                        columns={clientCols}
                        label="客户名称"
                        idKey="custId"
                        valueKey="custName"
                        showSearch={true}
                    />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="提前开票原因">
                  {
                    getFieldDecorator('advanceBillingReason',{
                      initialValue: record.advanceBillingReason,
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
                      initialValue: record.receiptReturnDate ? moment(record.receiptReturnDate, 'YYYY-MM-DD') : moment(),}
                      )(<DatePicker format="YYYY-MM-DD"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="项目编码">
                  {getFieldDecorator('projectNo', {initialValue: this.props.isProCodeEdit ? record.projectNo : ['', record.projectNo] ,rules: [{ required: true, message: '请选择项目编码!' }]})(
                    this.props.isProCodeEdit ?
                      <Input disabled={this.props.billType === 'BILLING_UN_CONTRACT_PROJECT'? false : true}/>
                      :
                      <SelectSearch
                        url="/arc/billingApplication/projectNo/search"
                        columns={proCols}
                        label="项目编码"
                        idKey="tempProjectNo"
                        valueKey="tempProjectNo"
                        billType={this.props.billType}
                        showSearch={true}
                      />
                  )}
                </FormItem>
              </Col>
              {
                normalTypes.includes(this.props.billType) && !this.props.isAdd ?
                  <Col span={12} key={2}>
                    <FormItem {...formItemLayout} label="关联发票">
                      {
                        getFieldDecorator('billingOutcomeId',{
                          initialValue: [record.billingOutcomeId, record.outcomeInvoiceNumber],
                        })(<SelectInvoice
                          url="/arc/billingApplication/outcome/search"
                          columns={invoiceCols}
                          label="关联发票"
                          idKey="billingOutcomeId"
                          valueKey="invoiceNumber"
                        />)
                      }
                    </FormItem>
                  </Col> :
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
              }
            </Row>
            {
              advanceTypes.includes(this.props.billType) ?
                <Row gutter={30}>
                  <Col span={12} key={1}>
                    <FormItem {...formItemLayout} label="合同名称">
                      {getFieldDecorator('contractName', {initialValue : record.contractName, rules: [{ required: true, message: '请填写合同名称!' }]})(
                        <Input placeholder="请输入合同名称"/>
                      )}
                    </FormItem>
                  </Col>
                </Row> : null
            }
            {
              this.state.reasonId === 'other' ?
                <Row gutter={30}>
                  <Col span={12} key={1}>
                    <FormItem {...formItemLayout} label="提前开票备注">
                      {getFieldDecorator('advanceBillingRemark', {rules: [{ required: this.state.reasonId === 'other', message: '请选择项目编码!' }]})(
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

export default Form.create()(BillUpdate)
