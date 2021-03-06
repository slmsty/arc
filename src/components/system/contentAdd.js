import React from 'react'
import { Form, Button, Row, Col, Modal, Icon, Input, InputNumber, Select } from 'antd'
import SelectInvokeApi from '../common/selectInvokeApi'
const FormItem = Form.Item
const Option = Select.Option

class ContentAdd extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      reasonId: '',
      prefPolicySign: props.record.prefPolicySign,
      addLoading: false,
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    const { billingRecordId } = this.props.record
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          addLoading: true
        })
        const trimValues = {
          ...values,
          billingContentCode: values.billingContentCode ? values.billingContentCode.trim() : null,
          billingContentName: values.billingContentName.trim(),
          taxCategoryCode: values.taxCategoryCode.trim(),
        }
        const params = billingRecordId ? {
          ...trimValues,
          billingRecordId,
          actionType: 'EDIT',
        } : {
          ...trimValues,
          actionType: 'NEW',
        }
        this.props.saveInvoiceTaxInfo(params).then(res => {
          if(res && res.response) {
            this.setState({
              addLoading: false
            })
          }
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { billingContentCode, billingRecordId, billingContentName, taxCategoryCode, prefPolicySign, prefPolicyType, taxCategoryVersion, taxIncludeAmount, status } = this.props.record
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    }
    return (
      <div>
        <Modal
          width="700px"
          title="新增开票内容"
          visible={this.props.visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.props.onCancel()}
          footer={[
            <Button key="submit" type="primary" loading={this.state.addLoading} onClick={(e) => this.handleOk(e)}>
              {!this.state.addLoading ? <Icon type="check" /> : ''}保存
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="开票内容编码">
                  {getFieldDecorator('billingContentCode', {
                    initialValue: billingContentCode})(
                    <Input disabled={typeof billingRecordId !== 'undefined'}/>
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="开票内容名称">
                  {getFieldDecorator('billingContentName', {initialValue: billingContentName, rules: [{ required: true, message: '请填写开票内容名称!' }]})(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="税收分类编码">
                  {
                    getFieldDecorator('taxCategoryCode',{
                      initialValue: taxCategoryCode, rules: [{ required: true, message: '请填写税收分类编码!' }, {len: 19, message: '税收分类编码必须为19位!'}]
                    })(<Input placeholder="税收分类编码"/>)
                  }
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="优惠政策标识">
                  {getFieldDecorator('prefPolicySign', {initialValue: prefPolicySign || '', rules: [{ required: true, message: '请选择优惠政策标识!' }]})(
                    <Select onChange={(v) => {this.setState({prefPolicySign: v})}}>
                      <Option value="">-请选择-</Option>
                      <Option value="1">使用</Option>
                      <Option value="0">不使用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="税收分类版本号">
                  {getFieldDecorator('taxCategoryVersion', {initialValue: taxCategoryVersion, rules: [{ required: true, message: '请填写税收分类版本号!' }]})(
                    <Input />
                  )}
                </FormItem>
              </Col>
              {
                this.state.prefPolicySign === '1' ?
                  <Col span={12} key={2}>
                    <FormItem {...formItemLayout} label="优惠政策内容">
                      {getFieldDecorator('prefPolicyType', { initialValue : prefPolicyType || '', rules: [{ required: this.state.prefPolicySign === '1', message: '请选择优惠政策内容!' }]})(
                        <SelectInvokeApi
                          typeCode="PREF_POLICY_TYPE"
                          paramCode="PREF_POLICY_TYPE"
                          placeholder="优惠政策内容"
                          hasEmpty={false}
                        />
                      )}
                    </FormItem>
                  </Col> : null
              }
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="扣除额">
                  {getFieldDecorator('taxIncludeAmount', {initialValue: taxIncludeAmount, rules: [{ required: true, message: '请填写扣除额!' }]})(
                    <InputNumber style={{width: '200px'}}/>
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="是否有效">
                  {getFieldDecorator('status', { initialValue : status || '', rules: [{ required: true, message: '请选择是否有效!' }]})(
                    <Select>
                      <Option value="">-请选择-</Option>
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
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

export default Form.create()(ContentAdd)
