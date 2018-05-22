/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import currency from '../../util/currency'
//import Excel from 'exceljs'
import { reciptMoneyInfoCols, billInfocomCols, billAndReciptMoneyCols, shouldReciptCols, projectTotalCols, totalContractContentColumns, turnProColumns,constructSplitSearchColumns,billInfoCols,outcomeTotalReportCols,unContractOutcomeDataAddCols,productOrderDetailCols,productOrderTotalCols } from './statementColumns'

import { Table, Row, Col, Form, Radio, DatePicker, Input, Icon } from 'antd'


import StatementWithFrom from './statementWithFrom'
export default class StatementListIndex extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
    currencyType: '',
    loading:false,
  }
  componentDidMount(){
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
  }

  excel = (param,type) => {
    let params = {}
    if (type === 'split') {
      params = {}
      params.contractSplit = param
    }
    if (type === 'order') {
      params = {}
      params.projectOrder = param
    }
    if (type === 'summarize') {
      params = {}
      params.orderSummarize = param
    }
    if (type==='receipt_claim') {
      params = {}
      params.receiptClaim = param
    }
    if (type==='outcomeInfoReport') {
      params = {}
      params.invoice = param
    }
    if (type==='receiptAccountReport') {
      params = {}
      params.confirReq = param
    }
    if (type==='projectInfoReport') {
      params = {}
      params.project = param
    }
    if (type==='contractInfoReport') {
      params = {}
      params.contract = param
    }
    if (type==='outcomeDetailReport') {
      params = {}
      params.invoiceDetail = param
    }
    if (type==='outcomeTotalReport') {
      params = {}
      params.billingMonth = param
    }
    if (type==='unContractOutcomeDataAdd') {
      params = {}
      params.unsignedBilling = param
    }
    this.props.getExcel(params,type)
  }

  handleQuery(type){
    this.setState({
      loading:true
    })
    if(type==='receiptInfoReport'){
      this.props.getStatementList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='contractSplitReport'){
      this.props.getContractStatementList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='outcomeDetailReport'){
      this.props.getInvoiceDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='outcomeTotalReport'){
      this.props.getOutcomeDetailReportList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='unContractOutcomeDataAdd'){
      this.props.getUnContractOutcomeDataAddList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='projectOrderDetailReport'){
      this.props.getProductOrderDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='projectOrderTotalReport'){
      this.props.getProductOrderTotalList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='projectInfoReport'){
      this.props.getProductDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='outcomeInfoReport'){
      this.props.getBillDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='receiptAccountReport'){
      this.props.getConfirmDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='getTotalContractDetailList'){
      this.props.getConfirmDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='projectInfoReport'){
      this.props.getProductDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='outcomeInfoReport'){
      this.props.getBillDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='receiptAccountReport'){
      this.props.getConfirmDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    if(type==='contractInfoReport'){
      this.props.getTotalContractDetailList(this.queryParam).then((res)=>{
        this.setState({
          loading:false,
        })
      })
    }
    this.setState({
      currencyType: type,
    })
  }
  // 查询接口
  /*param:传递参数
  type：报表类型*/
  queryParms = (param,type) => {
    console.log(type)
    this.setState({
      currencyType:type,
    })
    if(type==='receiptInfoReport'){
      let receiptClaim = {}
      receiptClaim.receiptClaim = param
      this.queryParam = { ...this.queryParam,...receiptClaim}
    }
    if(type==='contractSplitReport'){
      let contractSplit = {}
      contractSplit.contractSplit = param
      this.queryParam = { ...this.queryParam,...contractSplit}
    }
    if(type==='outcomeDetailReport'){
      let invoiceDetail = {}
      invoiceDetail.invoiceDetail = param
      this.queryParam = { ...this.queryParam,...invoiceDetail}
    }
    if(type==='outcomeTotalReport'){
      let billingMonth = {}
      billingMonth.billingMonth = param
      this.queryParam = { ...this.queryParam,...billingMonth}
    }
    if(type==='unContractOutcomeDataAdd'){
      let unsignedBilling = {}
      unsignedBilling.unsignedBilling = param
      this.queryParam = { ...this.queryParam,...unsignedBilling}
    }

    if(type==='projectOrderDetailReport'){
      let projectOrder = {}
      projectOrder.projectOrder = param
      this.queryParam = { ...this.queryParam,...projectOrder}
    }
    if(type==='projectOrderTotalReport'){
      let orderSummarize = {}
      orderSummarize.orderSummarize = param
      this.queryParam = { ...this.queryParam,...orderSummarize}
    }
    if(type==='contractInfoReport'){
      let contract = {}
      contract.contract = param
      this.queryParam = { ...this.queryParam,...contract}
    }
    if(type==='projectInfoReport'){
      let project = {}
      project.project = param
      this.queryParam = { ...this.queryParam,...project}
    }
    if(type==='outcomeInfoReport'){
      let invoice = {}
      invoice.invoice = param
      this.queryParam = { ...this.queryParam,...invoice}
    }
    if(type==='receiptAccountReport'){
      let confirReq = {}
      confirReq.confirReq = param
      this.queryParam = { ...this.queryParam,...confirReq}
    }
    if(type==='contractInfoReport'){
      let contract = {}
      contract.contract = param
      this.queryParam = { ...this.queryParam,...contract}
    }
    this.handleQuery(type)

  }
  // 获取展示列
  getApplyColumns = () =>{
    let width = 0
    const type = this.state.currencyType
    if(type==='receiptInfoReport'){
      //  获取宽度width
      reciptMoneyInfoCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,reciptMoneyInfoCols,'收款汇总金额','']
    } else if(type==='outcomeInfoReport'){
      billInfocomCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,billInfocomCols,'发票汇总金额','']
    } else if(type==='outcomeReceiptInfoReport'){
      billAndReciptMoneyCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,billAndReciptMoneyCols,'收款汇总金额','发票汇总金额']
    } else if(type==='receiptAccountReport'){
      shouldReciptCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,shouldReciptCols]
    } else if(type==='projectInfoReport'){
      projectTotalCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,projectTotalCols,'收款汇总金额','发票汇总金额','']
    } else if(type==='contractInfoReport'){
      totalContractContentColumns.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,totalContractContentColumns]
    } else if(type==='outProjectInfoReport'){
      turnProColumns.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,turnProColumns,'','']
    }else if(type==='contractSplitReport'){
      constructSplitSearchColumns.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,constructSplitSearchColumns,'','']
    } else if(type==='outcomeDetailReport') {
      billInfoCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,billInfoCols,'','']
    } else if(type==='outcomeTotalReport') {
      outcomeTotalReportCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,outcomeTotalReportCols,'','']
    }
    else if(type==='unContractOutcomeDataAdd') {
      unContractOutcomeDataAddCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,unContractOutcomeDataAddCols,'','']
    }
    else if(type==='projectOrderDetailReport') {
      productOrderDetailCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,productOrderDetailCols,'','']
    }
    else if(type==='projectOrderTotalReport') {
      productOrderTotalCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,productOrderTotalCols,'','']
    }
  }
  // 展示查询列表回调方法
  showCols = (type) => {
    const currencyType = this.state.currencyType;
    this.setState({
      currencyType: type,
    })
  }
  // 每页显示修改
  handleChangeSize = (current, size) => {
    this.queryParam.pageInfo.pageNo = current
    this.queryParam.pageInfo.pageSize = size
    const currencyType = this.state.currencyType
    this.handleQuery(currencyType)
  }
  // 页码修改
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    const currencyType = this.state.currencyType
    this.handleQuery(currencyType)
  }
  render() {
    const dataSources = {}
    let [current,total,pageSize,claimAmountTotal] = [0,0,0,'']
    const type = this.state.currencyType
    if(type==='receiptInfoReport'){
      const getStatementList = this.props.statement.getStatementList;
      dataSources.dataSource = getStatementList.result
      current = getStatementList.pageNo
      total = getStatementList.count
      pageSize = getStatementList.pageSize
      claimAmountTotal = currency(getStatementList.claimAmountTotal)
    }
    if(type==='contractSplitReport'){
      const getContractStatementList = this.props.statement.getContractStatementList;
      dataSources.dataSource = getContractStatementList.result
      current = getContractStatementList.pageNo
      total = getContractStatementList.count
      pageSize = getContractStatementList.pageSize
      claimAmountTotal = currency(getContractStatementList.claimAmountTotal)
    }
    if(type==='outcomeDetailReport'){
      const getInvoiceDetailList = this.props.statement.getInvoiceDetailList;
      dataSources.dataSource = getInvoiceDetailList.result
      current = getInvoiceDetailList.pageNo
      total = getInvoiceDetailList.count
      pageSize = getInvoiceDetailList.pageSize
    }
    if(type==='outcomeTotalReport'){
      const getOutcomeDetailReportList = this.props.statement.getOutcomeDetailReportList;
      dataSources.dataSource = getOutcomeDetailReportList.result
      current = getOutcomeDetailReportList.pageNo
      total = getOutcomeDetailReportList.count
      pageSize = getOutcomeDetailReportList.pageSize
    }
    if(type==='unContractOutcomeDataAdd'){
      const getUnSignList = this.props.statement.getUnSignList;
      dataSources.dataSource = getUnSignList.result
      current = getUnSignList.pageNo
      total = getUnSignList.count
      pageSize = getUnSignList.pageSize
    }
    if(type==='projectOrderDetailReport'){
      const getProductOrderDetailList = this.props.statement.getProductOrderDetailList;
      dataSources.dataSource = getProductOrderDetailList.result
      current = getProductOrderDetailList.pageNo
      total = getProductOrderDetailList.count
      pageSize = getProductOrderDetailList.pageSize
    }
    if(type==='projectOrderTotalReport'){
      const getProductOrderTotalList = this.props.statement.getProductOrderTotalList;
      dataSources.dataSource = getProductOrderTotalList.result
      current = getProductOrderTotalList.pageNo
      total = getProductOrderTotalList.count
      pageSize = getProductOrderTotalList.pageSize
    }
    if(type==='projectInfoReport'){
      const getProductDetailList = this.props.statement.getProductDetailList;
      dataSources.dataSource = getProductDetailList.result
      current = getProductDetailList.pageNo
      total = getProductDetailList.count
      pageSize = getProductDetailList.pageSize
    }
    if(type==='outcomeInfoReport'){
      const getBillDetailList = this.props.statement.getBillDetailList;
      dataSources.dataSource = getBillDetailList.result
      current = getBillDetailList.pageNo
      total = getBillDetailList.count
      pageSize = getBillDetailList.pageSize
      claimAmountTotal = currency(getBillDetailList.billingTotal)
    }
    if(type==='receiptAccountReport'){
      const getConfirmDetailList = this.props.statement.getConfirmDetailList;
      dataSources.dataSource = getConfirmDetailList.result
      current = getConfirmDetailList.pageNo
      total = getConfirmDetailList.count
      pageSize = getConfirmDetailList.pageSize
    }
    if(type==='contractInfoReport'){
      const getTotalContractDetailList = this.props.statement.getTotalContractDetailList;
      dataSources.dataSource = getTotalContractDetailList.result
      current = getTotalContractDetailList.pageNo
      total = getTotalContractDetailList.count
      pageSize = getTotalContractDetailList.pageSize
    }
    const pagination = {
      current: current,
      total: total,
      pageSize: pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,
    }
    return (
      <div>
        <StatementWithFrom reportType={this.props.reportType} showCols={this.showCols} queryParms={this.queryParms} excel={this.excel} currencyType = {this.state.currencyType}/>

        {type ?
          <div>
            <Row  style={{ lineHeight: '28px' }}>
              <Col span={24} style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 'bold' }}>
                {
                  this.getApplyColumns()[2] ?
                    <div>
                      <span>{this.getApplyColumns()[2]}：</span><span className="primary-color" style={{ color: '#F4A034' }}>{claimAmountTotal}</span>
                      {this.getApplyColumns()[3] ?
                        <span><span>{this.getApplyColumns()[3]}：</span> < span className = "primary-color" style={{ color: '#F4A034' }}></span></span>
                        :''
                      }
                    </div>
                    : ''
                }

              </Col>
            </Row>
            <Table
              columns={this.getApplyColumns()[1]}
              bordered
              size="middle"
              scroll={{ x: this.getApplyColumns()[0] }}
              dataSource={dataSources.dataSource}
              pagination={pagination}
              loading={this.state.loading}
            />
          </div>
        : null}

      </div>
    )
  }
}
