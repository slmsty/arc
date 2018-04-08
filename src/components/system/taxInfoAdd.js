import React from 'react'
import { Form, Button, Row, Col, Modal, Icon, Input, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

class TaxInfoAdd extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      reasonId: ''
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    const { isAdd, record } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = isAdd ? {
          ...values,
          billingApplicationType: this.props.billType,
          custName: values.custName[1],
          comName: values.comName[1],
          projectNo: values.projectNo[1],
        } : {
          ...values,
          billingApplicationType: this.props.billType,
          arBillingId: record.arBillingId,
          custName: values.custName[1],
          comName: values.comName[1],
          projectNo: values.projectNo[1],
        }
        this.props.addAction(params)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    }
    return (
      <div>
        <Modal
          width="700px"
          title="客户纳税信息"
          visible={this.props.visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.props.onCancel()}
          footer={[
            <Button key="submit" type="primary" onClick={(e) => this.handleOk(e)}>
              <Icon type="check" />保存
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('comName', {initialValue: '', rules: [{ required: true, message: '请填写客户名称!' }]})(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="开票客户名称">
                  {
                    getFieldDecorator('billCustName',{
                      initialValue: '', rules: [{ required: true, message: '请填写开票客户名称!' }]
                    })(<Input placeholder="开票客户名称"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="纳税识别码">
                  {getFieldDecorator('taxCode', {initialValue: '', rules: [{ required: true, message: '请填写纳税识别码!' }]})(
                    <Input placeholder="纳税识别码"/>
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="是否有效">
                  {getFieldDecorator('isValid', { initialValue : '', rules: [{ required: true, message: '请选择是否有效!' }]})(
                    <Select>
                      <Option value="">-请选择-</Option>
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="纳税人地址、电话">
                  {getFieldDecorator('address', {initialValue: '', rules: [{ required: true, message: '请填写纳税人地址、电话!' }]})(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="开户行及账号">
                  {getFieldDecorator('account', {initialValue: '', rules: [{ required: true, message: '请填写开户行及账号!' }]})(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(TaxInfoAdd)
