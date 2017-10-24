/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Radio, Select, Table, Icon } from 'antd'

import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item
const Search = Input.Search
const RadioGroup = Radio.Group
const Option = Select.Option
const { TextArea } = Input

class EditCBSTurnoverData extends React.Component {
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
          title="CBS完整性编辑"
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          onOk={this.props.onConfirm}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={24} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('customer')(<SelectCustomerWithForm />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={2}>
                <FormItem {...formItemLayout} label="流水分类">
                  {getFieldDecorator('turnoverType')(<RadioGroup>
                    <Radio value={1}>项目</Radio>
                    <Radio value={2}>百一测评</Radio>
                  </RadioGroup>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={3}>
                <FormItem {...formItemLayout} label="客户付款方式">
                  {getFieldDecorator('custPayMethod')(<Select>
                    <Option value="1">微信</Option>
                    <Option value="2">支付宝</Option>
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} key={4}>
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

EditCBSTurnoverData.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

const EditCBSTurnoverDataWithForm = Form.create()(EditCBSTurnoverData)

export default EditCBSTurnoverDataWithForm
