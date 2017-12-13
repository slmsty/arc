/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, message } from 'antd'

import SelectInvokeApi from '../common/selectInvokeApi'
import SelectCustomerWithForm from '../common/selectCustomer'
import SelectBillDialog from '../common/selectBill'

const FormItem = Form.Item
const { TextArea } = Input

class EditCBSTurnoverData extends React.Component {
  constructor(props) {
    super(...props)
  }
  handleConfirm = () => {
    const param = this.props.form.getFieldsValue()

    if (param.relatedBills && param.relatedBills.length && param.relatedBills[0] &&
      !param.paidStatus) {
      message.error('请选择解付状态。')
      return
    } else if ((!param.relatedBills || !param.relatedBills.length || !param.relatedBills[0]) &&
      param.paidStatus) {
      message.error('请选择相关票据。')
      return
    }

    if (!param.custPayMethod) {
      message.error('请选择客户付款方式。')
      return
    }

    param.receiptClaimId = this.props.receiptClaimId
    param.custId = param.customer && param.customer.length ? param.customer[0] : null
    param.custName = param.customer && param.customer.length ? param.customer[1] : null
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
    const formItemWholeLineLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Modal
          title="CBS完整性编辑"
          visible={this.props.visible}
          onCancel={this.handleCancel}
          onOk={this.handleConfirm}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={24} key={1}>
                <FormItem {...formItemWholeLineLayout} label="客户名称">
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
                    initialValue: this.props.initData.relatedBill,
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
                    disabled={this.props.initData.custPayMethod === 'bank_acceptance' || this.props.initData.custPayMethod === 'trade_acceptance'}
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="PAID_STATUS"
                    placeholder="请选择解付状态"
                    hasEmpty
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={4}>
                <FormItem {...formItemWholeLineLayout} label="客户付款方式">
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
            <Row>
              <Col span={24} key={5}>
                <FormItem {...formItemWholeLineLayout} label="备注">
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

EditCBSTurnoverData.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
  receiptClaimId: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  initData: PropTypes.shape().isRequired,
}

const EditCBSTurnoverDataWithForm = Form.create()(EditCBSTurnoverData)

export default EditCBSTurnoverDataWithForm
