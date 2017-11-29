import React, {Component} from 'react'
import moment from 'moment';
import requestJsonFetch from '../../http/requestJsonFecth'
import {Form, DatePicker, Input, Modal, message} from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class ARModal extends Component{
  onCancel = ()=>{
    this.props.onCancel();
    this.props.form.resetFields();
  }

  postEdit = (body, callback)=>{
    requestJsonFetch(
      '/XXXXXXX',
      {
        method: 'POST',
        body
      },
      callback
    )
  }

  onOk = ()=>{
    this.props.form.validateFields((err, values) => {
      if(err) return

      let body = {
        badDebtId: this.props.o.badDebtId,
        badDebtReturnAmount: values.badDebtReturnAmount,
        badDebtAmount: values.badDebtAmount,
        badDebtReturnAmount: values.badDebtReturnAmount,
        erpGlDate: values.erpGlDate.format('YYYY-MM-DD'),
        remark: values.remark
      }

      this.postEdit(body, response=>{
        if(response.resultCode === '000000'){
          this.props.onOk(body);
          this.props.form.resetFields();
        }else{
          message.error(response.resultMessage);
        }
      })
    });
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const {visible, o} = this.props;

    return (
      <Modal
        title="编辑"
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}>
          <Form>
            <FormItem label="已划销退回金额">
              {
                getFieldDecorator('badDebtReturnAmount', {
                  initialValue: o.badDebtReturnAmount
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem label="划销金额">
              {
                getFieldDecorator('badDebtAmount', {
                  initialValue: o.badDebtAmount
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem label="划销退回金额">
              {
                getFieldDecorator('badDebtReturnAmount', {
                  initialValue: o.badDebtReturnAmount,
                  rules: [
                    {required: true, message: '必须输入划销退回金额'}
                  ]
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem label="GL日期">
              {
                getFieldDecorator('erpGlDate', {
                  initialValue: o.erpGlDate ? moment(o.erpGlDate) : null,
                  rules: [
                    {required: true, message: '必须选择GL日期'}
                  ]})(
                  <DatePicker />
                )
              }
            </FormItem>
            <FormItem label="备注">
              {
                getFieldDecorator('remark', {initialValue: o.remark})(
                  <TextArea rows={4} />
                )
              }
            </FormItem>
          </Form>
      </Modal>
    )
  }
}

export default Form.create()(ARModal)
