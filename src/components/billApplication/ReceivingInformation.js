import React from 'react'
import {Form, Row, Col, Input } from 'antd'
import MultipleInput from '../common/multipleInput'
const FormItem = Form.Item
const formItemLayout2 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const formItemLayout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
export default function ReceivingInformation (props) {
  const { getFieldDecorator } = props.form
  const { expressReceiptName, expressReceiptPhone, expressReceiptCompany, expressReceiptCity,expressReceiptAddress, receiptEmail } = props.info
  
  return (
    <div>
      <h3 className="sent-info">寄件信息</h3>
      <Row gutter={40}>
        <Col span={8} key={1}>
          <FormItem {...formItemLayout2} label="收件人">
            {getFieldDecorator('expressReceiptName',
              {initialValue: expressReceiptName},
              {rules:[{ max: 10, message: '收件人不能超过10个汉字!' }]})(
              <Input
                placeholder="收件人"
                disabled={props.disabled}
              />
            )}
          </FormItem>
        </Col>
        <Col span={8} key={2}>
          <FormItem {...formItemLayout2} label="收件人公司">
            {
              getFieldDecorator('expressReceiptCompany',
                {initialValue: expressReceiptCompany},
                {rules:[{ max: 16, message: '收件人公司不能超过20个汉字!' }]})(
                <Input
                  placeholder="收件人公司"
                  disabled={props.disabled}
                />
              )
            }
          </FormItem>
        </Col>
        <Col span={8} key={3}>
          <FormItem {...formItemLayout2} label="收件人电话">
            {
              getFieldDecorator('expressReceiptPhone',
                {initialValue: expressReceiptPhone},
                {rules:[{ max: 16, message: '收件人电话不能超过20个字符!' }]})(
                <Input
                  placeholder="收件人电话"
                  disabled={props.disabled}
                />,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row gutter={40}>
        <Col span={8} key={1}>
          <FormItem {...formItemLayout2} label="收件人城市">
            {getFieldDecorator('expressReceiptCity',
              {initialValue: expressReceiptCity},
              {rules:[{ max: 16, message: '收件人城市不能超过20个汉字!' }]})(
              <Input
                placeholder="收件人城市"
                disabled={props.disabled}
              />
            )}
          </FormItem>
        </Col>
        <Col span={8} key={2}>
          <FormItem {...formItemLayout2} label="收件人详细地址">
            {
              getFieldDecorator('expressReceiptAddress',
                {initialValue: expressReceiptAddress},
                {rules:[{ max: 32, message: '收件人详细地址不能超过30个汉字!' }]})(
                <Input
                  placeholder="收件人详细地址"
                  disabled={props.disabled}
                />
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row gutter={40}>
        <Col span={14} key={1}>
          <FormItem {...formItemLayout1} label="E-mail">
            {getFieldDecorator('receiptEmail',
              {initialValue: receiptEmail},
              {rules: [{ required: true, message: '请填写E-mail!' }]}
              )(
              <MultipleInput
                placeholder="填写多个E-mail请用英文逗号分隔"
                disabled={props.disabled}
              />
            )}
          </FormItem>
        </Col>
      </Row>
    </div>
  )
}
