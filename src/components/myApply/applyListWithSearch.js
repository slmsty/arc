/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import SelectRadioApi from '../common/selectRadioApi'
import requestJsonFetch from '../../http/requestJsonFecth'
import { Form, Row, Col, Button, Input, Icon, Radio, DatePicker } from 'antd'
const { RangePicker } = DatePicker
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
    const params = {
      ...param,
      beginDate: param.applyDate.length > 0 ? param.applyDate[0].format('YYYY-MM-DD') : '',
      endDate: param.applyDate.length > 0 ? param.applyDate[1].format('YYYY-MM-DD') : '',
    }
    this.props.onQuery(params)
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
      wrapperCol: { span: 18 },
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
            <Col span={8} key={2} style={{display:this.props.type==='myApply' ? 'none' : 'block'}}>
              <FormItem {...formItemLayout} label="申请人">
                {getFieldDecorator('applyPersonKeyword')(<Input placeholder="姓名／工号／NT" onPressEnter={this.handleQuery} />)}
              </FormItem>
            </Col>
            <Col span={8} key={3} style={{display:this.props.type==='myApply' ? 'none' : 'block'}}>
              <FormItem {...formItemLayout} label="项目编码">
                {getFieldDecorator('projectNo')(<Input placeholder="项目编码" onPressEnter={this.handleQuery} />)}
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
                  initialValue: [],
                })(
                  <RangePicker />
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
                  <RadioGroup size="large" style={{ width: '400px' }}>
                    <RadioButton value="" style={{ borderRadius: '4px' }}>全部</RadioButton>
                    <RadioButton value="approve" style={{ marginLeft: '10px', borderRadius: '4px' }}>审批中</RadioButton>
                    <RadioButton value="finish" style={{ marginLeft: '10px', borderRadius: '4px' }}>审批完成</RadioButton>
                    <RadioButton value="reject" style={{ marginLeft: '10px', borderRadius: '4px' }}>驳回</RadioButton>
                    <RadioButton value="cancel" style={{ marginLeft: '10px', borderRadius: '4px' }}>撤销</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
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
