/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, DatePicker, Select } from 'antd'
import moment from 'moment'

import SelectCustomerWithForm from '../common/selectCustomer'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'
import MultipleDayPicker from '../common/multipleDayPicker'

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
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      // Should format date value before submit.
      const values = {
        ...fieldsValue,
        startDate: fieldsValue['startDate'].format('YYYY-MM-DD'),
        endDate: fieldsValue['endDate'].format('YYYY-MM-DD'),
      }
      console.log('Received values of form: ', values);
    })
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
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="收款日期从：">
                {getFieldDecorator('startDate', {
                  initialValue: moment().subtract(1, 'days'),
                })(
                  <DatePicker format={dateFormat} />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('custId')(
                  <SelectCustomerWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status', {
                  initialValue: '会计已认款',
                })(
                  <Select
                    placeholder="请选择数据状态"
                    notFoundContent=""
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    onChange={this.handleChange}
                  >
                    <Option value="会计已认款">会计已认款</Option>
                    <Option value="等待传送AR">等待传送AR</Option>
                    <Option value="已传送AR">已传送AR</Option>
                    <Option value="传送失败">传送失败</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="收款日期至：">
                {getFieldDecorator('endDate', {
                  initialValue: moment(),
                })(
                  <DatePicker format={dateFormat} />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="收款方法">
                {getFieldDecorator('receiptMethodId')(
                  <SelectReceiptMethodWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="订单号(多)">
                {getFieldDecorator('custOrderIds')(
                  <Input
                    placeholder="多订单号使用英文逗号间隔"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={7}>
              <FormItem {...formItemLayout} label="项目编码(多)">
                {
                  getFieldDecorator('projectIds')(
                    <Input placeholder="多编码间使用英文逗号间隔" />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="合同编码(多)">
                {
                  getFieldDecorator('contractIds')(
                    <Input placeholder="多编码间使用英文逗号间隔" />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={9}>
              <FormItem {...formItemLayout} label="流水分类">
                {getFieldDecorator('claimType', {
                  initialValue: ['项目'],
                })(
                  <Select>
                    <Option value="项目">项目</Option>
                    <Option value="百一测评">百一测评</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
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
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
}

const ReviewReceiptClaimSearchWithForm = Form.create()(ReviewReceiptClaimSearch)

export default ReviewReceiptClaimSearchWithForm
