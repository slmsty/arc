import React from 'react'
import { Form, Row, Col, Button, Input, Icon, Select, DatePicker } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

class ReceiptApplyForm extends React.Component {
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
      custName: values.custName ? values.custName.trim() : '',
      projectNos: values.projectNos ? values.projectNos.trim() : '',
      companyName: values.companyName ? values.companyName.trim() : '',
      contractNos: values.contractNos ? values.contractNos.trim() : '',
      sbuNo: values.sbuNo ? values.sbuNo.trim() : '',
      paymentName: values.paymentName ? values.paymentName.trim() : '',
      province: values.province ? values.province.trim() : '',
      region: values.region ? values.region.trim() : '',
    }
    this.props.query(param)
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
              <FormItem {...formItemLayout} label="项目编码">
                {
                  getFieldDecorator('projectNo',{
                    initialValue: '',
                  })(
                    <Input placeholder="项目编码"/>,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="签约日期从">
                {getFieldDecorator('arDate')(<RangePicker />)}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
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
          </Row>
          <Row gutter={40}>
            <Col span={8} key={1}>
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
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="合同编码">
                {
                  getFieldDecorator('contractNo',{
                    initialValue: '',
                  })(
                    <Input placeholder="合同编码"/>,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="立项BU">
                {
                  getFieldDecorator('sbuNo',{
                    initialValue: '',
                  })(
                    <Input placeholder="立项BU"/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={1}>
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
            <Col span={8} key={2}>
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
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="区域">
                {getFieldDecorator('region', {
                  initialValue: '',
                })(
                  <Input
                    placeholder="请输入区域"
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={() => this.handleQuery()}><Icon type="search" />查询</Button>
              <Button type="primary" style={{marginLeft: '10px'}} ghost onClick={() => this.props.form.resetFields()}><Icon type="search" />清空</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(ReceiptApplyForm)
