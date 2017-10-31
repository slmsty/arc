/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Input } from 'antd'

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
    param.receiptClaimId = this.props.receiptClaimId

    console.log(param)
    this.props.onConfirm(param)
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
          onCancel={this.props.onCancel}
          onOk={this.handleConfirm}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={24} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('custId')(<SelectCustomerWithForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={2}>
                <FormItem {...formItemLayout} label="流水分类">
                  {getFieldDecorator('claimType')(<SelectInvokeApi
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
                  {getFieldDecorator('custPayMethod')(<SelectInvokeApi
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
  }).isRequired,
  receiptClaimId: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

const EditCBSTurnoverDataWithForm = Form.create()(EditCBSTurnoverData)

export default EditCBSTurnoverDataWithForm
