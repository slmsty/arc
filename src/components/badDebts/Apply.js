import React, {Component} from 'react'
import './Apply.css'
import {Form, Row, Col, DatePicker, Input, Button, Select, Table} from 'antd';
import SelectCustomer from '../common/selectCustomer'
import MultipleInput from '../common/multipleInput'
import MultipleDayInput from '../common/multipleDayInput'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class Apply extends Component{
  state = {
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
        title: 'GL已提坏账准备金额',
        key: 'key2'
      },
      {
        title: 'Billed AR余额',
        key: 'key3'
      },
      {
        title: <span>坏账划销金额<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'key4'
      },
      {
        title: '币种',
        key: 'key5'
      },
      {
        title: '合同金额',
        key: 'key6'
      },
      {
        title: 'Billed AR日期',
        key: 'key7'
      },
      {
        title: 'Billed AR金额',
        key: 'key8'
      },
      {
        title: '回款金额',
        key: 'key9'
      },
      {
        title: '项目编码',
        key: 'key10'
      },
      {
        title: '项目名称',
        key: 'key11'
      },
      {
        title: '部门',
        key: 'key12'
      },
      {
        title: 'SBU',
        key: 'key13'
      },
      {
        title: '签约公司',
        key: 'key14'
      },
      {
        title: '签约日期',
        key: 'key15'
      },
      {
        title: '客户名称',
        key: 'key16'
      },
      {
        title: '应收/报告日',
        key: 'key17'
      },
    ];
    this.columns = columns.map(o=>({
      ...o,
      className:'tHeader',
      dataIndex: o.key,
      width: 140,
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

    const layout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    }

    return (
      <div className="badDebtsApply">
        <Form onSubmit={this.doSearch}>
          <Row>
            <Col span={8}>
              <FormItem label="签约日期" {...layout}>
                {
                  getFieldDecorator('signStartEnd')(<RangePicker/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="客户名称" {...layout}>
                {
                  getFieldDecorator('customerId')(<SelectCustomer/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="项目编码(多)" {...layout}>
                {
                  getFieldDecorator('projectCode')(
                    <MultipleInput placeholder="多项目编码使用英文逗号间隔" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="签约日期(多)" {...layout}>
                {
                  getFieldDecorator('signDate')(<MultipleDayInput />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="数据状态" {...layout}>
                {
                  getFieldDecorator('status', {initialValue: ''})(
                    <Select>
                      <Option value="">--请选择--</Option>
                      <Option value="1">新建</Option>
                      <Option value="2">审批退回</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="合同编码(多)" {...layout}>
                {
                  getFieldDecorator('contactCode')(
                    <MultipleInput placeholder="多合同编码使用英文逗号间隔" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label="付款阶段(里程碑)" {...layout}>
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
            <Button onClick={()=>{}}>申请</Button>
          </Col>
        </Row>
        <br/>
        <Table 
          bordered
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
          scroll={{ x: 2442}} />
      </div>
    )
  }
}

export default Form.create()(Apply)
