import React, {Component} from 'react'
import './Approve.css'
import {Form, Row, Col, DatePicker, Input, Button, Table} from 'antd';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Search = Input.Search;

class Approve extends Component{
  state = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
      count: 1300,
      result: [
        {
          key: 1,
          key1: 'test',
          key2: 'test',
          key3: 'test',
          key4: 'test',
          key5: 'test',
          key6: 'test',
          key7: 'test',
          key8: 'test',
          key9: 'test',
          key10: 'test',
          key11: 'test',
          key12: 'test',
          key13: 'test',
          key14: 'test',
          key15: 'test',
          key16: 'test',
          key17: 'test',
          key18: 'test',
          key19: 'test',
          key20: 'test',
        }
      ]
    }
  }

  constructor(props){
    super(props);
    const columns = [
      {
        title: '数据状态',
        fixed: 'left',
        key: 'key1'
      },
      {
        title: '付款条件',
        key: 'key2'
      },
      {
        title: '付款金额',
        key: 'key3'
      },
      {
        title: '考核含税金额',
        key: 'key4'
      },
      {
        title: <span>Billed AR金额<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'key5'
      },
      {
        title: '款项ID',
        key: 'key6'
      },
      {
        title: '合同币种',
        key: 'key7'
      },
      {
        title: '合同金额',
        key: 'key8'
      },
      {
        title: '项目编码',
        key: 'key9'
      },
      {
        title: '项目名称',
        key: 'key10'
      },
      {
        title: '签约公司',
        key: 'key11'
      },
      {
        title: '合同编码',
        key: 'key12'
      },
      {
        title: '合同名称',
        key: 'key13'
      },
      {
        title: '客户名称',
        key: 'key14'
      },
      {
        title: '付款阶段(里程碑)',
        key: 'key15'
      },
      {
        title: '付款条款',
        key: 'key16'
      },
      {
        title: '应收日期',
        key: 'key17'
      },
      {
        title: '报告日期',
        key: 'key18'
      },
      {
        title: '付款百分比',
        key: 'key19'
      },
      {
        title: '提示',
        key: 'key20'
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
      console.log(values);
    });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const columns = this.columns;
    const pageInfo = this.state.pageInfo;

    return (
      <div className="billedARApprove">
        <Form onSubmit={this.doSearch}>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem label="GL日期" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('GLStartEnd')(<RangePicker/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="客户名称" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('customerName')(<Search placeholder="客户名称"/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="项目编码(多)" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('projectCode')(<Input placeholder="多项目编码使用英文逗号分隔"/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem label="GL日期(多)" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('GLDate')(<DatePicker />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="签约公司" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('company')(<Search placeholder="签约公司"/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="合同编码(多)" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('contactCode')(<Input placeholder="多合同编码使用英文逗号分隔"/>)
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
          rowSelection={{onChange: ()=>{}}}
          columns={columns} 
          dataSource={pageInfo.result}
          pagination={{
            showSizeChanger: true,
            onShowSizeChange: ()=>{},
            showTotal: t=>`共${t}条`,
            onChange: ()=>{},
            total: pageInfo.count
          }}
          scroll={{ x: 2462}}></Table>
      </div>
    )
  }
}

export default Form.create()(Approve)
