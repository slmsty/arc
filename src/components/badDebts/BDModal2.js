import React, {Component} from 'react'
import moment from 'moment';
import requestJsonFetch from '../../http/requestJsonFecth'
import {Form, DatePicker, Input, Modal, message} from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class BDModal2 extends Component{
  onCancel = ()=>{
    this.props.onCancel();
    this.props.form.resetFields();
  }

  postEdit = (body, callback)=>{
    requestJsonFetch(
      '/arc/badDebt/back',
      {
        method: 'POST',
        body
      },
      callback
    )
  }

  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if(err) return
      let body = {
        badDebtBack: {
          badDebtId: this.props.o[0].badDebtId,
          badDebtBackAmount: values.badDebtBackAmount,
          glDate: values.glDate.format('YYYY-MM-DD'),
          badDebtBackRemark: values.badDebtBackRemark
        }
      }
      this.props.onOk(body)
      this.props.form.resetFields()

    })
  }

  RAValidator = (rule, value, callback)=>{
    let msg = undefined;
    if(value > this.props.form.getFieldValue('badDebtAmount')-this.props.form.getFieldValue('badDebtReturnAmount')){
      msg = '划销退回金额必须小于等于（划销金额-已划销退回金额）'
    }
    callback(msg)
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const {visible, o} = this.props;

    return (
      <Modal
        title="编辑"
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        <Form>
          <FormItem label="已划销退回金额">
            {
              getFieldDecorator('badDebtReturnAmount', {
                initialValue: o.badDebtReturnAmount
              })(
                <Input disabled />
              )
            }
          </FormItem>
          <FormItem label="划销金额">
            {
              getFieldDecorator('badDebtAmount', {
                initialValue: o.badDebtAmount
              })(
                <Input disabled />
              )
            }
          </FormItem>
          <FormItem label="划销退回金额">
            {
              getFieldDecorator('badDebtBackAmount', {
                initialValue: o.badDebtBackAmount,
                rules: [
                  {required: true, message: '必须输入划销退回金额'},
                  {validator: this.RAValidator}
                ]
              })(
                <Input />
              )
            }
          </FormItem>
          <FormItem label="GL日期">
            {
              getFieldDecorator('glDate', {
                initialValue: o.glDate ? moment(o.glDate) : null,
                rules: [
                  {required: true, message: '必须选择GL日期'}
                ]})(
                <DatePicker />
              )
            }
          </FormItem>
          <FormItem label="备注">
            {
              getFieldDecorator('badDebtBackRemark', {initialValue: o.badDebtBackRemark})(
                <TextArea rows={4} />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(BDModal2)
