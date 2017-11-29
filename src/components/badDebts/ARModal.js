import React, {Component} from 'react'
import moment from 'moment';
import requestJsonFetch from '../../http/requestJsonFecth'
import {Form, DatePicker, Input, Modal, message, Spin} from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class ARModal extends Component{
  onCancel = ()=>{
    this.props.onCancel();
    this.props.form.resetFields();
  }

  postEdit = (body, callback)=>{
    requestJsonFetch(
      '/arc/badDebt/apply/save',
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
        badDebtProvisionAmount: values.badDebtProvisionAmount,
        billedArAmount: values.billedArAmount,
        badDebtAmount: values.badDebtAmount,
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
          {
            this.props.isReady 
            ?
            <Form>
              <FormItem label="GL已提坏账准备金额">
                {
                  getFieldDecorator('badDebtProvisionAmount', {
                    initialValue: o.badDebtProvisionAmount
                  })(
                    <Input />
                  )
                }
              </FormItem>
              <FormItem label="Billed AR金额">
                {
                  getFieldDecorator('billedArAmount', {
                    initialValue: o.billedArAmount
                  })(
                    <Input />
                  )
                }
              </FormItem>
              <FormItem label="坏账划销金额">
                {
                  getFieldDecorator('badDebtAmount', {
                    initialValue: o.badDebtAmount,
                    rules: [
                      {required: true, message: '必须输入坏账划销金额'}
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
                    ]
                  })(
                    <DatePicker />
                  )
                }
              </FormItem>
              <FormItem label="备注">
                {
                  getFieldDecorator('remark', {
                    initialValue: o.remark,
                    rules: [
                      {required: true, message: '必须输入备注'}
                    ]
                  })(
                    <TextArea rows={4} />
                  )
                }
              </FormItem>
            </Form>
            :
            <div style={{textAlign: 'center'}}><Spin tip="请稍等..."/></div>
          }
      </Modal>
    )
  }
}

export default Form.create()(ARModal)
