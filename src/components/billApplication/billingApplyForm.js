import React from 'react'
import { Form, Row, Col, Button, Input, Icon, DatePicker, Select } from 'antd'
import moment from 'moment'
import SelectClient from './selectClient'
import SelectCompany from './selectCompany'
import SelectInvokeApi from '../common/selectInvokeApi'
import './billingApplication.less'

const FormItem = Form.Item
const Option = Select.Option

class BillingApplyForm extends React.Component {
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
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
                {getFieldDecorator('arDateStart')(<DatePicker />)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {
                  getFieldDecorator('custName')(<SelectClient />)
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="项目编码(多)">
                {
                  getFieldDecorator('projectNos')(
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
                {getFieldDecorator('arDateEnd')(<DatePicker />)}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="合同编码(多)">
                {
                  getFieldDecorator('contractNos')(
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
                  getFieldDecorator('invoiceNumbers')(
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
                  initialValue: '',
                })(
                  <SelectInvokeApi
                    typeCode="BILLING_APPLICATION"
                    paramCode="BILLING_APPLICATION_TYPE"
                    placeholder="开票申请分类"
                    hasEmpty
                  />
                )
                }
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="付款条款">
                {
                  getFieldDecorator('paymentName')(
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
                  getFieldDecorator('companyName')(
                    <SelectCompany />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <SelectInvokeApi
                    typeCode="BILLING_APPLICATION"
                    paramCode="STATUS"
                    placeholder="开票申请分类"
                    hasEmpty
                  />
                )
                }
              </FormItem>
            </Col>
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
