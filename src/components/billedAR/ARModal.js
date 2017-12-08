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
      '/arc/billedar/confirm/edit',
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
        billedArId: this.props.o.billedArId,
        billedArDate: values.billedArDate.format('YYYY-MM-DD'),
        glDate: values.glDate.format('YYYY-MM-DD'),
        arAccountantApproveMessage: values.arAccountantApproveMessage
      }

      const isShow = !((this.props.o.paymentTerm==='按进度'&&this.props.o.paymentName==='预付款')||(this.props.o.paymentTerm==='按时间'&&this.props.o.paymentName!=='结算款'));
      if(isShow){
        body.reportDate = values.reportDate.format('YYYY-MM-DD');
        body.assessTaxIncludedAmount = values.assessTaxIncludedAmount;
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

  myValidator = (force, msg)=>{
    return (rule, value, callback)=>{
      if(force && !value){
        callback(msg)
      }else{
        callback()
      }
    }
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const {visible, o} = this.props;

    const isShow = !((o.paymentTerm==='按进度'&&o.paymentName==='预付款')||(o.paymentTerm==='按时间'&&o.paymentName!=='结算款'));

    return (
      <Modal
        title="编辑"
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}>
          <Form>
            <FormItem label="Billed AR日期">
              {
                getFieldDecorator('billedArDate', {
                  initialValue: o.billedArDate ? moment(o.billedArDate) : null,
                  rules: [
                    {required: true, message: '必须选择Billed AR日期'}
                  ]
                })(
                  <DatePicker />
                )
              }
            </FormItem>
            <FormItem label="GL日期">
              {
                getFieldDecorator('glDate', {
                  initialValue: o.glDate ? moment(o.glDate) : null,
                  rules: [
                    {required: true, message: '必须选择GL日期'}
                  ]
                })(
                  <DatePicker />
                )
              }
            </FormItem>
            {
              isShow
              ?
              <FormItem label="报告日期">
                {
                  getFieldDecorator('reportDate', {
                    initialValue: o.reportDate ? moment(o.reportDate) : null,
                    rules: [
                      {validator: this.myValidator(isShow, '必须选择报告日期')}
                    ]
                  })(
                    <DatePicker />
                  )
                }
              </FormItem>
              :
              null
            }
            {
              isShow
              ?
              <FormItem label="考核含税金额">
                {
                  getFieldDecorator('assessTaxIncludedAmount', {
                    initialValue: o.assessTaxIncludedAmount,
                    rules: [
                      {validator: this.myValidator(isShow, '必须输入考核含税金额')}
                    ]
                  })(
                    <Input placeholder="考核含税金额" />
                  )
                }
              </FormItem>
              :
              null
            }
            <FormItem label="备注">
              {
                getFieldDecorator('arAccountantApproveMessage', {initialValue: o.arAccountantApproveMessage})(
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
