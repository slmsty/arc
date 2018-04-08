import React from 'react'
import { Form, Button, Row, Col, Modal, Icon, Input, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

class ContentAdd extends React.Component {
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
                <FormItem {...formItemLayout} label="开票内容名称">
                  {getFieldDecorator('billContent', {initialValue: '', rules: [{ required: true, message: '请填写开票内容名称!' }]})(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="税收分类编码">
                  {
                    getFieldDecorator('taxCode',{
                      initialValue: '', rules: [{ required: true, message: '请填写税收分类编码!' }]
                    })(<Input placeholder="税收分类编码"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="优惠政策标识">
                  {getFieldDecorator('policyLogo', {initialValue: '', rules: [{ required: true, message: '请选择优惠政策标识!' }]})(
                    <Select>
                      <Option value="">-请选择-</Option>
                      <Option value="1">使用</Option>
                      <Option value="0">不使用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="零税率标识">
                  {getFieldDecorator('zeroTax', { initialValue : '', rules: [{ required: true, message: '请选择是否有效!' }]})(
                    <Select>
                      <Option value="">-请选择-</Option>
                      <Option value="1">使用</Option>
                      <Option value="0">不使用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="税收分类版本号">
                  {getFieldDecorator('versionNo', {initialValue: '', rules: [{ required: true, message: '请填写税收分类版本号!' }]})(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="扣除额">
                  {getFieldDecorator('account', {initialValue: '', rules: [{ required: true, message: '请填写开户行及账号!' }]})(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
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
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(ContentAdd)
