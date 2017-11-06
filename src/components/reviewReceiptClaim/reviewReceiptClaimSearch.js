/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, DatePicker, Select } from 'antd'
import moment from 'moment'

import SelectCustomerWithForm from '../common/selectCustomer'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'
import MultipleInput from '../common/multipleInput'
import SelectInvokeApi from '../common/selectInvokeApi'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class ReviewReceiptClaimSearch extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  onSelectCustomer = (customer) => {
    console.log(customer)
  }
  handleQuery = () => {
    const param = this.props.form.getFieldsValue()
    const custArray = this.props.form.getFieldValue('custId')
    if (custArray) {
      param.custId = custArray[0]
    }
    param.startDate = param.startDate.format(dateFormat)
    param.endDate = param.endDate.format(dateFormat)
    // console.log(param)
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
                  initialValue: '31',
                })(
                  <Select
                    placeholder="请选择数据状态"
                    notFoundContent=""
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    onChange={this.handleChange}
                  >
                    {/* <Option value="10">新建</Option> */}
                    <Option value="31">会计已认款</Option>
                    <Option value="50">等待传送AR</Option>
                    <Option value="51">已传送AR</Option>
                    <Option value="52">传送失败</Option>
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
                  <MultipleInput
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
                    <MultipleInput
                      placeholder="多项目编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="合同编码(多)">
                {
                  getFieldDecorator('contractIds')(
                    <MultipleInput
                      placeholder="多合同编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={9}>
              <FormItem {...formItemLayout} label="流水分类">
                {getFieldDecorator('claimType', {
                  initialValue: 'project',
                })(
                  <SelectInvokeApi
                    id="claimType"
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="CLAIM_TYPE"
                    placeholder="请选择流水分类" // <Select><Option value="project">项目</Option><Option value="">百一测评</Option</Select>
                  />,
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
    getFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}

const ReviewReceiptClaimSearchWithForm = Form.create()(ReviewReceiptClaimSearch)

export default ReviewReceiptClaimSearchWithForm
