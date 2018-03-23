/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Radio, DatePicker, Input, Icon, Select } from 'antd'
import moment from 'moment'
import MultipleInput from '../common/multipleInput'
import SelectRadioApi from  '../common/selectRadioApi'
import SelectSbu from '../common/SelectSbu'
import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const dateFormat = 'YYYY-MM-DD'
const { RangePicker } = DatePicker
const Option = Select.Option;
class ERPWithFrom extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
    stateType: '100',
  }

  // 查询接口
  queryParms = (statement) => {
    const params = this.props.form.getFieldsValue()
      this.props.queryParms(params)
  }
  handleRadioChange = (e) => {
    this.setState({
      stateType:e.target.value,
    })
    this.props.showCols(e.target.value)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    }
    const formItemLayoutChild = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >

          <div>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码(多)">
                  {
                    getFieldDecorator('projectIds')(
                      <MultipleInput
                        placeholder="多项目编码使用英文逗号间隔"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码(多)">
                  {
                    getFieldDecorator('contractNo')(
                      <MultipleInput
                        placeholder="多合同编码使用英文逗号间隔"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约日期">
                  {getFieldDecorator('signDate', {
                    initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="立项BU">
                  {
                    getFieldDecorator('projectBuNo')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="是否采集项目">
                  {
                    getFieldDecorator('isProdect',{
                      initialValue:'all'
                    })(
                      <Select>
                        <Option value="all">全部</Option>
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayoutChild} label="是否拆分">
                    {
                      getFieldDecorator('isSplit',{
                        initialValue:'all'
                      })(
                        <Select>
                          <Option value="all">全部</Option>
                          <Option value="Y">是</Option>
                          <Option value="N">否</Option>
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayoutChild} label="签约公司">
                    {getFieldDecorator('signCompany')(
                      <Input
                        placeholder="请输入签约公司"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
                  {/*<Button style={{marginLeft:'10px'}} type="primary" onClick={this.queryParms}>导出Excel</Button>*/}
                </Col>
              </Row>
          </div>
        </Form>
      </div>
    )
  }
}
const ERPWithFromWithForm = Form.create()(ERPWithFrom)

export default ERPWithFromWithForm
