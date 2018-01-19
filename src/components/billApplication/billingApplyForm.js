import React from 'react'
import { Form, Row, Col, Button, Input, Icon, DatePicker, Select } from 'antd'
import moment from 'moment'
import SelectSearch from './selectSearch'
import SelectClient from './selectClient'
import SelectCompany from './selectCompany'
import SelectInvokeApi from '../common/selectInvokeApi'
import './billingApplication.less'

const FormItem = Form.Item
const Option = Select.Option
const clientCols = [{
  title: '客户名称',
  dataIndex: 'custName',
  width: 200,
}, {
  title: '客户编号',
  dataIndex: 'custId',
  width: 200,
}]
const comCols = [{
  title: '公司名称',
  dataIndex: 'comName',
  width: 200,
}, {
  title: '公司编号',
  dataIndex: 'comId',
  width: 200,
}]
class BillingApplyForm extends React.Component {
  handleQuery = () => {
    // 验证通过后查询
    const values = this.props.form.getFieldsValue()
    const param = {
      ...values,
      arDateStart: values.arDateStart ? values.arDateStart.format('YYYY-MM-DD') : '',
      arDateEnd: values.arDateEnd ? values.arDateEnd.format('YYYY-MM-DD') : '',
      projectNos: values.projectNos ? values.projectNos.split(',') : [],
      contractNos: values.contractNos ? values.contractNos.split(',') : [],
      invoiceNumbers: values.invoiceNumbers ? values.invoiceNumbers.split(',') : [],
    }
    console.log(param)
    this.props.onQuery(param)
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
    this.props.getApplyChange(value)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="签约日期从">
                {getFieldDecorator('arDateStart')(<DatePicker format="YYYY-MM-DD"/>)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {
                  getFieldDecorator('custName',{
                    initialValue: '',
                  })(
                    <SelectSearch
                      url="/arc/billingApplication/custom/search"
                      columns={clientCols}
                      label="客户名称"
                      idKey="custId"
                      valueKey="custName"
                    />
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="项目编码(多)">
                {
                  getFieldDecorator('projectNos',{
                    initialValue: '',
                  })(
                    <Input
                      placeholder="多项目编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="签约日期至">
                {getFieldDecorator('arDateEnd')(<DatePicker format="YYYY-MM-DD"/>)}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="合同编码(多)">
                {
                  getFieldDecorator('contractNos',{
                    initialValue: '',
                  })(
                    <Input
                      placeholder="多合同编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="发票号(多)">
                {
                  getFieldDecorator('invoiceNumbers',{
                    initialValue: '',
                  })(
                    <Input
                      placeholder="多发票号使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="开票申请分类">
                {getFieldDecorator('billingApplicationType', {
                  initialValue: 'BILLING_NORMAL',
                })(
                  <SelectInvokeApi
                    typeCode="BILLING_APPLICATION"
                    paramCode="BILLING_APPLICATION_TYPE"
                    placeholder="开票申请分类"
                    onChange={(v) => this.handleChange(v)}
                    hasEmpty
                  />
                )
                }
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="付款条款">
                {
                  getFieldDecorator('paymentName', {
                    initialValue: ''
                  })(
                    <Input
                      placeholder="请输入付款条款"
                    />
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="签约公司">
                {
                  getFieldDecorator('companyName', {
                    initialValue: '',
                  })(
                    <SelectSearch
                      url="/arc/billingApplication/company/search"
                      columns={comCols}
                      label="公司名称"
                      idKey="comId"
                      valueKey="comName"
                    />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={() => this.handleQuery()}><Icon type="search" />申请开票</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(BillingApplyForm)
