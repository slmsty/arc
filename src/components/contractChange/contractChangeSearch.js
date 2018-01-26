/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon, Input, DatePicker, Select } from 'antd'
import moment from 'moment'

import SelectCustomerWithForm from '../common/selectCustomer'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD'

class ContractChangeSerch extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  handleQuery = () => {
    const param = this.props.form.getFieldsValue()
    param.startDate = param.contractChangeDate[0].format(dateFormat)
    param.endData = param.contractChangeDate[1].format(dateFormat)
    delete param.contractChangeDate
    if (param.custId) {
      param.custId = param.custId[0]
    }
    this.props.onQuery(param)
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
          className="ant-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={40}>
            <Col span={9} key={1}>
              <FormItem {...formItemLayout} label="合同变更日期">
                {getFieldDecorator('contractChangeDate', {
                  initialValue: [moment().subtract(1, 'day'), moment()],
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
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('custId')(
                  <SelectCustomerWithForm />,
                )}
              </FormItem>
            </Col>
            <Col span={7} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

ContractChangeSerch.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}

const ContractChangeSerchWithForm = Form.create()(ContractChangeSerch)

export default ContractChangeSerchWithForm
