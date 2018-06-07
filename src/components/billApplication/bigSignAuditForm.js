import React from 'react'
import { Form, Row, Col, Button, Input, Icon, Select, DatePicker } from 'antd'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSbu from '../common/SelectSbu'
import './billingApplication.less'

const FormItem = Form.Item

class BigSignAuditForm extends React.Component {
  constructor(props) {
    super(props)
  }
  handleQuery = () => {
    // 验证通过后查询
    const values = this.props.form.getFieldsValue()
    const params = {
      ...values,
      sbuNo: values.sbuNo[0],
    }
    this.props.onQuery(params)
    this.props.setParams(params)
  }

  handleChange = (value) => {
    this.props.getApplyChange(value)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={10}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="申请单编号">
                {getFieldDecorator('billingApplicationId')(
                  <Input placeholder="请输入申请单编号"/>
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="项目编码">
                {
                  getFieldDecorator('projectNo',{
                    initialValue: '',
                  })(
                    <Input placeholder="请输入项目编码"/>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="合同编码">
                {
                  getFieldDecorator('contractNo',{
                    initialValue: '',
                  })(
                    <Input placeholder="请输入合同编码"/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="SBU">
                {
                  getFieldDecorator('sbuNo', {
                    initialValue: ['' ,'']
                  })(
                    <SelectSbu />
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="区域">
                {
                  getFieldDecorator('projectRegion',{
                    initialValue: '',
                  })(
                    <Input placeholder="请输入区域"/>,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="省份">
                {
                  getFieldDecorator('province',{
                    initialValue: '',
                  })(
                    <Input placeholder="请输入省份"/>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={() => this.handleQuery()}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(BigSignAuditForm)
