import React from 'react'
import { Button, Table, message, Modal } from 'antd'
import BillStatusManageWithFrom from './billStatusManageWithFrom'
import NoApplyInfo from '../myApply/noApplyInfo'
import DetailModal from './calcelDetail'
import GlDateModal from './../common/glDateModal'
import FileDownModal from './fileDownMotal'
import { toThousands } from '../../util/currency'
import { billApproveItemColumns } from './billStatusCols'
import InvoiceBackInfoEdit from './InvoiceBackInfoEdit'
import { pageSizeOptions } from "../billApplication/billColumns";
const TO_TAX_TYPE = ['开票审批完成', '作废审批完成', '开票失败']
const CANCEL_TYPE = ['开票审批中', '作废审批中']
const BACK_INFO = ['项目退票', '其他红字开票']

export default class BillStatusCon extends React.Component {
  state = {
    loading: false,
    contarctSplitModal: false,
    noApplyInfoVisitable: false,
    noApplyInfoData: '',
    selectedRowKeys: '',
    selectedRows: {},
    billResultSelectedRowKeys: '',
    billResultSelectedRows: {},
    detailVisible: false,
    detail: '',
    tableHeight: '',
    calcelModalVisitable: false,
    cancelDis: true,
    showGlDateModal: false,
    fileDownDis: false,
    fileDownData: [],
    firstID: '',
    sendLoading: false,
    showBackInfo: false,
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div147.5-按钮56-翻页160
    const tableHeight = screenHeight - 8 - 12 - 147.5 - 56 - 160
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.billStatusManage.cancelApproveRefresh !== nextProps.billStatusManage.cancelApproveRefresh) {
      this.handleQuery()
    }
    if(this.props.billStatusManage.getBillStatusManageList !== nextProps.billStatusManage.getBillStatusManageList && nextProps.billStatusManage.getBillStatusManageList.result.length > 0) {
      const result = nextProps.billStatusManage.getBillStatusManageList.result[0]
      this.setState({
        firstID: nextProps.billStatusManage.getBillStatusManageList.result[0].billingApplicationId,
        selectedRows: [result],
      })
    }
    if(this.props.billStatusManage.sendResult !== nextProps.billStatusManage.sendResult) {
      const result = nextProps.billStatusManage.sendResult.applicationStatusResults
      if(result.length > 0) {
        message.error(result[0].errorMessage)
      } else {
        message.success('发票申请信息传送成功')
      }
      this.setState({sendLoading: false})
    }
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    beginDate: '',
    endDate: '',
    status: '',
    cutomer: '',
    projectCode: '',
    contractCode: '',
    invoiceCode: '',
  }
  handleQuery = () => {
    this.setState({
      loading: true,
    })
    this.props.getBillStatusList(this.queryParam).then((res) => {
      this.setState({
        loading: false,
      })
      if (res && res.response && res.response.resultCode === '000000') {
        const resultData = this.props.billStatusManage.getBillStatusManageList.result
        let billingApplicationId = resultData.length ? resultData[0].billingApplicationId : '0'
        this.subSearch(billingApplicationId)
      }
    })
  }
  handleChangeParam = (param) => {
    this.queryParam = { ...this.queryParam, ...param }
    this.handleQuery()
  }
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  handleChangeSize = (current, size) => {
    this.queryParam.pageInfo.pageNo = current
    this.queryParam.pageInfo.pageSize = size
    this.handleQuery()
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    if((selectedRows.length && selectedRows[0].status=='开票审批中') || (selectedRows.length && selectedRows[0].status=='作废审批中')) {
      this.setState({
        cancelDis: false,
      })
    }
    if(!selectedRows.length){
      this.setState({
        cancelDis: true,
      })
    }
    this.setState({ selectedRowKeys, selectedRows }, () => {
      if (this.state.selectedRows.length > 0) {
        this.subSearch(this.state.selectedRows[0].billingApplicationId)
      }
    })
  }
  // 进一步查询
  subSearch = (billingApplicationId) => {
    const param = {
      applicationId: billingApplicationId
    }
    this.props.getBillStatusDetail(param)
    this.props.getBillStatusContractDetail(param)
    this.props.getBillStatusBillResult(param)
  }

  onBillResultSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      billResultSelectedRowKeys: selectedRowKeys,
      billResultSelectedRows: selectedRows,
    })
  }

  noApplycloseModalClaim = () => {
    this.setState({
      noApplyInfoVisitable: false,
      noApplyInfoData: '',
    })
  }

  showApplyInfo = (record) => {
    const paramsData = {
      processInstanceId: record.processInstanceId,
      businessKey: record.billingApplicationId
    }
    this.props.myApplyInfo(paramsData).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          noApplyInfoVisitable: true,
          noApplyInfoData: record,
        })
        this.props.getContractUrl(res.response.data.serviceDetail.contractIds)
      }
    })
  }

  getBillLineColumns = () => {
    const billApproveInfoColumns = [
      {
        title: '开票行号',
        dataIndex: 'lineNo',
        width: 70,
        render: (text, record) => text === '合计' ?
          <span style={{fontWeight: 'bold', color: '#ff8928'}}>合计</span> : text
      }, {
        title: '开票内容',
        dataIndex: 'billingContent',
        width: 300,
      },
      {
        title: '规格型号',
        dataIndex: 'specificationType',
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        width: 100,
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        width: 100,
        render: (text, record, index) => (text ? toThousands(text) : text),
      },
      {
        title: '开票不含税金额',
        dataIndex: 'billingAmountExcludeTax',
        width: 100,
        render: (text, record, index) =>
          record.lineNo === '合计' ? <span style={{color: '#ff8928'}}>{text}</span> :
            (text ? toThousands(text) : text),
      },
      {
        title: '开票金额',
        dataIndex: 'billingAmount',
        width: 100,
        render: (text, record, index) =>
          (record.lineNo === '合计' ? <span style={{color: '#ff8928'}}>{text}</span>  :
            (text ? toThousands(text) : text)),
      },
      {
        title: '开票税率',
        dataIndex: 'billingTaxRate',
        width: 100,
        render: (text, record) =>
          record.lineNo === '合计' ? text : (typeof record.billingTaxRate !== 'undefined' ? `${text * 100}%` : '')
      },
      {
        title: '开票税额',
        dataIndex: 'billingTaxAmount',
        width: 100,
        render: (text, record, index) => (
          record.lineNo === '合计' ? <span style={{color: '#ff8928'}}>{text}</span>  :
            (text ? toThousands(text) : text)),
      },
    ]
    return billApproveInfoColumns
  }
  // 撤销
  cancelHandle = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择要撤销的数据')
      return
    }
    if (this.state.selectedRows.length > 1) {
      message.error('一次只能撤销一条数据')
      return
    }
    const that = this
    Modal.confirm({
      title: '操作确认',
      content: `您确认要将所选择的数据撤销吗`,
      okText: '是',
      cancelText: '否',
      onOk() {
        const changeParam = {
          applicationId: that.state.selectedRows[0].billingApplicationId,
        }
        that.props.cancelApprove(changeParam).then((res)=>{
          if (res && res.response && res.response.resultCode === '000000') {
            that.setState({
              selectedRowKeys: '',
              selectedRows: {},
            })
            message.success('撤销成功')
          } else {
            message.error(res.response.resultMessage)
          }
        })
      },
    })
  }
  // 传送AP
  sendAp = (param) => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择要传送AP的数据')
      return
    }
    const sendApParam = {
      applicationId: this.state.selectedRows[0].billingApplicationId,
      glData: param,
    }
    let title = ''
    this.props.sendAP(sendApParam).then((res)=>{
      title = res.response.data.description
      let data = res.response.data.applicationStatusResults
      let msg = data.map((item)=>{
        return <div><p style={{display: 'inline-block',width:'100px'}}>{item.applicationId}</p><p style={{display: 'inline-block',width:'190px'}}>{item.errorMessage}</p></div>
      })
      if (res && res.response && res.response.resultCode === '000000') {
      } else {
      }
      Modal.info({
        title: title,
        content: msg,
      })
    })
    this.setState({
      showGlDateModal: false,
    })
  }
  showGlDate = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择要传送AP的数据')
      return
    }
    if (this.state.selectedRows.length > 1) {
      message.error('一次只能传送一条数据')
      return
    }
    this.setState({
      showGlDateModal: true,
    })
  }
  closeGlDateModal = () => {
    this.setState({
      showGlDateModal: false,
    })
  }
  // 作废
  disableItem = (record) => {
    if (this.state.billResultSelectedRowKeys.length === 0) {
      message.error('请选择要作废的数据')
      return
    }
    if (this.state.billResultSelectedRowKeys.length > 1) {
      message.error('一次只能作废一条数据')
      return
    }
    this.setState({
      calcelModalVisitable: true,
    })
  }
  disableApprove = (param) => {
    this.props.disableApprove(param).then((res)=>{
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('作废成功')
      } else {
        message.error('作废失败')
      }
    })
    this.setState({
      calcelModalVisitable: false,
    })
  }
  // 关闭作废modal
  closeDisableModal = () => {
    this.setState({
      calcelModalVisitable: false,
    })
  }
  // 查看详情
  showDetail = (record) => {
    this.setState({
      detailVisible: true,
      detail: record,
    })
  }
  showBillFiles = (record) => {
    const attachment = record.attachment
    let attachmentArray = attachment.split('|')
    this.setState({
      fileDownDis: true,
      fileDownData: attachmentArray,
    })
  }
  CloseFileDownModal = () => {
    this.setState({
      fileDownDis: false,
      fileDownData: [],
    })
  }

  fileDown = (id, name) => {
    const params = {
      objectId: id,
      objectName: name
    }
    this.props.fileDown(params)
  }
  /* 传送金税 */
  sendInvoiceToTax = () => {
    const application = this.state.selectedRows[0].billingApplicationId
    this.props.invoiceSendTax(application)
    this.setState({sendLoading: true})
  }

  handleInvoiceBack = () => {
    const applicationId = this.state.selectedRows[0].billingApplicationId
    this.props.invoiceBackQuery(applicationId).then(res => {
      if(res && res.response && res.response.resultCode === '000000') {
        this.setState({showBackInfo: true})
      }
    })
  }

  getTotalColumns = (dataSource) => {
    let billingAmount = 0
    let billingAmountExcludeTax = 0
    let billingTaxAmount = 0
    dataSource.map(item => {
      billingAmount = billingAmount + parseFloat(item.billingAmount)
      billingAmountExcludeTax = billingAmountExcludeTax + parseFloat(item.billingAmountExcludeTax)
      billingTaxAmount = billingTaxAmount + parseFloat(item.billingTaxAmount)
    })
    const newData = dataSource.concat({
      lineNo: '合计',
      billingAmountExcludeTax: toThousands(billingAmountExcludeTax.toFixed(2)),
      billingAmount: toThousands(billingAmount.toFixed(2)),
      billingTaxAmount: toThousands(billingTaxAmount.toFixed(2)),
    })
    return newData
  }

  getResultColumns = (dataSource) => {
    let billingAmount = 0
    let billingAmountExcludeTax = 0
    let billingTaxAmount = 0
    dataSource.map(item => {
      billingAmount = billingAmount + parseFloat(item.taxIncludeAmount)
      billingAmountExcludeTax = billingAmountExcludeTax + parseFloat(item.taxExcludeAmount)
      billingTaxAmount = billingTaxAmount + parseFloat(item.taxAmount)
    })
    const newData = dataSource.concat({
      status: '合计',
      taxExcludeAmount: toThousands(billingAmountExcludeTax.toFixed(2)),
      taxIncludeAmount: toThousands(billingAmount.toFixed(2)),
      taxAmount: toThousands(billingTaxAmount.toFixed(2)),
    })
    return newData
  }

  render() {
    const { result, count, pageCount, pageSize }  = this.props.billStatusManage.getBillStatusManageList
    const billApproveResultColumns = [
      {
        title: '数据状态',
        dataIndex: 'status',
        width: 120,
        fixed: 'left',
        render: (text) => text === '合计' ?
          <span style={{fontWeight: 'bold', color: '#ff8928'}}>合计</span> : text
      },
      {
        title: '发票号码',
        dataIndex: 'invoiceNumber',
        width: 130,
        render: (text, record, index) => {
          return (
            <a href="javascript:;" onClick={()=>this.showBillFiles(record)}>{text}</a>
          )
        },
      },
      {
        title: '签约公司',
        dataIndex: 'invoiceCompany',
        width: 300,
      },
      {
        title: '开票客户名称',
        dataIndex: 'invoiceCustomer',
        width: 300,
      },
      {
        title: '发票类型',
        dataIndex: 'invoiceType',
        width: 100,
      },
      {
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width: 300,
      },
      {
        title: '开票日期',
        dataIndex: 'invoiceDate',
        width: 100,
      },
      {
        title: '含税金额',
        dataIndex: 'taxIncludeAmount',
        width: 100,
        render: (text, record) =>
          record.status === '合计' ? <span style={{color: '#ff8928'}}>{text}</span> :
            (text ? toThousands(text) : text),
      },
      {
        title: '不含税金额',
        dataIndex: 'taxExcludeAmount',
        width: 100,
        render: (text, record) =>
          record.status === '合计' ? <span style={{color: '#ff8928'}}>{text}</span> :
            (text ? toThousands(text) : text),
      },
      {
        title: '税额',
        dataIndex: 'taxAmount',
        width: 100,
        render: (text, record) =>
          record.status === '合计' ? <span style={{color: '#ff8928'}}>{text}</span> :
            (text ? toThousands(text) : text),
      }
    ]
    const billApproveColumns = [
      {
        title: '数据状态',
        dataIndex: 'status',
        width: 120,
        textAlign: 'center',
        fixed: 'left',
      }, {
        title: '开票申请分类',
        dataIndex: 'applicationType',
        width: 170,
      }, {
        title: '申请单编号',
        dataIndex: 'billingApplicationId',
        width: 110,
        render: (text, record) => (
          <a href='javascript:void(0);' onClick={() => this.showApplyInfo(record)}>{text}</a>
        ),
      }, {
        title: '申请人',
        dataIndex: 'applicantName',
        width: 120,
      }, {
        title: '退票票号',
        dataIndex: 'invoiceNum',
        width: 100,
      }, {
        title: '开票公司',
        dataIndex: 'companyName',
        width: 200,
      }, {
        title: '开票要求',
        dataIndex: 'invoiceRequire',
        width: 400,
      }, {
        title: '开票客户名称',
        dataIndex: 'customerName',
        width: 250,
      }, {
        title: '客户纳税人识别号',
        dataIndex: 'customerTaxIdentifyCode',
        width: 150,
      }, {
        title: '开票申请时间',
        dataIndex: 'applyDate',
        width: 140,
      }, {
        title: '开票日期',
        dataIndex: 'invoiceDate',
        width: 90,
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: 250,
      }, {
        title: '创建提示',
        dataIndex: 'errorMessage',
        width: 100,
      },
    ]
    const { selectedRowKeys, firstID } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        defaultChecked:selectedRowKeys.length > 0 ? '' : record.billingApplicationId == firstID
      })
    }
    const pagination = {
      total: count,
      showTotal: (total) => (`共 ${total} 条`),
      pageSize: pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,
      pageSizeOptions,
    }
    const { getBillStatusDetailList, getBillStatusBillResultList } = this.props.billStatusManage

    const roleButtons = sessionStorage.getItem('roleButtons')
    const buttonList = typeof roleButtons === 'undefined' || roleButtons === 'undefined' ? [] : JSON.parse(roleButtons).map(r => r.path)
    return (
      <div>
        <BillStatusManageWithFrom onQuery={this.handleChangeParam} />
        {
          buttonList.includes('billingStatusSendAp') ?
            <Button
              onClick={this.showGlDate}
              type="primary"
              ghost
            >传送AP</Button> : null
        }
        {
          buttonList.includes('billingStatusCancel') ?
            <Button
              type="primary"
              ghost
              style={{marginLeft: '10px'}}
              onClick={this.cancelHandle}
              disabled={this.state.selectedRows.length > 0 ? !CANCEL_TYPE.includes(this.state.selectedRows[0].status) : true}
            >撤销</Button> : null
        }
        {
          buttonList.includes('billingStatusSendTax') ?
            <Button
              style={{marginLeft: '10px'}}
              loading={this.state.sendLoading}
              disabled={this.state.selectedRows.length > 0 ? !TO_TAX_TYPE.includes(this.state.selectedRows[0].status) : true}
              type="primary"
              ghost
              onClick={() => this.sendInvoiceToTax()}
            >传送金税</Button> : null
        }
        <Button
          disabled={!(this.state.selectedRows.length > 0 && BACK_INFO.includes(this.state.selectedRows[0].applicationType))}
          style={{marginLeft: '10px'}}
          onClick={this.handleInvoiceBack}
          type="primary"
          ghost
        >纸票退回情况</Button>
        <br />
        <br />
        <h3>开票申请</h3>
        <br />
        <Table
          rowKey="billingApplicationId"
          rowSelection={rowSelection}
          bordered
          columns={billApproveColumns}
          size="small"
          scroll={{ x: '2200px' }}
          loading={this.state.loading}
          pagination={pagination}
          dataSource={result}
        />
        <br />
        <h3>开票申请详情</h3>
        <br />
        <Table
          rowKey="billingAppLineId"
          bordered
          columns={this.getBillLineColumns()}
          size="small"
          scroll={{ x: '1100px' }}
          dataSource={this.getTotalColumns(getBillStatusDetailList)}
          pagination={false}
        />
        <br />
        <h3>对应项目条款</h3>
        <br />
        <Table
          rowKey="receiptClaimId"
          bordered
          columns={billApproveItemColumns}
          size="small"
          scroll={{ x: '1250px' }}
          pagination={false}
          dataSource={this.props.billStatusManage.getBillStatusContractDetailList}
        />
        <br />
        <h3>开票结果</h3>
        <br />
        <Table
          bordered
          columns={billApproveResultColumns}
          size="small"
          scroll={{ x: '1600px' }}
          pagination ={false}
          dataSource={this.getResultColumns(getBillStatusBillResultList)}
        />
        {
          this.state.billResultSelectedRows.length > 0 ?
            <DetailModal
              visible={this.state.calcelModalVisitable}
              onOk={this.closeDisableModal}
              onCancel={this.closeDisableModal}
              data={this.state.billResultSelectedRows}
              dataSource={this.props.billStatusManage.getBillStatusContractDetailList}
              disableApprove={this.disableApprove}
              DetailList={this.props.billStatusManage.getBillStatusDetailList}
              applyData={this.state.selectedRows ? this.state.selectedRows : result}
              currentUser={this.props.currentUser}
            />
            : null
        }
        <NoApplyInfo
          infoVisitable={this.state.noApplyInfoVisitable}
          closeClaim={this.noApplycloseModalClaim}
          applyData={this.state.noApplyInfoData}
          applyInfoData={this.props.myApply.getMyApplyInfo}
          fileDown={this.props.fileDown}
          contractUrl={this.props.contractUrl}
        />
        {/* 弹出传送ARglDatemodal */}
        <GlDateModal
          glDateModal={this.state.showGlDateModal}
          selectOk={this.sendAp}
          selectCancel={this.closeGlDateModal}
        />
        {
          this.state.fileDownData.length ?
            <FileDownModal
              visible={this.state.fileDownDis}
              onOk={this.CloseFileDownModal}
              onCancel={this.CloseFileDownModal}
              data={this.state.fileDownData}
              fileDown={this.fileDown}
            /> : null
        }
        {
          this.state.showBackInfo ?
            <InvoiceBackInfoEdit
              applicationId={this.state.selectedRows[0].billingApplicationId}
              invoiceResult={this.props.billStatusManage.backInfo}
              onCancel={() => this.setState({showBackInfo: false})}
              saveInvoiceBackInfo={this.props.saveInvoiceBackInfo}
            /> : null
        }
      </div>
    )
  }
}
