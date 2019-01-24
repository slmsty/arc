/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, DatePicker, Select } from 'antd'
import moment from 'moment'


import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'
import SelectReceiptCompanyWithForm from '../common/selectReceiptCompany'
import MultipleDayInput from '../common/multipleDayInput'
import MultipleInput from '../common/multipleInput'
import SelectInvokeApi from '../common/selectInvokeApi'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class ProjectReceiptClaimSearch extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  handleQuery = () => {

    const param = this.props.form.getFieldsValue()
    param.payCustName=document.querySelector("#username").value.trim();
    console.log(param);
    if (param.receiptDate.length > 0) {
      param.receiptDateStart = param.receiptDate[0].format(dateFormat)
      param.receiptDateEnd = param.receiptDate[1].format(dateFormat)
    } else {
      param.receiptDateStart = ''
      param.receiptDateEnd = ''
    }
    delete param.receiptDate
    if (param.cust) {
      param.custId = param.cust[0]
      delete param.cust
    }
    if (param.receiptMethod) {
      param.receiptMethodId = param.cust[0]
      delete param.receiptMethod
    }
    
    this.props.onQuery(param);
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    return (
      <div>
        <Form
          className="ant-search-formpayCustName"
          onSubmit={this.handleSearch}
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="收款日期">
                {getFieldDecorator('receiptDate', {
                  /*initialValue: [moment().subtract(1, 'day'), moment()],*/
                  initialValue: [moment().startOf('month'), moment().endOf('month')],
                })(
                  <RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="付款客户">
                {getFieldDecorator('payCustName')(
                  <div><Input
          id='username'
          placeholder="付款客户"
          
        /></div>,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="收款来源">
                {getFieldDecorator('sourceType')(
                  <SelectInvokeApi
                    placeholder="请选择收款来源"
                    typeCode="ARC_RECEIPT_CLAIM"
                    paramCode="SOURCE_TYPE"
                    hasEmpty
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="项目编码">
                {getFieldDecorator('projectIds')(
                  <MultipleInput
                    placeholder="多项目编码使用英文逗号间隔"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="收款方法">
                {getFieldDecorator('receiptMethod')(
                  <SelectReceiptMethodWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={10}>
              <FormItem {...formItemLayout} label="收款编号">
                {getFieldDecorator('receiptNo')(
                  <Input onPressEnter={this.handleQuery} placeholder="请输入收款编号" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="公司">
                {getFieldDecorator('companyName')(
                  <Input
                    onPressEnter={this.handleQuery}
                    placeholder="请输入公司关键字"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={9}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status', {
                  initialValue: '21',
                })(
                  <Select>
                    <Option value="21">出纳已确认</Option>
                    <Option value="40">复核退回</Option>
                    <Option value="51">已传送AR</Option>
                    <Option value="60">暂挂</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="合同编码">
                {getFieldDecorator('contractIds')(
                  <MultipleInput
                    placeholder="多合同编码使用英文逗号间隔"
                  />,
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

ProjectReceiptClaimSearch.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}

const ProjectReceiptClaimSearchWithForm = Form.create()(ProjectReceiptClaimSearch)

export default ProjectReceiptClaimSearchWithForm
