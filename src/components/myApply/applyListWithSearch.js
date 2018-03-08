/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import SelectRadioApi from '../common/selectRadioApi'
import SelectInvokeApi from '../common/selectInvokeApi'
import requestJsonFetch from '../../http/requestJsonFecth'
import { Form, Row, Col, Button, Input, Icon, Radio } from 'antd'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class ApplySearchCon extends React.Component {
  state = {
    showBillType: false,
    options:[],
    typeCode:'',
  }
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
    console.log(param)
    this.props.onQuery(param)
  }
  handleRadioChange = (e) => {
    this.setState({
      typeCode:e.target.value,
    })
    const typeCode = e.target.value
    const paramCode = "APPLY_TYPE"
    requestJsonFetch(`/arc/sysparam/get/${typeCode}/${paramCode}`, { method: 'get' }, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      const options = response.data
      if(options.length){
        this.setState({
          showBillType:true,
        })
      }
      if(!options.length){
        this.setState({
          showBillType:false,
        })
      }
      this.setState({
        options,
      })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="申请单号">
                {getFieldDecorator('businessKey')(<Input placeholder="申请单号" onPressEnter={this.handleQuery} />)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="申请人">
                {getFieldDecorator('applyPersonKeyword')(<Input placeholder="姓名／工号／NT" onPressEnter={this.handleQuery} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="申请类型">
                {getFieldDecorator('serviceType')(
                  <SelectRadioApi
                    typeCode="WORK_FLOW"
                    paramCode="APPLY_TYPE"
                    onChange={(e)=>this.handleRadioChange(e)}
                    options={[]}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} style={{ display: this.state.showBillType ? 'block' : 'none' }}>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="发票类型">
                {getFieldDecorator('serviceSonType', {
                  initialValue: 'BILLING_NORMAL',
                })(
                  <SelectRadioApi
                    options={this.state.options}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="申请时间">
                {getFieldDecorator('applyDate', {
                  initialValue: 'ALL',
                })(
                  <RadioGroup size="large" style={{ width: '330px' }}>
                    <RadioButton value="ALL" style={{ borderRadius: '4px' }}>全部</RadioButton>
                    <RadioButton value="WEEK" style={{ marginLeft: '10px', borderRadius: '4px' }}>近一周</RadioButton>
                    <RadioButton value="MONTH" style={{ marginLeft: '10px', borderRadius: '4px' }}>近一个月</RadioButton>
                    <RadioButton value="YEAR" style={{ marginLeft: '10px', borderRadius: '4px' }}>近一年</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="申请状态">
                {getFieldDecorator('status', {
                  initialValue: 'approve',
                })(
                  <RadioGroup size="large" style={{ width: '330px' }}>
                    <RadioButton value="ALL" style={{ borderRadius: '4px' }}>全部</RadioButton>
                    <RadioButton value="approve" style={{ marginLeft: '10px', borderRadius: '4px' }}>审批中</RadioButton>
                    <RadioButton value="finish" style={{ marginLeft: '10px', borderRadius: '4px' }}>审批完成</RadioButton>
                    <RadioButton value="reject" style={{ marginLeft: '10px', borderRadius: '4px' }}>驳回</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={this.handleQuery} disabled={this.props.loading}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
ApplySearchCon.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}
const ApplySearchConWithForm = Form.create()(ApplySearchCon)

export default ApplySearchConWithForm
