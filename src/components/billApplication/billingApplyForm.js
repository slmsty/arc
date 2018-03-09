import React from 'react'
import { Form, Row, Col, Button, Input, Icon, Select, DatePicker } from 'antd'
import moment from 'moment'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSbu from '../common/SelectSbu'
import './billingApplication.less'
import MultipleInput from '../common/multipleInput'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

class BillingApplyForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
    }
  }
  handleQuery = () => {
    // 验证通过后查询
    const values = this.props.form.getFieldsValue()
    const param = {
      ...values,
      arDateStart: values.arDate ? values.arDate[0].format('YYYY-MM-DD') : '',
      arDateEnd: values.arDate ? values.arDate[1].format('YYYY-MM-DD') : '',
      projectNos: values.projectNos ? values.projectNos : [],
      contractNos: values.contractNos ? values.contractNos : [],
      invoiceNumbers: values.invoiceNumbers ? values.invoiceNumbers : [],
      sbuNo: values.sbuNo ? values.sbuNo[0] : '',
    }
    this.props.onQuery(param)
  }

  handleChange = (value) => {
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
                {getFieldDecorator('arDate')(<RangePicker />)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {
                  getFieldDecorator('custName',{
                    initialValue: '',
                  })(
                    <Input placeholder="客户名称"/>
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
                    <MultipleInput
                      placeholder="多项目编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="签约公司">
                {
                  getFieldDecorator('companyName', {
                    initialValue: '',
                  })(
                    <Input placeholder="签约公司"/>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="合同编码(多)">
                {
                  getFieldDecorator('contractNos',{
                    initialValue: '',
                  })(
                    <MultipleInput
                      placeholder="多合同编码使用英文逗号间隔"
                    />
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
                    <MultipleInput
                      placeholder="多发票号使用英文逗号间隔"
                    />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="开票申请分类">
                {getFieldDecorator('billingApplicationType', {
                  initialValue: 'BILLING_CONTRACT',
                })(
                  <SelectInvokeApi
                    typeCode="BILLING_APPLICATION"
                    paramCode="BILLING_APPLICATION_TYPE"
                    placeholder="开票申请分类"
                    onChange={(v) => this.handleChange(v)}
                    hasEmpty={false}
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
              <FormItem {...formItemLayout} label="SBU">
                {
                  getFieldDecorator('sbuNo', {
                    initialValue: ''
                  })(
                    <SelectSbu />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          {
            this.state.expand ?
              <Row gutter={40}>
                <Col span={8} key={4}>
                  <FormItem {...formItemLayout} label="区域">
                    {getFieldDecorator('region', {
                      initialValue: '',
                    })(
                      <Input
                        placeholder="请输入区域"
                      />
                    )
                    }
                  </FormItem>
                </Col>
                <Col span={8} key={5}>
                  <FormItem {...formItemLayout} label="省份">
                    {
                      getFieldDecorator('province', {
                        initialValue: ''
                      })(
                        <Input
                          placeholder="请输入省份"
                        />
                      )
                    }
                  </FormItem>
                </Col>
              </Row> : null
          }
          <Row gutter={40}>
            <Col style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={() => this.handleQuery()}><Icon type="search" />查询</Button>
              <a style={{ marginLeft: 8, fontSize: 12 }} onClick={() => {this.setState({expand: !this.state.expand})}}>
                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(BillingApplyForm)
