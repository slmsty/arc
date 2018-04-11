import React, { Component } from 'react'
import { Form, Row, Col, DatePicker, Button, Input, Table, Modal, Spin, message } from 'antd';
import SelectSbu from '../common/SelectSbu'
import SelectDept from '../common/SelectDept'
import MultipleInput from '../common/multipleInput'
import MultipleDayInput from '../common/multipleDayInput'
import SelectInvokeApi from '../common/selectInvokeApi'
import BDModal2 from './BDModal2'
import GlModal from './GlModal'
import BadDebtModal from './infoModal'
import ReturnModal from './returnModal'
import currency from '../../util/currency'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker


class Status extends Component{
  state = {
    rowKeys: [],
    rows: [],
    returnDis: true,
    erpDis: true,
    visible: false,
    result: [],
    rowKeys2: [],
    rows2: [],
    editDis: true,
    erp2Dis: true,
    unDoDis: true,
    isEdit: false,
    isGLEdit: false,
    infoModalVisitable: false,
    infoDetail: {},
    o: {},
    tableHeight: '',
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '数据状态',
        fixed: 'left',
        dataIndex: 'statusName',
        width: 100,
      },
      /* {
        title: '申请单账号',
        dataIndex: 'applyCount',
        width: 140,
      }, */
      {
        title: 'GL已提坏账金额',
        dataIndex: 'badDebtProvisionAmount',
        width: 140,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: 'Billed AR余额',
        dataIndex: 'billedArBalance',
        width: 140,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: <span>划销金额<em style={{ color: '#FF0000' }}>*</em></span>,
        dataIndex: 'badDebtAmount',
        width: 140,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '划销退回金额',
        dataIndex: 'badDebtBackAmount',
        width: 140,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: <span>申请日期<em style={{ color: '#FF0000' }}>*</em></span>,
        dataIndex: 'applicationDate',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'badDebtBackRemark',
        width: 300,
      },
      {
        title: '已划销金额',
        dataIndex: 'badDebtDeductedAmount',
        width: 140,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '已划销退回金额',
        dataIndex: 'badDebtReturnAmount',
        width: 140,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 140,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 140,
      },
      {
        title: '签约公司',
        dataIndex: 'companyName',
        width: 300,
      },
      {
        title: '客户名称',
        dataIndex: 'custName',
        width: 300,
      },
      {
        title: '币种',
        dataIndex: 'contractCurrency',
        width: 60,
      },
      {
        title: '部门',
        dataIndex: 'deptName',
        width: 300,
      },
      {
        title: 'SBU',
        dataIndex: 'sbuName',
        width: 140,
      },
      {
        title: '合同金额',
        dataIndex: 'contractAmount',
        width: 140,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: 'Billed AR日期',
        dataIndex: 'billedArDate',
        width: 100,
      },
      {
        title: 'GL日期',
        dataIndex: 'glDate',
        width: 100,
      },
      {
        title: 'Billed AR金额',
        dataIndex: 'billedArAmount',
        width: 140,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '回款金额',
        dataIndex: 'receiptAmount',
        width: 140,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '创建提示',
        dataIndex: 'statusRemark',
        width: 140,
      },
      {
        title: '操作',
        dataIndex: 'opration',
        fixed: 'right',
        textAlign: 'center',
        width: 80,
        render: (text, record, index) => (
          <Button size={'small'} style={{ display: 'block', margin: '0 auto'}} onClick={() => this.showInfo(record)}>详情</Button>
        ),
      },
    ]
    this.columns2 = [
      {
        title: 'GL已提坏账金额',
        dataIndex: 'badDebtProvisionAmount',
        width: 140,
      },
      {
        title: 'Billed AR余额',
        dataIndex: 'billedArBalance',
        width: 140,
      },
      {
        title: '坏账划销金额',
        dataIndex: 'badDebtAmount',
        width: 140,
      },
      {
        title: '已划销退回金额',
        dataIndex: 'badDebtReturnAmount',
        width: 140,
      },
      {
        title: <span>划销退回金额<em style={{ color: '#FF0000' }}>*</em></span>,
        dataIndex: 'badDebtBackAmount',
        width: 140,
      },
      {
        title: <span>GL日期<em style={{ color: '#FF0000' }}>*</em></span>,
        dataIndex: 'glDate',
        width: 80,
      },
      {
        title: '备注',
        dataIndex: 'badDebtBackRemark',
        width: 300,
      },
      {
        title: 'Billed AR金额',
        dataIndex: 'billedArAmount',
        width: 140,
      },
      {
        title: '回款金额',
        dataIndex: 'receiptAmount',
        width: 140,
      },
      {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 140,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 140,
      },
      {
        title: '签约公司',
        dataIndex: 'companyName',
        width: 300,
      },
      {
        title: '客户名称',
        dataIndex: 'custName',
        width: 300,
      },
      {
        title: '币种',
        dataIndex: 'contractCurrency',
        width: 60,
      },
      {
        title: '部门',
        dataIndex: 'deptName',
        width: 300,
      },
      {
        title: 'SBU',
        dataIndex: 'sbuName',
        width: 140,
      },
      {
        title: '合同金额',
        dataIndex: 'contractAmount',
        width: 140,
      },
      {
        title: 'Billed AR日期',
        dataIndex: 'billedArDate',
        width: 100,
      },
    ]
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.myApply.myapplyListRefresh !== nextProps.myApply.myapplyListRefresh) {
      this.doSearch()
    }
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div168-按钮56-翻页160
    const tableHeight = screenHeight - 8 - 12 - 24 - 126 - 56 - 28 - 24 - 160
    this.setState({ tableHeight })
  }
  componentDidMount() {
    this.doSearch()
  }

  doSearch = (e) => {
    if (e) {
      e.preventDefault()
    }
    this.props.form.validateFields((err, values) => {
      this.setState({
        rowKeys: [],
        rows: [],
        returnDis: true,
        erpDis: true,
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
  showInfo = (record) => {
    if (!record.processInstanceId) {
      message.error('没有流程信息')
      return
    }
    const param = {
      processInstanceId: record.processInstanceId,
      businessKey: record.badDebtId,
    }
    this.props.myApplyInfo(param).then((res) => {
      this.setState({
        infoModalVisitable: true,
      })
      if (res && res.response && res.response.resultCode === '000000') {
      } else {
        message.error(res.response.resultMessage)
      }
    })
  }
  returnEditClim = (params) => {
    this.props.returnEditClim(params).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('保存成功')
        this.setState({
          result: [this.props.myApply.getReturnEditInfo],
        })
      } else {
        message.error('保存失败')
      }
    })
  }
  closeShowInfo = () => {
    this.setState({
      infoModalVisitable: false,
      infoDetail: {},
    })
  }
  pageSizeChange = (current, size)=>{
    this.props.form.validateFields((err, values) => {
      this.setState({
        rowKeys: [],
        rows: [],
        returnDis: true,
        erpDis: true,
      })
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
    let rowKeys = this.state.rowKeys
    let rows = this.state.rows
    selectedRowKeys.forEach(key=>{
      if(!rowKeys.includes(key)){
        rows.push(selectedRows.find(o=>o.badDebtId===key))
      }
    })
    rows = rows.filter(o=>selectedRowKeys.includes(o.badDebtId))
    rowKeys = selectedRowKeys

    this.setState({
      rowKeys: rowKeys,
      rows: rows,
      returnDis: !(rows.length > 0 && rows.every(o => o.status === '20' || o.status === '21' || o.status === '24')),
      erpDis: !(rows.length > 0 && rows.every(o => o.status === '12' || o.status === '23')),
      unDoDis: !(rows.length > 0 && rows.every(o => o.status === '11')),
    })
  }

  rowSelectionChange2 = (selectedRowKeys, selectedRows)=>{
    let rowKeys2 = this.state.rowKeys2
    let rows2 = this.state.rows2
    selectedRowKeys.forEach(key=>{
      if(!rowKeys2.includes(key)){
        rows2.push(selectedRows.find(o=>o.badDebtId===key))
      }
    })
    rows2 = rows2.filter(o=>selectedRowKeys.includes(o.badDebtId))
    rowKeys2 = selectedRowKeys

    this.setState({
      rowKeys2: rowKeys2,
      rows2: rows2,
      editDis: rows2.length!==1,
      erp2Dis: !(rows2.length>0)
    })
  }

  bdReturn = () => {
    const selectData = this.state.rows
    if (selectData.length > 1) {
      message.error('一次只能对一条数据进行划销退回')
      return
    }
    this.setState({
      visible: true,
      result: this.state.rows,
      rowKeys2: [],
      rows2: [],
      editDis: true,
      erp2Dis: true,
    })
  }

  close = () => {
    this.setState({
      visible: false
    })
    this.props.UpdateResult(this.state.result)
  }

  sendErp = () => {
    this.setState({isGLEdit: true})
  }
  unDoErp = () => {
    this.setState({
      unDoDis: false,
    })
    if (this.state.rowKeys.length === 0) {
      message.error('请选择要撤销的收款流水')
      return
    }
    if (this.state.rowKeys.length > 1) {
      message.error('每次只能撤销一条收款流水')
      return
    }
    const that = this
    Modal.confirm({
      title: '操作确认',
      content: '确定撤销此数据？',
      okText: '是',
      cancelText: '否',
      onOk() {
        const emailQueryParam = {
          businessKey: that.state.rowKeys[0],
        }
        that.props.cancelApply(emailQueryParam).then((res) => {
          if (res && res.response && res.response.resultCode === '000000') {
            message.success('撤销成功')
          } else {
            message.error('撤销失败')
          }
        })
      },
    })
  }

  hideGlEdit = () => {
    this.setState({isGLEdit: false})
  }

  postGLEdit = (glDate) => {
    this.props.BillStatusSendErp(this.state.rowKeys, glDate)
    this.setState({
      isGLEdit: false,
      rowKeys: [],
      rows: [],
      returnDis: true,
      erpDis: true
    })
  }

  sendErp2 = ()=>{
    this.props.SendErp2(this.state.rowKeys2)
    this.setState({
      rowKeys2: [],
      rows2: [],
      editDis: true,
      erp2Dis: true
    })
  }

  doEdit = ()=>{
    this.setState({
      isEdit: true,
      o: this.state.rows2[0]
    })
  }

  editCancel = ()=>{
    this.setState({isEdit: false})
  }

  editDone = (values)=>{
    this.setState({
      isEdit: false,
      rowKeys2: [],
      rows2: [],
      editDis: true,
      erp2Dis: true,
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
  returnEditSendErp = (params) => {
    this.props.returnEditSendErp(params).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('传送erp成功')
      } else {
        message.error(res.response.resultMessage)
      }
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
    const roleButtons = sessionStorage.getItem('roleButtons')
    const buttonList = typeof roleButtons === 'undefined' || roleButtons === 'undefined' ? JSON.parse(roleButtons).map(r => r.path) : []
    return (
      <div className="badDebtsStatus">
        {loading ? <Spin size="large" style={{position:'absolute',left:'50%', top:'50%', zIndex:1000}} /> : null}
        <Form onSubmit={this.doSearch}>
          <Row>
            <Col span={8}>
              <FormItem label="申请日期" {...layout}>
                {
                  getFieldDecorator('applicationDate')(<RangePicker/>)
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
              <FormItem label="申请日期(多)" {...layout}>
                {
                  getFieldDecorator('applicationDates')(<MultipleDayInput />)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="数据状态" {...layout}>
                {
                  getFieldDecorator('status')(<SelectInvokeApi
                    typeCode="BAD_DEBT_STATUS"
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
                  getFieldDecorator('sbuInfo')(<SelectSbu/>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="部门" {...layout}>
                {
                  getFieldDecorator('orgInfo')(<SelectDept />)
                }
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">查询</Button>
            </Col>
          </Row>
        </Form>
        <br/>
        <Row>
          <Col span={24}>
            {
              buttonList.includes('badDebtBack') ?
                <Button onClick={this.bdReturn} style={{ marginRight: '20px' }} disabled={this.state.returnDis}>划销退回</Button> : null
            }
            {
              buttonList.includes('badDebtSendErp') ?
                <Button onClick={this.sendErp} type="primary" disabled={this.state.erpDis} style={{ marginRight: '20px' }}>传送ERP</Button> : null
            }
            {
              buttonList.includes('badDebtCancel') ?
                <Button onClick={this.unDoErp} type="primary" disabled={this.state.unDoDis}>撤销</Button> : null
            }

          </Col>
        </Row>
        <br />
        <Table
          size="small"
          style={{ backgroundColor: '#FFFFFF' }}
          rowKey="badDebtId"
          bordered
          rowSelection={{
            selectedRowKeys: this.state.rowKeys,
            onChange: this.rowSelectionChange,
          }}
          columns={columns}
          dataSource={result}
          pagination={{
            pageSizeOptions: ['5', '10', '20', '30'],
            showSizeChanger: true,
            onShowSizeChange: this.pageSizeChange,
            showTotal: t => `共${t}条`,
            onChange: this.pageNoChange,
            current: pageNo,
            pageSize: pageSize,
            total: count,
          }}
          scroll={{ x: 3560, y: this.state.tableHeight }}></Table>
        <GlModal
          visible={this.state.isGLEdit}
          onCancel={this.hideGlEdit}
          onOk={this.postGLEdit}
        />
        <ReturnModal
          visible={this.state.visible}
          onCancel={this.close}
          dataSource={this.state.result}
          returnEditClim={this.returnEditClim}
          sendErp={this.returnEditSendErp}
        />
        <BadDebtModal
          visible={this.state.infoModalVisitable}
          onCancel={this.closeShowInfo}
          data={this.props.myApply.getMyApplyInfo}
        />
      </div>
    )
  }
}

export default Form.create()(Status)
