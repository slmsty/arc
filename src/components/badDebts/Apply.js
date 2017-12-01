import React, {Component} from 'react'
import {Form, Row, Col, DatePicker, Button, Table, Modal, message} from 'antd';
import requestJsonFetch from '../../http/requestJsonFecth'
import moment from 'moment'
import SelectCustomer from '../common/selectCustomer'
import SelectSbu from '../common/SelectSbu'
import SelectDept from '../common/SelectDept'
import MultipleInput from '../common/multipleInput'
import MultipleDayInput from '../common/multipleDayInput'
import SelectInvokeApi from '../common/selectInvokeApi'
import BDModal from './BDModal'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class Apply extends Component{
  state = {
    visible: false,
    selectedRowKeys: [],
    selectedRows: [],
    selectedRowKeys2: [],
    selectedRows2: [],
    result: [],
    editDis: true,
    applyDis: true,
    isEdit: false,
    o: {},
  }

  constructor(props){
    super(props);
    const columns = [
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
        title: '客户名称',
        key: 'custName'
      },
      {
        title: '币种',
        key: 'contractCurrency'
      },
      {
        title: '付款阶段(里程碑)',
        key: 'paymentPhrases'
      },
      {
        title: '付款条件',
        key: 'paymentTerm'
      },
      {
        title: '应收日期',
        key: 'arDate'
      },
      {
        title: '报告日期',
        key: 'reportingDate'
      },
      {
        title: '回款条款',
        key: 'paymentName'
      },
      {
        title: '付款百分比',
        key: 'paymentPercent'
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
        key: 'erpGlDate'
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
        title: 'GL已提坏账金额',
        key: 'badDebtProvisionAmount'
      },
      {
        title: 'Billed AR余额',
        key: 'billedArBalance'
      },
    ];
    this.columns = columns.map(o=>({
      ...o,
      dataIndex: o.key,
      width: 140,
    }))
    const columns2 = [
      {
        title: '数据状态',
        fixed: 'left',
        key: 'statusName'
      },
      {
        title: 'GL已提坏账准备金额',
        key: 'badDebtProvisionAmount'
      },
      {
        title: 'Billed AR余额',
        key: 'billedArBalance'
      },
      {
        title: <span>坏账划销金额<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'badDebtAmount'
      },
      {
        title: <span>申请日期<em style={{color:'#FF0000'}}>*</em></span>,
        key: 'applicationDate'
      },
      {
        title: '备注',
        key: 'applicantRemark'
      },
      {
        title: '币种',
        key: 'contractCurrency'
      },
      {
        title: '合同金额',
        key: 'contractAmount '
      },
      {
        title: '应收日期',
        key: 'arDate'
      },
      {
        title: 'Billed AR日期',
        key: 'billedArDate'
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
        title: '付款条款',
        key: 'paymentName'
      },
      {
        title: '付款百分比',
        key: 'paymentPercent'
      },
      {
        title: '部门',
        key: 'deptName'
      },
      {
        title: '签约公司',
        key: 'companyName'
      },
      {
        title: '客户名称',
        key: 'custName'
      },
    ];
    this.columns2 = columns2.map(o=>({
      ...o,
      dataIndex: o.key,
      width: 140,
    }))
  }

  doSearch = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(err) return

      this.props.Search({
        pageInfo: {
          pageNo: 1,
          pageSize: this.props.pageSize
        },
        ...values
      })

      this.setState({
        visible: true,
        selectedRowKeys: [],
        selectedRows: [],
        selectedRowKeys2: [],
        selectedRows2: [],
        result: [],
        editDis: true,
        applyDis: true,
      })
    });
  }

  pageSizeChange = (current, size)=>{
    this.props.form.validateFields((err, values) => {
      if(err) return

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
      if(err) return

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
      selectedRows: selectedRows,
    })
  }

  rowSelectionChange2 = (selectedRowKeys, selectedRows)=>{
    this.setState({
      selectedRowKeys2: selectedRowKeys,
      selectedRows2: selectedRows,
      editDis: !(selectedRows.length===1 && selectedRows.every(o=>o.status==='10'||o.status==='13'||o.status===''||o.status===undefined)),
      applyDis: !(selectedRows.length>0 && selectedRows.every(o=>o.status==='10'))
    })
  }

  onCancel = ()=>{
    this.setState({visible: false})
  }

  onOk = ()=>{
    let result = this.state.result
    this.state.selectedRows.forEach(o=>{
      if(!result.some(oo=>oo.contractItemId===o.contractItemId)){
        result.push(o)
      }
    })

    this.setState({
      visible: false,
      result
    })
  }

  getAmount = (body, callback)=>{
    requestJsonFetch(
      '/arc/badDebt/apply/detail',
      {
        method: 'POST',
        body
      },
      callback
    )
  }

  doEdit = ()=>{
    let obj = this.state.selectedRows2[0]
    if(!obj.billedArAmount) return

    let body = {
      companyId: obj.companyId,
      projectNo: obj.projectNo,
      sbuNo: obj.sbuNo,
      deptNo: obj.deptNo,
      contractCurrency: obj.contractCurrency,
    }
    this.getAmount(body, response=>{
      if(response.resultCode === '000000'){
        this.setState({
          isEdit: true,
          o: {
            ...obj,
            badDebtProvisionAmount: response.data.badDebtProvisionAmount,
            custId: response.data.custId,
            erpGlDate: response.data.erpGlDate
          }
        })
      }else{
        message.error(response.resultMessage);
      }
    })
  }

  editCancel = ()=>{
    this.setState({isEdit: false})
  }

  editDone = (values)=>{
    this.setState({
      isEdit: false,
      selectedRowKeys2: [],
      selectedRows2: [],
      editDis: true,
      applyDis: true,
      result: this.state.result.map(o=>{
        if(o.contractItemId === this.state.o.contractItemId){
          return {
            ...this.state.o,
            status: '10',
            statusName: '新建',
            ...values
          }
        }else{
          return o;
        }
      })
    })
  }

  postApply = (badDebtIds, callback)=>{
    requestJsonFetch(
      '/arc/badDebt/apply',
      {
        method: 'POST',
        body: {badDebtIds}
      },
      callback
    )
  }

  apply = ()=>{
    let badDebtIds = this.state.selectedRows2.map(o=>o.badDebtId)
    this.postApply(badDebtIds, response=>{
      if(response.resultCode === '000000'){
        let result = this.state.result
        result = result.map(o=>{
          if(badDebtIds.includes(o.badDebtId)){
            return {
              ...o,
              status: '11',
              statusName: '审核中'
            }
          }else{
            return o
          }
        })

        Modal.success({title: '申请成功'})

        this.setState({
          selectedRowKeys2: [],
          selectedRows2: [],
          editDis: true,
          applyDis: true,
          result
        })
      }else{
        message.error(response.resultMessage);
      }
    })
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
      <div className="badDebtsApply">
        <Form onSubmit={this.doSearch}>
          <Row>
            <Col span={8}>
              <FormItem label="GL日期" {...layout}>
                {
                  getFieldDecorator('glDate', {
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
                  getFieldDecorator('projectNos', {
                    rules: [
                      {required: true, message: '必须选择项目编码'}
                    ]
                  })(
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
              <FormItem label="数据状态" {...layout}>
                {
                  getFieldDecorator('status', {initialValue: '10'})(<SelectInvokeApi
                    typeCode="BAD_DEBT_APPLY"
                    paramCode="STATUS"
                    placeholder="数据状态"
                    hasEmpty
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
                  getFieldDecorator('sbuInfo', {
                    rules: [
                      {required: true, message: '必须选择SBU'}
                    ]
                  })(<SelectSbu/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="部门" {...layout}>
                {
                  getFieldDecorator('orgInfo', {
                    rules: [
                      {required: true, message: '必须选择部门'}
                    ]
                  })(<SelectDept/>)
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
            <Button onClick={this.apply} type="primary" disabled={this.state.applyDis}>申请</Button>
          </Col>
        </Row>
        <br/>
        <Table 
          rowKey="contractItemId"
          bordered
          rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys2,
            onChange: this.rowSelectionChange2
          }}
          columns={columns2} 
          dataSource={this.state.result}
          scroll={{ x: 2722}}></Table>
        <BDModal 
          visible={this.state.isEdit}
          onCancel={this.editCancel}
          onOk={this.editDone}
          o={this.state.o}
         />
        <Modal 
          width={1080}
          title="坏账划销参考查询" 
          visible={this.state.visible}
          onCancel={this.onCancel}
          onOk={this.onOk}>
          <Table 
            rowKey="contractItemId"
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
            scroll={{ x: 2722}} />
        </Modal>
      </div>
    )
  }
}

export default Form.create()(Apply)
