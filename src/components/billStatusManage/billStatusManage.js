/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, message, Modal } from 'antd'
import BillStatusManageWithFrom from './billStatusManageWithFrom'
import ItemInfo from './noApplyInfo'
import DetailModal from './calcelDetail'
import GlDateModal from './../common/glDateModal'
import FileDownModal from './fileDownMotal'
import currency from '../../util/currency'

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
     if(nextProps.billStatusManage.getBillStatusManageList.result.length > 0) {
       this.setState({
         firstID: nextProps.billStatusManage.getBillStatusManageList.result[0].billingApplicationId,
       })
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
    const param = {
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      },
      status: 'BILLING_NEW',
    }
    this.props.getBillStatusList(this.queryParam).then((res) => {
      this.setState({
        loading: false,
      })
      if (res && res.response && res.response.resultCode === '000000') {
        const resultData = this.props.billStatusManage.getBillStatusManageList.result
        let billingApplicationId = resultData.length ? resultData[0].billingApplicationId : '0'
        this.subSearch(billingApplicationId)
      } else {
        // message.error('加载数据失败')
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
    console.log(selectedRowKeys)
    if(selectedRowKeys.length>1){
      selectedRowKeys.splice(0,selectedRowKeys.length-1);
    }
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
        let billingApplicationId = this.state.selectedRows[0].billingApplicationId
        this.subSearch(billingApplicationId)
      }
    })
  }
  // 进一步查询
  subSearch = (billingApplicationId) => {
    let param = {}
    param.applicationId = billingApplicationId
    this.searchBillInfoResult(param)
    this.searchContractResult(param)
    this.searchBillResult(param)
  }
  // 查询申请单详细信息
  searchBillInfoResult = (param) => {
    this.props.getBillStatusDetail(param).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
      } else {
      }
    })
  }
  // 查询请单合同信息
  searchContractResult = (param) => {
    this.props.getBillStatusContractDetail(param).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
      } else {
      }
    })
  }
  // 查询开票结果
  searchBillResult = (param) => {
    this.props.getBillStatusBillResult(param).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
      } else {
      }
    })
  }
  onBillResultSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      billResultSelectedRowKeys: selectedRowKeys,
      billResultSelectedRows: selectedRows,
    })
  }
  NoApplycloseModalClaim = () => {
    this.setState({
      noApplyInfoVisitable: false,
      noApplyInfoData: '',
    })
  }
  showApplyInfo = (record) => {
    const paramsData = {}
    paramsData.processInstanceId = record.processInstanceId
    paramsData.businessKey = record.billingApplicationId
     this.props.myApplyInfo(paramsData).then((res) => {
     if (res && res.response && res.response.resultCode === '000000') {
     this.setState({
     noApplyInfoVisitable: true,
     noApplyInfoData: record,
     })
     } else {

     }
     })
  }
  // 撤销
  cancelHandle = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要撤销的数据')
      return
    }
    if (this.state.selectedRowKeys.length > 1) {
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
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要传送AP的数据')
      return
    }
    const sendApParam = {
      applicationId: this.state.selectedRows[0].billingApplicationId,
      glData: param,
    }
    let title = ''
    let msgtitle = <div><p style={{display: 'inline-block',width:'100px'}}>id</p><p style={{display: 'inline-block',width:'190px'}}>msg</p></div>
    this.props.sendAP(sendApParam).then((res)=>{
      title = res.response.data.description
      let data = res.response.data.applicationStatusResults
      //let data = res.response.data.applicationStatusResults = [ { "applicationId":"18010500003", "errorMessage":"状态不为作废审批中,不允许撤销!" }, { "applicationId":"18010500004", "errorMessage":"" } ]
      let msg = data.map((item)=>{
        return <div><p style={{display: 'inline-block',width:'100px'}}>{item.applicationId}</p><p style={{display: 'inline-block',width:'190px'}}>{item.errorMessage}</p></div>
      })
      console.log(res.response)
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
    console.log(this.state.billResultSelectedRowKeys)
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要传送AP的数据')
      return
    }
    if (this.state.selectedRowKeys.length > 1) {
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
    console.log(param)
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
    // console.log(this.props.getBillStatusBillResultList)
    // record.attachment = "101111|下载文件一"
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
  render() {
    const getBillStatusManageList  = this.props.billStatusManage.getBillStatusManageList.result
    console.log(getBillStatusManageList)
    const billApprovecolumns = [{
      title: '数据状态',
      dataIndex: 'status',
      width: 80,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '申请单编号',
      dataIndex: 'billingApplicationId',
      width: 200,
      render: (text, record) => (
        <a href='javascript:;' onClick={() => this.showApplyInfo(record)}>{text}</a>
      ),
    }, {
      title: '开票公司',
      dataIndex: 'companyName',
      width: 300,
    }, {
      title: '提前开票原因',
      dataIndex: 'preInvoiceReason',
      width: 300,
    }, {
      title: '预计回款日期',
      dataIndex: 'preReceiveDate',
      width: 150,
    }, {
      title: '开票要求',
      dataIndex: 'invoiceRequire',
      width: 300,
    }, {
      title: '开票客户名称',
      dataIndex: 'customerName',
      width: 300,
    }, {
      title: '纳税人识别号',
      dataIndex: 'taxIdentifyCode',
      width: 150,
    }, {
      title: '开票日期',
      dataIndex: 'invoiceDate',
      width: 150,
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: 300,
    }, {
      title: '创建提示',
      dataIndex: 'errorMessage',
      width: 100,
    },
    ]
    const billApproveInfoColumns = [
      {
        title: '开票行号',
        dataIndex: 'lineNo',
        width: 100,
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
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '开票金额',
        dataIndex: 'billingAmount',
        width: 100,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '开票税率',
        dataIndex: 'billingTaxRate',
        width: 100,
      },
      {
        title: '开票税额',
        dataIndex: 'billingTaxAmount',
        width: 100,
        render: (text, record, index) => (text ? currency(text) : text),
      },
    ]
    const billApproveItemColumns = [
      {
        title: '项目编码',
        dataIndex: 'projectCode',
        width: 100,
      },
      {
        title: '签约公司',
        dataIndex: 'company',
        width: 250,
      },
      {
        title: '合同编码',
        dataIndex: 'contractCode',
        width: 300,
      },
      {
        title: '付款条件',
        dataIndex: 'paymentTerm',
        width: 100,
      },
      {
        title: '付款条款',
        dataIndex: 'paymentName',
        width: 100,
      },
      {
        title: '付款阶段',
        dataIndex: 'paymentPhrases',
        width: 100,
      },
      {
        title: '付款金额',
        dataIndex: 'paymentAmount',
        width: 100,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: 'Billed AR金额',
        dataIndex: 'arAmount',
        width: 100,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '已开票金额',
        dataIndex: 'invoiceAmount',
        width: 100,
        render: (text, record, index) => (text ? currency(text) : text),
      },
    ]
    const billApproveResultcolumns = [
      {
        title: '数据状态',
        dataIndex: 'status',
        width: 100,
      },
      {
        title: '发票号码',
        dataIndex: 'invoiceNumber',
        width: 100,
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
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '税率',
        dataIndex: 'taxRate',
        width: 100,
      },
      {
        title: '不含税金额',
        dataIndex: 'taxExcludeAmount',
        width: 100,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title: '操作',
        dataIndex: 'oprateion',
        width: 100,
        fixed: 'right',
        render:(text, record) => (
          <div>
            <Button onClick={() => this.disableItem(record)}>作废</Button>
          </div>
        )
      },
    ]
    const { selectedRowKeys, firstID } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        defaultChecked:record.billingApplicationId == firstID
      })
    }
    const pagination = {
      current: 1,
      total: 10,
      pageSize: 10,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,

    }
    const billResultRowSelection = {
      type: 'checkBox',
      onChange: this.onBillResultSelectChange,
    }
    return (
      <div>
        <BillStatusManageWithFrom onQuery={this.handleChangeParam} />
        <Button onClick={this.showGlDate}>传送AP</Button>&nbsp;&nbsp;
        <Button onClick={this.cancelHandle} disabled={this.state.cancelDis}>撤销</Button>
        <br />
        <br />
        <h3>开票审批</h3>
        <br />
        <Table
          rowKey="billingApplicationId"
          rowSelection={rowSelection}
          bordered
          columns={billApprovecolumns}
          size="small"
          scroll={{ x: '2330px', y: this.state.tableHeight }}
          loading={this.state.loading}
          pagination={false}
          dataSource={getBillStatusManageList}
        />
        <br />
        <h3>开票申请详情</h3>
        <br />
        <Table
          rowKey="arBillingId"
          bordered
          columns={billApproveInfoColumns}
          size="small"
          scroll={{ x: '1100px', y: this.state.tableHeight }}
          loading={this.state.loading}
          dataSource={this.props.billStatusManage.getBillStatusDetailList}
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
          scroll={{ x: '1250px', y: this.state.tableHeight }}
          loading={this.state.loading}
          pagination={false}
          dataSource={this.props.billStatusManage.getBillStatusContractDetailList}
        />
        <br />
        <h3>开票结果</h3>
        <br />
        <Table
          rowSelection={billResultRowSelection}
          bordered
          columns={billApproveResultcolumns}
          size="small"
          scroll={{ x: '1700px', y: this.state.tableHeight }}
          loading={this.state.loading}
          pagination ={false}
          dataSource={this.props.billStatusManage.getBillStatusBillResultList}
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
              applyData={this.state.selectedRows ? this.state.selectedRows : this.props.billStatusManage.getBillStatusManageList.result}
            />
            : ''
        }
        <ItemInfo
          infoVisitable={this.state.noApplyInfoVisitable}
          closeClaim={this.NoApplycloseModalClaim}
          applyData={this.state.noApplyInfoData}
          applyInfoData={this.props.myApply.getMyApplyInfo}
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
          />
          : ''
        }

      </div>
    )
  }
}
BillStatusCon.propTypes = {
  /*getBillStatusList: PropTypes.func.isRequired,
  getBillStatusManageList: PropTypes.shape({
    getBillStatusManageList: PropTypes.number.isRequired,
  }).isRequired,*/
}
