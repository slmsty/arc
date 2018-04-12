/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import currency from '../../util/currency'
//import Excel from 'exceljs'
import { reciptMoneyInfoCols, billInfocomCols, billAndReciptMoneyCols, shouldReciptCols, projectTotalCols, totalContractContentColumns, turnProColumns,constructSplitSearchColumns,billInfoCols,outcomeTotalReportCols,unContractOutcomeDataAddCols } from './statementColumns'

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
  excel = (param) => {
    let params = {}
    params.contractSplit = param
    this.props.getExcel(params)
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
    this.setState({
      currencyType: type,
    })
  }
  // 查询接口
  /*param:传递参数
  type：报表类型*/
  queryParms = (param,type) => {
    this.setState({
      currencyType:type,
    })
    if(type==='receiptInfoReport'){
      let contractSplit = {}
      contractSplit.contractSplit = param
      this.queryParam = { ...this.queryParam,...contractSplit}
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
      dataSources.dataSource = this.props.statement.getStatementList.result
      current = this.props.statement.getStatementList.pageNo
      total = this.props.statement.getStatementList.count
      pageSize = this.props.statement.getStatementList.pageSize
      claimAmountTotal = currency(this.props.statement.getStatementList.claimAmountTotal)
    }
    if(type==='contractSplitReport'){

      dataSources.dataSource = this.props.statement.getContractStatementList.result
      current = this.props.statement.getContractStatementList.pageNo
      total = this.props.statement.getContractStatementList.count
      pageSize = this.props.statement.getContractStatementList.pageSize
      claimAmountTotal = currency(this.props.statement.getContractStatementList.claimAmountTotal)
    }
    if(type==='outcomeDetailReport'){

      dataSources.dataSource = this.props.statement.getInvoiceDetailList.result
      current = this.props.statement.getInvoiceDetailList.pageNo
      total = this.props.statement.getInvoiceDetailList.count
      pageSize = this.props.statement.getInvoiceDetailList.pageSize
    }
    if(type==='outcomeTotalReport'){

      dataSources.dataSource = this.props.statement.getOutcomeDetailReportList.result
      current = this.props.statement.getOutcomeDetailReportList.pageNo
      total = this.props.statement.getOutcomeDetailReportList.count
      pageSize = this.props.statement.getOutcomeDetailReportList.pageSize
    }
    if(type==='unContractOutcomeDataAdd'){

      dataSources.dataSource = this.props.statement.getUnSignList.result
      current = this.props.statement.getUnSignList.pageNo
      total = this.props.statement.getUnSignList.count
      pageSize = this.props.statement.getUnSignList.pageSize
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
        <StatementWithFrom showCols={this.showCols} queryParms={this.queryParms} excel={this.excel} currencyType = {this.state.currencyType}/>

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
