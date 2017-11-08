import React, {Component} from 'react'
import {Form, Row, Col, DatePicker, Input, Button, Select, Table, message} from 'antd';
import SelectCustomer from '../common/selectCustomer'
import SelectContractCompany from '../common/SelectContractCompany'
import ARModal from './ARModal'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class Confirm extends Component{
  state = {
    visible: false,
    editObj: {},
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
          key6: '',
          key7: '',
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
          key22: 'test',
          key23: 'test',
          key24: 'test',
        },
        {
          key: 1,
          key1: 'test',
          key2: 'test',
          key3: 'test',
          key4: 'test',
          key5: 'test',
          key6: '',
          key7: '',
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
          key22: 'test',
          key23: 'test',
          key24: 'test',
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
        title: <span>Billed AR日期<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'key6'
      },
      {
        title: <span>GL日期<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'key7'
      },
      {
        title: '备注',
        key: 'key8'
      },
      {
        title: '款项ID',
        key: 'key9'
      },
      {
        title: '合同币种',
        key: 'key10'
      },
      {
        title: '合同金额',
        key: 'key11'
      },
      {
        title: '项目编码',
        key: 'key12'
      },
      {
        title: '项目名称',
        key: 'key13'
      },
      {
        title: '签约公司',
        key: 'key14'
      },
      {
        title: '合同编码',
        key: 'key15'
      },
      {
        title: '合同名称',
        key: 'key16'
      },
      {
        title: '客户名称',
        key: 'key17'
      },
      {
        title: '付款阶段(里程碑)',
        key: 'key18'
      },
      {
        title: '付款条款',
        key: 'key19'
      },
      {
        title: '应收日期',
        key: 'key20'
      },
      {
        title: '报告日期',
        key: 'key21'
      },
      {
        title: '付款百分比',
        key: 'key22'
      },
      {
        title: '收入额',
        key: 'key23'
      },
      {
        title: '提示',
        key: 'key24'
      },
    ];
    this.columns = columns.map(o=>({
      ...o,
      className:'tHeader',
      dataIndex: o.key,
      width: 120,
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

  doEdit = ()=>{
    if(this.state.selectedRowKeys.length === 0){
      message.warning('请选择编辑项')
    }else if(this.state.selectedRowKeys.length > 1){
      message.warning('只能编辑一项')
    }else{
      this.setState({
        visible: true,
        editObj: {...this.state.pageInfo.result[this.state.selectedRowKeys[0]]},
      })
    }
  }

  Cancel = ()=>{
    this.setState({
      visible: false,
      editObj: {},
    })
  }

  OK = ({key6, key7, key8})=>{
    this.setState({
      visible: false,
      editObj: {},
      pageInfo: {
        ...this.state.pageInfo,
        result: this.state.pageInfo.result.map((o, i)=>{
          if(i === this.state.selectedRowKeys[0]){
            return {
              ...o,
              key6,
              key7,
              key8
            }
          }else{
            return o;
          }
        })
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const columns = this.columns;
    const pageInfo = this.state.pageInfo;

    return (
      <div className="billedARConfirm">
        <Form onSubmit={this.doSearch}>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem label="Billed AR日期" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('BilledARStartEnd')(<RangePicker/>)
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
                  getFieldDecorator('companyId')(<SelectContractCompany />)
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
          <Row gutter={40}>
            <Col span={8}>
              <FormItem label="付款条件" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('pay', {initialValue: '1'})(
                    <Select>
                      <Option value="1">按时间</Option>
                      <Option value="2">按进度</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="数据状态" labelCol={{span: 5}} wrapperCol={{span: 19}}>
                {
                  getFieldDecorator('status', {initialValue: '1'})(
                    <Select>
                      <Option value="1">待应收会计确认</Option>
                      <Option value="2">无需确认</Option>
                      <Option value="3">待传送PA</Option>
                      <Option value="4">已传送PA</Option>
                      <Option value="5">错误</Option>
                    </Select>
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
            <Button onClick={this.doEdit} style={{marginRight: '20px'}}>编辑</Button>
            <Button style={{marginRight: '20px'}}>拒绝</Button>
            <Button style={{marginRight: '20px'}}>审批</Button>
            <Button>传送PA</Button>
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
          scroll={{ x: 2942}} />
        <ARModal 
          visible={this.state.visible}
          onCancel={this.Cancel}
          onOk={this.OK}
          key6={this.state.editObj.key6}
          key7={this.state.editObj.key7}
          key8={this.state.editObj.key8}
           />
      </div>
    )
  }
}

export default Form.create()(Confirm)
