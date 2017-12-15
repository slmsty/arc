/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, DatePicker, Input, message } from 'antd'
import moment from 'moment'

import SelectInvokeApi from '../common/selectInvokeApi'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'
import SelectCustomerWithForm from '../common/selectCustomer'
import SelectBillDialog from '../common/selectBill'

const FormItem = Form.Item
const { TextArea } = Input

class EditManualEntryBankTurnoverData extends React.Component {
  constructor(props) {
    super(...props)
  }
  handleConfirm = () => {
    if ((this.props.initData.custPayMethod === 'bank_acceptance' || this.props.initData.custPayMethod === 'trade_acceptance') &&
      (!this.props.initData.filePath || this.props.initData.filePath.length === 0)) {
      message.error('请先上传附件后再进行编辑。')
      return
    }
    const param = this.props.form.getFieldsValue()

    if (!param.receiptDate) {
      message.error('请选择收款日期。')
      return
    }

    if (param.relatedBills && param.relatedBills.length && param.relatedBills[0] &&
      !param.paidStatus) {
      message.error('请选择解付状态。')
      return
    } else if ((!param.relatedBills || !param.relatedBills.length || !param.relatedBills[0]) &&
      param.paidStatus) {
      message.error('请选择相关票据。')
      return
    }

    if (!param.receiptMethodId) {
      message.error('请选择收款方法。')
      return
    }

    if (!param.bankTransactionNo) {
      message.error('请输入银行流水号。')
      return
    }

    if (!param.custPayMethod) {
      message.error('请选择客户付款方式。')
      return
    }

    if (!param.currency) {
      message.error('请选择币种。')
      return
    }

    if (!param.amount) {
      message.error('请输入金额。')
      return
    }

    if (!param.claimType) {
      message.error('请选择流水分类。')
      return
    }

    if (param.relatedBills && param.relatedBills.length && param.relatedBills[0] &&
      parseFloat(param.relatedBills[2]).toFixed(2) !== parseFloat(param.amount).toFixed(2)) {
      message.error('当前流水的金额与相关票据金额不一致，请重新选择相关票据。')
      return
    }

    param.receiptClaimId = this.props.editKey
    param.erpCustId = param.customer.length ? param.customer[0] : null
    param.erpCustName = param.customer.length ? param.customer[1] : ''
    delete param.customer
    param.relatedBill = param.relatedBills && param.relatedBills.length ? param.relatedBills[0] : null
    delete param.relatedBills
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
          width={600}
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
                  {getFieldDecorator('customer', {
                    initialValue: [this.props.initData.custId || '', this.props.initData.custName],
                  })(<SelectCustomerWithForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="相关票据">
                  {getFieldDecorator('relatedBills', {
                    initialValue: [this.props.initData.relatedBill, this.props.initData.relatedBillBankTranNo, this.props.initData.relatedBillReceiptAmount],
                  })(<SelectBillDialog
                    disabled={this.props.initData.custPayMethod === 'bank_acceptance' || this.props.initData.custPayMethod === 'trade_acceptance'}
                  />)}
                </FormItem>
              </Col>
              <Col span={12} key={3}>
                <FormItem {...formItemLayout} label="解付状态">
                  {getFieldDecorator('paidStatus', {
                    initialValue: this.props.initData.paidStatus,
                  })(<SelectInvokeApi
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="PAID_STATUS"
                    placeholder="请选择解付状态"
                    disabled={this.props.initData.custPayMethod === 'bank_acceptance' || this.props.initData.custPayMethod === 'trade_acceptance'}
                    hasEmpty
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={4}>
                <FormItem {...formItemLayout} label="收款日期">
                  {getFieldDecorator('receiptDate', {
                    initialValue: moment(this.props.initData.receiptDate),
                  })(<DatePicker />)}
                </FormItem>
              </Col>
              <Col span={12} key={5}>
                <FormItem {...formItemLayout} label="收款方法">
                  {getFieldDecorator('receiptMethodId', {
                    initialValue: [this.props.initData.erpReceiptMethodId || '', this.props.initData.erpReceiptMethodName],
                  })(<SelectReceiptMethodWithForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={6}>
                <FormItem {...formItemLayout} label="银行流水号">
                  {getFieldDecorator('bankTransactionNo', {
                    initialValue: this.props.initData.bankTransactionNo,
                  })(<Input placeholder="请输入银行流水号" />)}
                </FormItem>
              </Col>
              <Col span={12} key={7}>
                <FormItem {...formItemLayout} label="客户付款方式">
                  {getFieldDecorator('custPayMethod', {
                    initialValue: this.props.initData.custPayMethod,
                  })(<SelectInvokeApi
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="CUST_PAY_METHOD"
                    placeholder="请选择客户付款方式"
                    hasEmpty
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={8}>
                <FormItem {...formItemLayout} label="币种">
                  {getFieldDecorator('currency', {
                    initialValue: this.props.initData.receiptCurrency,
                  })(<SelectInvokeApi
                    typeCode="COMMON"
                    paramCode="CURRENCY"
                    placeholder="请选择币种"
                    hasEmpty
                  />)}
                </FormItem>
              </Col>
              <Col span={12} key={9}>
                <FormItem {...formItemLayout} label="金额">
                  {getFieldDecorator('amount', {
                    initialValue: this.props.initData.receiptAmount,
                  })(<Input placeholder="请输入金额" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={10}>
                <FormItem {...formItemLayout} label="流水分类">
                  {getFieldDecorator('claimType', {
                    initialValue: this.props.initData.claimType,
                  })(<SelectInvokeApi
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="CLAIM_TYPE"
                    placeholder="请选择流水分类"
                    hasEmpty
                  />)}
                </FormItem>
              </Col>
              <Col span={12} key={11}>
                <FormItem {...formItemLayout} label="付款客户名称">
                  {getFieldDecorator('payCustName', {
                    initialValue: this.props.initData.payCustName,
                  })(<Input placeholder="请输入付款客户名称" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12} key={12}>
                <FormItem {...formItemLayout} label="客户付款银行">
                  {getFieldDecorator('payBankName', {
                    initialValue: this.props.initData.payBankName,
                  })(<Input placeholder="请输入客户付款银行" />)}
                </FormItem>
              </Col>
              <Col span={12} key={13}>
                <FormItem {...formItemLayout} label="客户付款银行账号">
                  {getFieldDecorator('payBankAccount', {
                    initialValue: this.props.initData.payBankAccount,
                  })(<Input placeholder="请输入客户付款银行账号" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={14}>
                <FormItem label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                  {getFieldDecorator('remark')(<TextArea
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
  initData: PropTypes.shape().isRequired,
}

const EditManualEntryBankTurnoverDataWithForm = Form.create()(EditManualEntryBankTurnoverData)

export default EditManualEntryBankTurnoverDataWithForm
