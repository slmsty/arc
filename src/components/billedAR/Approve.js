import React, {Component} from 'react'
import {Form, Row, Col, DatePicker, Input, Button, Table, Modal} from 'antd';
import MultipleInput from '../common/multipleInput'
import MultipleDayInput from '../common/multipleDayInput'
import SelectInvokeApi from '../common/selectInvokeApi'
import currency from '../../util/currency'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD'

class Approve extends Component{
  state = {
    rowKeys: [],
    rows: [],
    rejectDis: true,
    confirmDis: true,
    tableHeight: '',
  }

  constructor(props){
    super(props);
    this.columns = [
      {
        title: '数据状态',
        fixed: 'left',
        dataIndex: 'statusName',
        width: 120
      },
      {
        title: '签约公司',
        dataIndex: 'companyShow',
        width: 300
      },
      {
        title: '付款条件',
        dataIndex: 'paymentTerm',
        width: 120
      },
      {
        title: '合同内部编码',
        dataIndex: 'contractId',
        width: 120,
      },
      {
        title: '付款金额',
        dataIndex: 'paymentAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 120
      },
      {
        title: '节点',
        dataIndex: 'projectNode',
        width: 120,
      },
      {
        title: '付款阶段(里程碑)',
        dataIndex: 'paymentPhrases',
        width: 200,
      },
      {
        title: '付款条款',
        dataIndex: 'paymentName',
        width: 120
      },
      {
        title: '款项状态',
        dataIndex: 'paymentStatus',
        width: 120
      },
      {
        title: '付款百分比',
        dataIndex: 'paymentPercent',
        width: 100
      },
      {
        title: '应收日期',
        dataIndex: 'arDate',
        width: 120
      },
      {
        title: 'GL日期',
        dataIndex: 'arGlDate',
        width: 120
      },
      {
        title: '报告日期',
        dataIndex: 'reportDate',
        width: 120
      },
      {
        title: '应收金额',
        dataIndex: 'arAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '考核含税金额',
        dataIndex: 'assessTaxIncludedAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: <span>Billed AR金额<em style={{color:'#FF0000'}}>*</em></span>,
        dataIndex: 'billedArAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '款项ID',
        dataIndex: 'fundId',
        width: 120
      },
      {
        title: '客户名称',
        dataIndex: 'custName',
        width: 200,
      },
      {
        title: '合同名称',
        dataIndex: 'contractName',
        width: 400,
      },
      {
        title: '合同编码',
        dataIndex: 'contractNo',
        width: 300
      },
      {
        title: '合同币种',
        dataIndex: 'contractCurrency',
        width: 80
      },
      {
        title: '合同金额',
        dataIndex: 'contractAmount',
        width: 120,
        render: (text, rocord, index) => (text ? currency(text) : currency(0))
      },
      {
        title: '提示',
        dataIndex: 'reminder',
        width: 300
      },
    ];
  }

  doSearch = (e)=>{
    //e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        rowKeys: [],
        rows: [],
        rejectDis: true,
        confirmDis: true
      })
      this.props.Search({
        ...values,
      })
    });
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div168-按钮56-翻页160
    const tableHeight = screenHeight - 8 - 12 - 24 - 126 - 56 - 28 - 24 - 160
    this.setState({ tableHeight })
  }
  rowSelectionChange = (selectedRowKeys, selectedRows)=>{
    let rowKeys = this.state.rowKeys
    let rows = this.state.rows
    selectedRowKeys.forEach(key=>{
      if(!rowKeys.includes(key)){
        rows.push(selectedRows.find(o=>o.contractItemId===key))
      }
    })
    rows = rows.filter(o=>selectedRowKeys.includes(o.contractItemId))
    rowKeys = selectedRowKeys

    this.setState({
      rowKeys: rowKeys,
      rows: rows,
      rejectDis: !(rows.length>0 && rows.every(o=>o.status==='NEW'||o.status==='ACCOUNT_CONFIRMING'||o.status==='PA_PUSHING')),
      confirmDis: !(rows.length>0 && rows.every(o=>o.status==='NEW'))
    })
  }

  reject = ()=>{
    this.props.Reject(this.state.rowKeys)
    this.setState({
      rowKeys: [],
      rows: [],
      rejectDis: true,
      confirmDis: true
    })
  }

  confirm = ()=>{
    this.props.Confirm(this.state.rowKeys)
    this.setState({
      rowKeys: [],
      rows: [],
      rejectDis: true,
      confirmDis: true
    })
  }

  shouldComponentUpdate({title}, nextState){
    if(title){
      Modal.info({title})
      this.props.ResetTitle()
      return false;
    }else{
      return true;
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const columns = this.columns;
    const {result, loading} = this.props;

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
        <Form>
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
                  getFieldDecorator('custName')(<Input placeholder="客户名称"/>)
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
                  getFieldDecorator('companyName')(<Input placeholder="签约公司" />)
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
            <Col span={8}>
              <FormItem label="付款条款" {...layout}>
                {
                  getFieldDecorator('paymentName', {initialValue: ''})(
                    <Input placeholer="付款条款"/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="款项ID" {...layout}>
                {
                  getFieldDecorator('fundId')(<Input
                    placeholder="款项ID"
                  />)
                }
              </FormItem>
            </Col>
            <Col span={8} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit" onClick={this.doSearch}>查询</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col span={24}>
            <Button onClick={this.reject} style={{marginRight: '20px'}} disabled={this.state.rejectDis}>拒绝</Button>
            <Button onClick={this.confirm} type="primary" disabled={this.state.confirmDis}>确认</Button>
          </Col>
        </Row>
        <br/>
        <Table
          size="small"
          style={{backgroundColor: '#FFFFFF'}}
          rowKey="contractItemId"
          bordered
          loading={loading}
          rowSelection={{
            selectedRowKeys: this.state.rowKeys,
            onChange: this.rowSelectionChange,
          }}
          columns={columns}
          dataSource={result}
          pagination={false}
          scroll={{ x: 3662, y: this.state.tableHeight }}
        />
      </div>
    )
  }
}

export default Form.create()(Approve)
