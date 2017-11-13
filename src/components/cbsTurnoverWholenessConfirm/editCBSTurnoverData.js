/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input, message } from 'antd'

import SelectInvokeApi from '../common/selectInvokeApi'
import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item
const { TextArea } = Input

class EditCBSTurnoverData extends React.Component {
  constructor(props) {
    super(...props)
  }
  handleConfirm = () => {
    const param = this.props.form.getFieldsValue()

    if (!param.claimType) {
      message.error('请选择流水分类。')
      return
    }

    if (!param.custPayMethod) {
      message.error('请选择客户付款方式。')
      return
    }

    param.receiptClaimId = this.props.receiptClaimId
    param.custId = param.customer.length ? param.customer[0] : null
    param.custName = param.customer.length ? param.customer[1] : null
    delete param.customer
    this.props.form.resetFields()
    this.props.onConfirm(param)
  }

  handleCancel = () => {
    this.props.form.resetFields()
    this.props.onCancel()
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
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('customer', {
                    initialValue: [this.props.initData.custId || '', this.props.initData.custName],
                  })(<SelectCustomerWithForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={2}>
                <FormItem {...formItemLayout} label="流水分类">
                  {getFieldDecorator('claimType', {
                    initialValue: this.props.initData.claimType,
                  })(<SelectInvokeApi
                    id="sourceType"
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="CLAIM_TYPE"
                    placeholder="请选择流水分类"
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={3}>
                <FormItem {...formItemLayout} label="客户付款方式">
                  {getFieldDecorator('custPayMethod', {
                    initialValue: this.props.initData.custPayMethod,
                  })(<SelectInvokeApi
                    id="sourceType"
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="CUST_PAY_METHOD"
                    placeholder="请选择客户付款方式"
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={4}>
                <FormItem {...formItemLayout} label="备注">
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
