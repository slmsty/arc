/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Radio, Select, Table, Icon } from 'antd'

import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item
/* const Search = Input.Search
const RadioGroup = Radio.Group
const Option = Select.Option
const { TextArea } = Input */

class EditBankLinkData extends React.Component {
  state = {
  }
  componentDidMount() {
    this.props.form.setFieldsValue({
      custBankName: 'test',
    })
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    const { getFieldDecorator } = this.props.form
    return (
      // console.log(this.props.delData)
      <div>
        <Modal
          title="编辑客户银行关系"
          visible={this.props.editVisible}
          onCancel={this.props.handleEditCancel}
          onOk={this.props.handleEditOk}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={40}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('customer')(<SelectCustomerWithForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="银行名称">
                  {getFieldDecorator('bank')(
                    <Input
                      placeholder="请输入银行名称"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={3}>
                <FormItem {...formItemLayout} label="银行帐号">
                  {getFieldDecorator('bankAccount')(
                    <Input
                      placeholder="请输入银行帐号"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={12} key={4}>
                <FormItem {...formItemLayout} label="收款方法">
                  {getFieldDecorator('receiptMethod')(
                    <Input
                      placeholder="请输入收款方法"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={5}>
                <FormItem {...formItemLayout} label="关系来源">
                  {getFieldDecorator('linkFrom')(
                    <Input
                      placeholder="请输入关系来源"
                    />,
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

EditBankLinkData.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  handleEditOk: PropTypes.func.isRequired,
  handleEditCancel: PropTypes.func.isRequired,
  editVisible: PropTypes.bool.isRequired,
}
const EditBankLinkDataWithForm = Form.create()(EditBankLinkData)

export default EditBankLinkDataWithForm
