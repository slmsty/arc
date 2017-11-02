/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, DatePicker, Input } from 'antd'

import SelectInvokeApi from '../common/selectInvokeApi'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'
import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item
const { TextArea } = Input

class EditManualEntryBankTurnoverData extends React.Component {
  constructor(props) {
    super(...props)
  }
  handleConfirm = () => {
    const param = this.props.form.getFieldsValue()
    param.receiptClaimId = this.props.editKey
    this.props.form.resetFields()
    this.props.onConfirm(param)
  }

  handleCancel = () => {
    this.props.form.resetFields()
    this.props.onCancel()
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    }
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Modal
          title="人工录入收款编辑"
          visible={this.props.visible}
          onCancel={this.handleCancel}
          onOk={this.handleConfirm}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={10}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('custId')(<SelectCustomerWithForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="收款日期">
                  {getFieldDecorator('receiptDate')(<DatePicker />)}
                </FormItem>
              </Col>
              <Col span={12} key={3}>
                <FormItem {...formItemLayout} label="收款方法">
                  {getFieldDecorator('receiptMethodId')(<SelectReceiptMethodWithForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={4}>
                <FormItem {...formItemLayout} label="银行流水号">
                  {getFieldDecorator('bankTransactionNo')(<Input placeholder="请输入银行流水号" />)}
                </FormItem>
              </Col>
              <Col span={12} key={5}>
                <FormItem {...formItemLayout} label="客户付款方式">
                  {getFieldDecorator('custPayMethod')(<SelectInvokeApi
                    id="sourceType"
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="CUST_PAY_METHOD"
                    placeholder="请选择客户付款方式"
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={6}>
                <FormItem {...formItemLayout} label="币种">
                  {getFieldDecorator('currency')(<SelectInvokeApi
                    id="sourceType"
                    typeCode="COMMON"
                    paramCode="CURRENCY"
                    placeholder="请选择币种"
                  />)}
                </FormItem>
              </Col>
              <Col span={12} key={7}>
                <FormItem {...formItemLayout} label="金额">
                  {getFieldDecorator('amount')(<Input placeholder="请输入金额" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={8}>
                <FormItem {...formItemLayout} label="流水分类">
                  {getFieldDecorator('claimType')(<SelectInvokeApi
                    id="sourceType"
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="CLAIM_TYPE"
                    placeholder="请选择流水分类"
                  />)}
                </FormItem>
              </Col>
              <Col span={12} key={9}>
                <FormItem {...formItemLayout} label="付款客户名称">
                  {getFieldDecorator('payCustName')(<Input placeholder="请输入付款客户名称" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={10}>
                <FormItem {...formItemLayout} label="客户付款银行">
                  {getFieldDecorator('payBankName')(<Input placeholder="请输入客户付款银行" />)}
                </FormItem>
              </Col>
              <Col span={12} key={11}>
                <FormItem {...formItemLayout} label="客户付款银行账号">
                  {getFieldDecorator('payBankAccount')(<Input placeholder="请输入客户付款银行账号" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={12}>
                <FormItem label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('statusRemark')(<TextArea
                    placeholder="请输入备注"
                    autosize={{ minRows: 3, maxRows: 3 }}
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
    getFieldsValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
  editKey: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

const EditManualEntryBankTurnoverDataWithForm = Form.create()(EditManualEntryBankTurnoverData)

export default EditManualEntryBankTurnoverDataWithForm
