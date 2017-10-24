/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, DatePicker, Input, Radio, Select, Table, Icon } from 'antd'

import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const { TextArea } = Input

class EditManualEntryBankTurnoverData extends React.Component {
  state = {
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Modal
          title="人工录入收款编辑"
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          onOk={this.props.onConfirm}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('customer')(<SelectCustomerWithForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="收款日期">
                  {getFieldDecorator('receiptDate')(<DatePicker />)}
                </FormItem>
              </Col>
              <Col span={12} key={3}>
                <FormItem {...formItemLayout} label="收款方法">
                  {getFieldDecorator('method')(
                    <Select
                      mode="combobox"
                      placeholder="请选择收款方法"
                      notFoundContent=""
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onChange={this.handleChange}
                    >
                      <Option key="c1">1111</Option>
                      <Option key="c2">222</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} key={4}>
                <FormItem {...formItemLayout} label="银行流水号">
                  {getFieldDecorator('bankTurnover')(<Input placeholder="请输入银行流水号" />)}
                </FormItem>
              </Col>
              <Col span={12} key={5}>
                <FormItem {...formItemLayout} label="客户付款方式">
                  {getFieldDecorator('custPayMethod')(<Select>
                    <Option value="1">微信</Option>
                    <Option value="2">支付宝</Option>
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} key={6}>
                <FormItem {...formItemLayout} label="币种">
                  {getFieldDecorator('currency')(<Select>
                    <Option value="1">CNY</Option>
                    <Option value="2">USD</Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={12} key={7}>
                <FormItem {...formItemLayout} label="金额">
                  {getFieldDecorator('amount')(<Input placeholder="请输入金额" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} key={8}>
                <FormItem {...formItemLayout} label="是否项目">
                  {getFieldDecorator('isProject')(<RadioGroup>
                    <Radio value="1">项目</Radio>
                    <Radio value="2">百一测评</Radio>
                  </RadioGroup>)}
                </FormItem>
              </Col>
              <Col span={12} key={9}>
                <FormItem {...formItemLayout} label="付款客户名称">
                  {getFieldDecorator('payCustName')(<Input placeholder="请输入付款客户名称" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} key={10}>
                <FormItem {...formItemLayout} label="客户付款银行">
                  {getFieldDecorator('custPayBank')(<Input placeholder="请输入客户付款银行" />)}
                </FormItem>
              </Col>
              <Col span={12} key={11}>
                <FormItem {...formItemLayout} label="客户付款银行账号">
                  {getFieldDecorator('custPayBankAcct')(<Input placeholder="请输入客户付款银行账号" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={12}>
                <FormItem {...formItemLayout} label="备注">
                  {getFieldDecorator('comment')(<TextArea
                    placeholder="请输入备注"
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

EditManualEntryBankTurnoverData.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  editKey: PropTypes.number.isRequired,
}

const EditManualEntryBankTurnoverDataWithForm = Form.create()(EditManualEntryBankTurnoverData)

export default EditManualEntryBankTurnoverDataWithForm
