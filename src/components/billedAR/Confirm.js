import React, {Component} from 'react'
import {Form, Row, Col, DatePicker, Input, Button, Table, Modal} from 'antd';
import MultipleInput from '../common/multipleInput'
import MultipleDayInput from '../common/multipleDayInput'
import SelectInvokeApi from '../common/selectInvokeApi'
import ARModal from './ARModal'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class Confirm extends Component{
  state = {
    visible: false,
    o: {},
    rowKeys: [],
    rows: [],
    editDis: true,
    rejectDis: true,
    approvalDis: true,
    sendDis: true
  }

  constructor(props){
    super(props);
    const columns = [
      {
        title: '数据状态',
        fixed: 'left',
        key: 'statusName'
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
        title: <span>Billed AR日期<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'billedArDate'
      },
      {
        title: <span>GL日期<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'glDate'
      },
      {
        title: '备注',
        key: 'arAccountantApproveMessage'
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
        title: '签约公司',
        key: 'companyShow'
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
        key: 'reportingdate'
      },
      {
        title: '付款百分比',
        key: 'paymentPercent'
      },
      {
        title: '收入额',
        key: 'revenueAmount'
      },
      {
        title: '提示',
        key: 'reminder'
      },
    ];
    this.columns = columns.map(o=>({
      ...o,
      dataIndex: o.key,
      width: 120,
    }))
  }

  doSearch = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        rowKeys: [],
        rows: [],
        editDis: true,
        rejectDis: true,
        approvalDis: true,
        sendDis: true
      })
      this.props.Search({
        pageInfo: {
          pageNo: 1,
          pageSize: this.props.pageSize
        },
        ...values
      })
    })
  }

  pageSizeChange = (current, size)=>{
    this.props.form.validateFields((err, values) => {
      this.setState({
        rowKeys: [],
        rows: [],
        editDis: true,
        rejectDis: true,
        approvalDis: true,
        sendDis: true
      })
      this.props.Search({
        pageInfo: {
          pageNo: 1,
          pageSize: size
        },
        ...values
      })
    })
  }

  pageNoChange = (page, pageSize)=>{
    this.props.form.validateFields((err, values) => {
      this.props.Search({
        pageInfo: {
          pageNo: page,
          pageSize: pageSize
        },
        ...values
      })
    });
  }

  rowSelectionChange = (selectedRowKeys, selectedRows)=>{
    let rowKeys = this.state.rowKeys
    let rows = this.state.rows
    selectedRowKeys.forEach(key=>{
      if(!rowKeys.includes(key)){
        rows.push(selectedRows.find(o=>o.billedArId===key))
      }
    })
    rows = rows.filter(o=>selectedRowKeys.includes(o.billedArId))
    rowKeys = selectedRowKeys

    this.setState({
      rowKeys: rowKeys,
      rows: rows,
      editDis: !(rows.length===1 && rows.every(o=>o.status==='10'||o.status==='20'||o.status==='21'||o.status==='30'||o.status==='32')),
      rejectDis: !(rows.length>0 && rows.every(o=>o.status==='20'||o.status==='30')),
      approvalDis: !(rows.length>0 && rows.every(o=>o.status==='20')),
      sendDis: !(rows.length>0 && rows.every(o=>o.status==='30' || o.status==='32')),
    })
  }

  doEdit = ()=>{
    this.setState({
      visible: true,
      o: this.state.rows[0]
    })
  }

  Cancel = ()=>{
    this.setState({visible: false})
  }

  OK = ()=>{
    this.props.form.validateFields((err, values) => {
      this.props.Search({
        pageInfo: {
          pageNo: this.props.pageNo,
          pageSize: this.props.pageSize
        },
        ...values
      })
    })

    this.setState({
      visible: false,
      rowKeys: [],
      rows: [],
      editDis: true,
      rejectDis: true,
      approvalDis: true,
      sendDis: true
    })
  }

  reject = ()=>{
    this.props.Reject(this.state.rowKeys)
    this.setState({
      rowKeys: [],
      rows: [],
      editDis: true,
      rejectDis: true,
      approvalDis: true,
      sendDis: true
    })
  }

  approval = ()=>{
    this.props.Approval(this.state.rowKeys)
    this.setState({
      rowKeys: [],
      rows: [],
      editDis: true,
      rejectDis: true,
      approvalDis: true,
      sendDis: true
    })
  }

  send = ()=>{
    this.props.Send(this.state.rowKeys)
    this.setState({
      rowKeys: [],
      rows: [],
      editDis: true,
      rejectDis: true,
      approvalDis: true,
      sendDis: true
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
    const {pageNo, pageSize, count, result, loading} = this.props;

    const layout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    }

    return (
      <div className="billedARConfirm">
        <Form onSubmit={this.doSearch}>
          <Row>
            <Col span={8}>
              <FormItem label="Billed AR日期" {...layout}>
                {
                  getFieldDecorator('billedArDate')(<RangePicker/>)
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
              <FormItem label="付款条件" {...layout}>
                {
                  getFieldDecorator('paymentTerm', {initialValue: ''})(<SelectInvokeApi
                    typeCode="BILLED_AR"
                    paramCode="PAYMENT_TERM"
                    placeholder="付款条件"
                    hasEmpty
                  />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="数据状态" {...layout}>
                {
                  getFieldDecorator('status', {initialValue: '20'})(<SelectInvokeApi
                    typeCode="BILLED_AR"
                    paramCode="STATUS"
                    placeholder="数据状态"
                    hasEmpty
                  />)
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
            <Button onClick={this.doEdit} style={{marginRight: '20px'}} disabled={this.state.editDis}>编辑</Button>
            <Button onClick={this.reject} style={{marginRight: '20px'}} disabled={this.state.rejectDis}>拒绝</Button>
            <Button onClick={this.approval} style={{marginRight: '20px'}} disabled={this.state.approvalDis}>审批</Button>
            <Button onClick={this.send} disabled={this.state.sendDis}>传送PA</Button>
          </Col>
        </Row>
        <br/>
        <Table 
          style={{backgroundColor: '#FFFFFF'}}
          rowKey="billedArId"
          bordered
          loading={loading}
          rowSelection={{
            selectedRowKeys: this.state.rowKeys,
            onChange: this.rowSelectionChange
          }}
          columns={columns} 
          dataSource={result}
          pagination={{
            pageSizeOptions: ['5', '10', '20', '30'],
            showSizeChanger: true,
            onShowSizeChange: this.pageSizeChange,
            showTotal: t=>`共${t}条`,
            onChange: this.pageNoChange,
            current: pageNo,
            pageSize: pageSize,
            total: count
          }}
          scroll={{ x: 2822}} />
          <ARModal 
            visible={this.state.visible}
            onCancel={this.Cancel}
            onOk={this.OK}
            o={this.state.o}
           />
      </div>
    )
  }
}

export default Form.create()(Confirm)
