import React from 'react'
import { Form, Row, Col, Button, Input, Icon, DatePicker, Select } from 'antd'
import moment from 'moment'
import './billingApplication.less'

const FormItem = Form.Item
const Option = Select.Option

class BillingApplyForm extends React.Component {
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
    this.props.onQuery(param)
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
    this.props.applyChange(value)
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
                {getFieldDecorator('signDateStart')(<DatePicker />)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {
                  getFieldDecorator('clientName')(<Input />)
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="项目编码(多)">
                {
                  getFieldDecorator('projectIds')(
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
                {getFieldDecorator('signDateEnd')(<DatePicker />)}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="合同编码(多)">
                {
                  getFieldDecorator('projectIds')(
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
                  getFieldDecorator('projectIds')(
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
                {getFieldDecorator('applyType', {
                  initialValue: '1',
                })(<Select
                    placeholder="请选择申请分类"
                    notFoundContent=""
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    onChange={this.handleChange}
                  >
                    <Option value="1">正常开票</Option>
                    <Option value="2">已大签项目提前开票</Option>
                    <Option value="3">未大签项目已提前立项开票</Option>
                    <Option value="4">未大签项目未提前立项开票</Option>
                    <Option value="5">红字发票开票</Option>
                    <Option value="6">超额开票</Option>
                    <Option value="7">其他开票</Option>
                    <Option value="8">其他红字开票</Option>
                </Select>)
                }
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="付款条款">
                {
                  getFieldDecorator('paymentTerms')(
                    <Select
                      placeholder="请选择付款条款"
                      defaultActiveFirstOption={false}
                      filterOption={false}
                      onChange={this.handleChange}
                    >
                      <Option value="1">付款条款1</Option>
                      <Option value="2">付款条款2</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="签约公司">
                {
                  getFieldDecorator('company')(
                    <Input
                      placeholder="请输入签约公司"
                    />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={() => this.handleQuery}><Icon type="search" />申请开票</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(BillingApplyForm)
