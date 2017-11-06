import React, {Component} from 'react'
import './Status.css'
import {Form, Row, Col, DatePicker, Input, Button, Select, Table, Modal, message} from 'antd';
import SelectCustomer from '../common/selectCustomer'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class Status extends Component{
  state = {
    visible: false,
    selectedRowKeys: [],
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
      count: 1300,
      result: [
        {
          key: 0,
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
          key21: 'test',
        },
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
          key21: 'test',
        }
      ]
    },
    returnPageInfo: {
      pageNo: 1,
      pageSize: 10,
      count: 1300,
      result: [
        {
          key: 0,
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
        },
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
    },
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
        title: 'GL已提坏账金额',
        key: 'key2'
      },
      {
        title: 'Billed AR余额',
        key: 'key3'
      },
      {
        title: <span>划销金额<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'key4'
      },
      {
        title: '已划销金额',
        key: 'key5'
      },
      {
        title: '已划销退回金额',
        key: 'key6'
      },
      {
        title: '项目编码',
        key: 'key7'
      },
      {
        title: '项目名称',
        key: 'key8'
      },
      {
        title: '签约公司',
        key: 'key9'
      },
      {
        title: '签约日期',
        key: 'key10'
      },
      {
        title: '合同编码',
        key: 'key11'
      },
      {
        title: '客户名称',
        key: 'key12'
      },
      {
        title: '币种',
        key: 'key13'
      },
      {
        title: '部门',
        key: 'key14'
      },
      {
        title: 'SBU',
        key: 'key15'
      },
      {
        title: '应收/报告日期',
        key: 'key16'
      },
      {
        title: '合同金额',
        key: 'key17'
      },
      {
        title: 'Billed AR日期',
        key: 'key18'
      },
      {
        title: 'GL日期',
        key: 'key19'
      },
      {
        title: 'Billed AR金额',
        key: 'key20'
      },
      {
        title: '回款金额',
        key: 'key21'
      },
    ];
    this.columns = columns.map(o=>({
      ...o,
      className:'tHeader',
      dataIndex: o.key,
      width: 140,
    }))
    const returnColumns = [
      {
        title: 'GL已提坏账金额',
        key: 'key1'
      },
      {
        title: 'Billed AR余额',
        key: 'key2'
      },
      {
        title: '坏账划销金额',
        key: 'key3'
      },
      {
        title: '已划销退回金额',
        key: 'key4'
      },
      {
        title: <span>划销退回金额<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'key5'
      },
      {
        title: 'Billed AR金额',
        key: 'key6'
      },
      {
        title: '回款金额',
        key: 'key7'
      },
      {
        title: '项目编码',
        key: 'key8'
      },
      {
        title: '项目名称',
        key: 'key9'
      },
      {
        title: '签约公司',
        key: 'key10'
      },
      {
        title: '签约日期',
        key: 'key11'
      },
      {
        title: '合同编码',
        key: 'key12'
      },
      {
        title: '客户名称',
        key: 'key13'
      },
      {
        title: '币种',
        key: 'key14'
      },
      {
        title: '部门',
        key: 'key15'
      },
      {
        title: 'SBU',
        key: 'key16'
      },
      {
        title: '应收/报告日期',
        key: 'key17'
      },
      {
        title: '合同金额',
        key: 'key18'
      },
      {
        title: 'Billed AR日期',
        key: 'key19'
      },
      {
        title: 'GL日期',
        key: 'key20'
      },
    ];
    this.returnColumns = returnColumns.map(o=>({
      ...o,
      className:'tHeader',
      dataIndex: o.key,
      width: 140,
    }))
  }

  SelectChange = (selectedRowKeys)=>{
    this.setState({selectedRowKeys})
  }

  doSearch = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
    });
  }

  doReturn = ()=>{
    if(this.state.selectedRowKeys.length === 0){
      message.warning('请选择退回项')
    }else if(this.state.selectedRowKeys.length > 1){
      message.warning('只能退回一项')
    }else{
      this.setState({visible: true})
    }
  }

  Cancel = ()=>{
    this.setState({visible: false})
  }

  Ok = ()=>{
    this.setState({visible: false})
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const columns = this.columns;
    const returnColumns = this.returnColumns;
    const pageInfo = this.state.pageInfo;
    const returnPageInfo = this.state.returnPageInfo;

    return (
      <div className="badDebtsStatus">
        <Form onSubmit={this.doSearch}>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem label="签约日期" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('signStartEnd')(<RangePicker/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="客户名称" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('customerId')(<SelectCustomer/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="项目编码(多)" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('projectCode')(<Input placeholder="多编码间用英文逗号间隔"/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem label="签约日期(多)" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('signDate')(<DatePicker />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="数据状态" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('status', {initialValue: '1'})(
                    <Select>
                      <Option value="1">审核中</Option>
                      <Option value="2">已审核</Option>
                      <Option value="3">已划销</Option>
                      <Option value="4">已划销退回</Option>
                      <Option value="5">错误</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="合同编码(多)" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('contactCode')(<Input placeholder="多编码间用英文逗号间隔"/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem label="付款阶段(里程碑)" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('stage')(<Input />)
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
            <Button onClick={this.doReturn} style={{marginRight: '20px'}}>划销退回</Button>
            <Button onClick={()=>{}}>传送ERP</Button>
          </Col>
        </Row>
        <br/>
        <Table 
          rowSelection={{onChange: this.SelectChange}}
          columns={columns} 
          dataSource={pageInfo.result}
          pagination={{
            showSizeChanger: true,
            onShowSizeChange: ()=>{},
            showTotal: t=>`共${t}条`,
            onChange: ()=>{},
            total: pageInfo.count
          }}
          scroll={{ x: 3002}} />
        <Modal
          title="划销退回"
          visible={this.state.visible}
          onCancel={this.Cancel}
          onOk={this.Ok}>
          <Table 
            rowSelection={{onChange: ()=>{}}}
            columns={returnColumns} 
            dataSource={returnPageInfo.result}
            pagination={{
              simple: true,
              pageSize: returnPageInfo.pageSize,
              onChange: ()=>{},
            }}
            scroll={{ x: 2862}} />
        </Modal>
      </div>
    )
  }
}

export default Form.create()(Status)
