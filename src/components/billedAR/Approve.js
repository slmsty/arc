import React, {Component} from 'react'
import './Approve.css'
import {Form, Row, Col, DatePicker, Input, Button, Table} from 'antd';
import SelectCustomer from '../common/selectCustomer'
import SelectContractCompany from '../common/SelectContractCompany'
import MultipleInput from '../common/multipleInput'
import MultipleDayInput from '../common/multipleDayInput'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class Approve extends Component{
  constructor(props){
    super(props);
    const columns = [
      {
        title: '数据状态',
        fixed: 'left',
        key: 'statusShow'
      },
      {
        title: '付款条件',
        key: 'paymentTerm'
      },
      {
        title: '付款金额',
        key: 'paymentAmount'
      },
      {
        title: '考核含税金额',
        key: 'assessTaxIncludedAmount'
      },
      {
        title: <span>Billed AR金额<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'billedArAmount'
      },
      {
        title: '款项ID',
        key: 'fundId'
      },
      {
        title: '合同币种',
        key: 'contractCurrency'
      },
      {
        title: '合同金额',
        key: 'contractAmount'
      },
      {
        title: '项目编码',
        key: 'projectNo'
      },
      {
        title: '项目名称',
        key: 'projectName'
      },
      {
        title: '签约公司',
        key: 'companyName'
      },
      {
        title: '合同编码',
        key: 'contractNo'
      },
      {
        title: '合同名称',
        key: 'contractName'
      },
      {
        title: '客户名称',
        key: 'custName'
      },
      {
        title: '付款阶段(里程碑)',
        key: 'paymentPhrases'
      },
      {
        title: '付款条款',
        key: 'paymentName'
      },
      {
        title: '应收日期',
        key: 'arDate'
      },
      {
        title: '报告日期',
        key: 'reportDate'
      },
      {
        title: '付款百分比',
        key: 'paymentPercent'
      },
      {
        title: '提示',
        key: 'reminder'
      },
    ];
    this.columns = columns.map(o=>({
      ...o,
      className:'tHeader',
      dataIndex: o.key,
      width: 120,
    }))
  }

  doSearch = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.Search(values)
    });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const columns = this.columns;
    const {pageNo, pageSize, count, result} = this.props;

    const layout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    }

    return (
      <div className="billedARApprove">
        <Form onSubmit={this.doSearch}>
          <Row>
            <Col span={8}>
              <FormItem label="GL日期" {...layout}>
                {
                  getFieldDecorator('glDate')(<RangePicker/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="客户名称" {...layout}>
                {
                  getFieldDecorator('custId')(<SelectCustomer/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="项目编码(多)" {...layout}>
                {
                  getFieldDecorator('projectNos')(
                    <MultipleInput placeholder="多项目编码使用英文逗号间隔" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="GL日期(多)" {...layout}>
                {
                  getFieldDecorator('glDates')(<MultipleDayInput />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="签约公司" {...layout}>
                {
                  getFieldDecorator('companyId')(<SelectContractCompany />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="合同编码(多)" {...layout}>
                {
                  getFieldDecorator('contractNos')(
                    <MultipleInput placeholder="多合同编码使用英文逗号间隔" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">查询</Button>
            </Col>
          </Row>
        </Form>
        <br/>
        <Row>
          <Col span={24}>
            <Button style={{marginRight: '20px'}}>拒绝</Button>
            <Button type="primary">确认</Button>
          </Col>
        </Row>
        <br/>
        <Table 
          bordered
          rowSelection={{onChange: ()=>{}}}
          columns={columns} 
          dataSource={result}
          pagination={{
            showSizeChanger: true,
            onShowSizeChange: ()=>{},
            showTotal: t=>`共${t}条`,
            onChange: ()=>{},
            total: count
          }}
          scroll={{ x: 2462}}></Table>
      </div>
    )
  }
}

export default Form.create()(Approve)
