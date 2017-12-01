import React, {Component} from 'react'
import {Form, Row, Col, DatePicker, Button, Table, Modal} from 'antd';
import moment from 'moment'
import SelectCustomer from '../common/selectCustomer'
import SelectSbu from '../common/SelectSbu'
import SelectDept from '../common/SelectDept'
import MultipleInput from '../common/multipleInput'
import MultipleDayInput from '../common/multipleDayInput'
import SelectInvokeApi from '../common/selectInvokeApi'
import BDModal2 from './BDModal2'
import GlModal from './GlModal'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class Status extends Component{
  state = {
    returnDis: true,
    erpDis: true,
    visible: false,
    result: [],
    editDis: true,
    erp2Dis: true,
    selectedRowKeys2: [],
    isEdit: false,
    isGLEdit: false,
    o: {}
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
        title: 'GL已提坏账金额',
        key: 'badDebtProvisionAmount'
      },
      {
        title: 'Billed AR余额',
        key: 'billedArBalance'
      },
      {
        title: <span>划销金额<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'badDebtAmount'
      },
      {
        title: <span>申请日期<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'applicationDate'
      },
      {
        title: '备注',
        key: 'badDebtBackRemark'
      },
      {
        title: '已划销金额',
        key: 'badDebtDeductedAmount'
      },
      {
        title: '已划销退回金额',
        key: 'badDebtReturnAmount'
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
        title: '客户名称',
        key: 'custName'
      },
      {
        title: '币种',
        key: 'contractCurrency'
      },
      {
        title: '部门',
        key: 'deptName'
      },
      {
        title: 'SBU',
        key: 'sbuName'
      },
      {
        title: '合同金额',
        key: 'contractAmount'
      },
      {
        title: 'Billed AR日期',
        key: 'billedArDate'
      },
      {
        title: 'GL日期',
        key: 'glDate'
      },
      {
        title: 'Billed AR金额',
        key: 'billedArAmount'
      },
      {
        title: '回款金额',
        key: 'receiptAmount'
      },
    ];
    this.columns = columns.map(o=>({
      ...o,
      dataIndex: o.key,
      width: 140,
    }))
    const columns2 = [
      {
        title: 'GL已提坏账金额',
        key: 'badDebtProvisionAmount'
      },
      {
        title: 'Billed AR余额',
        key: 'billedArBalance'
      },
      {
        title: '坏账划销金额',
        key: 'badDebtAmount'
      },
      {
        title: '已划销退回金额',
        key: 'badDebtReturnAmount'
      },
      {
        title: <span>划销退回金额<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'badDebtBackAmount'
      },
      {
        title: <span>GL日期<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'glDate'
      },
      {
        title: '备注',
        key: 'badDebtBackRemark'
      },
      {
        title: 'Billed AR金额',
        key: 'billedArAmount'
      },
      {
        title: '回款金额',
        key: 'receiptAmount'
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
        title: '客户名称',
        key: 'custName'
      },
      {
        title: '币种',
        key: 'contractCurrency'
      },
      {
        title: '部门',
        key: 'deptName'
      },
      {
        title: 'SBU',
        key: 'sbuName'
      },
      {
        title: '合同金额',
        key: 'contractAmount'
      },
      {
        title: 'Billed AR日期',
        key: 'billedArDate'
      },
    ];
    this.columns2 = columns2.map(o=>({
      ...o,
      dataIndex: o.key,
      width: 140,
    }))
  }

  doSearch = (e)=>{
    if(e){
      e.preventDefault();
    }
    this.props.form.validateFields((err, values) => {
      this.props.Search({
        pageInfo: {
          pageNo: 1,
          pageSize: this.props.pageSize
        },
        ...values
      })
    });
  }

  pageSizeChange = (current, size)=>{
    this.props.form.validateFields((err, values) => {
      this.props.Search({
        pageInfo: {
          pageNo: 1,
          pageSize: size
        },
        ...values
      })
    });
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
    this.setState({
      selectedRowKeys: selectedRowKeys,
      returnDis: !(selectedRows.length>0 && selectedRows.every(o=>o.status==='20')),
      erpDis: !(selectedRows.length>0 && selectedRows.every(o=>o.status==='12'||o.status==='22'))
    })
  }

  rowSelectionChange2 = (selectedRowKeys, selectedRows)=>{
    this.setState({
      selectedRowKeys2: selectedRowKeys,
      editDis: selectedRows.length!==1,
      erp2Dis: !(selectedRows.length>0)
    })
  }

  bdReturn = ()=>{
    this.setState({
      visible: true,
      result: this.props.result.filter(o=>this.state.selectedRowKeys.includes(o.badDebtId))
    })
  }

  close = ()=>{
    this.setState({
      visible: false
    })
    this.doSearch();
  }

  sendErp = ()=>{
    this.setState({isGLEdit: true})
  }

  hideGlEdit = ()=>{
    this.setState({isGLEdit: false})
  }

  postGLEdit = glDate=>{
    this.props.SendErp(this.state.selectedRowKeys, glDate)

    this.setState({
      isGLEdit: false,
      selectedRowKeys: [],
      returnDis: true,
      erpDis: true
    })
  }

  sendErp2 = ()=>{
    this.props.SendErp2(this.state.selectedRowKeys2)
    this.setState({
      selectedRowKeys2: [],
      editDis: true,
      erp2Dis: true
    })
  }

  doEdit = ()=>{
    this.setState({
      isEdit: true,
      o: this.state.result.find(o=>o.badDebtId===this.state.selectedRowKeys2[0])
    })
  }

  editCancel = ()=>{
    this.setState({isEdit: false})
  }

  editDone = (values)=>{
    this.setState({
      isEdit: false,
      result: this.state.result.map(o=>{
        if(o.badDebtId === this.state.o.badDebtId){
          return {
            ...this.state.o,
            ...values
          }
        }else{
          return o;
        }
      })
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
    const columns2 = this.columns2;
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
      <div className="badDebtsStatus">
        <Form onSubmit={this.doSearch}>
          <Row>
            <Col span={8}>
              <FormItem label="申请日期" {...layout}>
                {
                  getFieldDecorator('applicationDate', {
                    initialValue: [moment().add(-2, 'days'), moment().add(-2, 'days')]
                  })(<RangePicker/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="客户名称" {...layout}>
                {
                  getFieldDecorator('custInfo')(<SelectCustomer/>)
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
              <FormItem label="申请日期(多)" {...layout}>
                {
                  getFieldDecorator('applicationDates')(<MultipleDayInput />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="数据状态" {...layout}>
                {
                  getFieldDecorator('status', {initialValue: '12'})(<SelectInvokeApi
                    typeCode="BAD_DEBT_STATUS"
                    paramCode="STATUS"
                    placeholder="数据状态"
                  />)
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
              <FormItem label="SBU" {...layout}>
                {
                  getFieldDecorator('sbuInfo')(<SelectSbu/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="部门" {...layout}>
                {
                  getFieldDecorator('orgInfo')(<SelectDept/>)
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
            <Button onClick={this.bdReturn} style={{marginRight: '20px'}} disabled={this.state.returnDis}>划销退回</Button>
            <Button onClick={this.sendErp} type="primary" disabled={this.state.erpDis}>传送ERP</Button>
          </Col>
        </Row>
        <br/>
        <Table 
          rowKey="badDebtId"
          bordered
          loading={loading}
          rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys,
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
          scroll={{ x: 2862}}></Table>
        <GlModal
          visible={this.state.isGLEdit}
          onCancel={this.hideGlEdit}
          onOk={this.postGLEdit}
           />
        <Modal 
          width={1080}
          title="划销退回" 
          visible={this.state.visible}
          onCancel={this.close}
          footer={[
            <Button key="close" onClick={this.close}>关闭</Button>
          ]}>
          <Row>
            <Col span={24}>
              <Button onClick={this.doEdit} style={{marginRight: '20px'}} disabled={this.state.editDis}>编辑</Button>
              <Button onClick={this.sendErp2} type="primary" disabled={this.state.erp2Dis}>传送ERP</Button>
            </Col>
          </Row>
          <br/>
          <Table 
            rowKey="badDebtId"
            bordered
            rowSelection={{
              selectedRowKeys: this.state.selectedRowKeys2,
              onChange: this.rowSelectionChange2
            }}
            columns={columns2} 
            dataSource={this.state.result}
            scroll={{ x: 2582}}></Table>
        </Modal>
        <BDModal2 
          visible={this.state.isEdit}
          onCancel={this.editCancel}
          onOk={this.editDone}
          o={this.state.o}
         />
      </div>
    )
  }
}

export default Form.create()(Status)
