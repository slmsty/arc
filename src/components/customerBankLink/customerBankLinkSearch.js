/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, DatePicker, Select } from 'antd'
import moment from 'moment'

import SelectCustomerWithForm from '../common/selectCustomer'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'
import MultipleDayPicker from '../common/multipleDayInput'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class ReviewReceiptClaimSearch extends React.Component {
  componentDidMount() {
  }
  onSelectCustomer = (customer) => {
    console.log(customer)
  }
  handleQuery = () => {
    // 验证是否通过
    const param = this.props.form.getFieldsValue()
    const custArrayData = this.props.form.getFieldValue('erpCustId')
    if (custArrayData) {
      param.erpCustId = custArrayData[0]
    }
    // console.log(param)
    // console.log(this.props.onQuery())
    this.props.onQuery(param)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please enter custOrderIds!' }],
    }
    return (
      <div>
        <Form
          className="ant-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={40}>
            <Col span={12} key={1}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('erpCustId')(
                  <SelectCustomerWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={12} key={2}>
              <FormItem {...formItemLayout} label="银行帐号">
                {getFieldDecorator('payBankAccount', {
                  rules: [{ pattern: /^[+]{0,1}(\d+)$/, message: '请输入正确银行帐号' }],
                })(
                  <Input
                    placeholder="请输入银行帐号"
                    onPressEnter={this.handleQuery}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={12} key={6}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status', {
                  initialValue: '1',
                })(
                  <Select
                    placeholder="请选择数据状态"
                    notFoundContent=""
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    onChange={this.handleChange}
                  >
                    <Option value="1">有效</Option>
                    <Option value="0">无效</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

ReviewReceiptClaimSearch.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}

const ReviewReceiptClaimSearchWithForm = Form.create()(ReviewReceiptClaimSearch)

export default ReviewReceiptClaimSearchWithForm
