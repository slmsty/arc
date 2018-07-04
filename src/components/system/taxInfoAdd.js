import React from 'react'
import { Form, Button, Row, Col, Modal, Icon, Input, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

class TaxInfoAdd extends React.Component {
  constructor(props){
    super(props)
  }

  handleOk = (e) => {
    e.preventDefault();
    const { custInfoId } = this.props.record
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const trimValues = {
          ...values,
          custInfoName: values.custInfoName.trim(),
          billingCustName: values.billingCustName.trim(),
          taxpayerIdentification: values.taxpayerIdentification.trim(),
          addressPhoneNum: values.addressPhoneNum.trim(),
          bankAccount: values.bankAccount.trim(),
        }
        const params = custInfoId ? {
          ...trimValues,
          custInfoId,
          actionType: 'EDIT',
        } : {
          ...trimValues,
          actionType: 'NEW',
        }
        this.props.saveCustTaxInfo(params)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { custInfoName, billingCustName, taxpayerIdentification, addressPhoneNum, bankAccount, status} = this.props.record
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
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('custInfoName', {initialValue: custInfoName, rules: [{ required: true, message: '请填写客户名称!' }]})(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="开票客户名称">
                  {
                    getFieldDecorator('billingCustName',{
                      initialValue: billingCustName, rules: [{ required: true, message: '请填写开票客户名称!' }]
                    })(<Input placeholder="开票客户名称"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="纳税识别码">
                  {getFieldDecorator('taxpayerIdentification', {initialValue: taxpayerIdentification, rules: [{ required: true, message: '请填写纳税识别码!' }]})(
                    <Input placeholder="纳税识别码"/>
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="是否有效">
                  {getFieldDecorator('status', { initialValue : status || '', rules: [{ required: true, message: '请选择是否有效!' }]})(
                    <Select>
                      <Option value="">-请选择-</Option>
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="纳税人地址、电话">
                  {getFieldDecorator('addressPhoneNum', {initialValue: addressPhoneNum})(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="开户行及账号">
                  {getFieldDecorator('bankAccount', {initialValue: bankAccount})(
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
