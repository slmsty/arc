import React from 'react'
import TransferERPForm from './TransferERPForm'
import currency from '../../util/currency'
import { accMul } from '../../util/floatUtil'
import TransferNotice from './TransferNotice'
import { Table, Button, Tooltip } from 'antd'

class TransferERP extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      selectedRows:[],
      selectedRowKeys: [],
      loading: false,
      showSendMsg:false,
      sendInfo: {}
    }
    this.ErpColumns = [
      {
        title: '传ERP状态',
        dataIndex: 'erpStatus',
        fixed: 'left',
        width: 90,
      }, {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 110,
      }, {
        title: '合同编码',
        dataIndex: 'contractNo',
        width: 180,
      }, {
        title: 'TASK',
        dataIndex: 'contractCategory',
        width: 60,
      }, {
        title: '合同金额',
        dataIndex: 'contractAmount',
        width: 100,
        render: (text)=>(text ? currency(text) : currency(0))
      }, {
        title: '合同税率',
        dataIndex: 'contractTaxRate',
        width: 80,
        render: (text) => (text ? `${accMul(text, 100)}%` : 0)
      }, {
        title: '合同不含税金额',
        dataIndex: 'funding',
        width: 120,
        render: (text)=>(text ? currency(text) : currency(0))
      }, {
        title: '退税率',
        dataIndex: 'returnTaxRate',
        width: 70,
        render: (text)=>(text ? `${accMul(text, 100)}%` : 0)
      }, {
        title: 'Gross order',
        dataIndex: 'grossOrder',
        width: 100,
        render: (text)=>(text ? currency(text) : currency(0))
      }, {
        title: '结算方式',
        dataIndex: 'revenueCheckout',
        width: 80,
      }, {
        title: '立项BU',
        dataIndex: 'bu',
        width: 120,
      }, {
        title: '保修开始时间',
        dataIndex: 'maintainStartDate',
        width: 100,
      }, {
        title: '软件解决方案保修期',
        dataIndex: 'solutionMaintain',
        width: 140,
      }, {
        title: '服务器起始',
        dataIndex: 'serviceStartDate',
        width: 100,
      }, {
        title: '服务器结束',
        dataIndex: 'serviceEndDate',
        width: 100,
      }, {
        title: '合同名称',
        dataIndex: 'contractName',
        width: 320,
      }, {
        title: '签约公司',
        dataIndex: 'signCompany',
        width: 220,
      }, {
        title: '客户名称',
        dataIndex: 'custName',
        width: 200,
      }, {
        title: '是否采集',
        dataIndex: 'collectionProject',
        width: 80,
      }, {
        title: '签约日期',
        dataIndex: 'signDate',
        width: 100,
      }, {
        title: '创建提示',
        dataIndex: 'erpResult',
        width: 150,
        render: (text) => (
          text && text.length > 15 ? <Tooltip title={text}>{`${text.substring(0,15)}...`}</Tooltip> : text)
      }
    ]
    this.queryParam = {
      signDateStart:'',
      signDateEnd:'',
      buId:'',
      isReport:'N',
      projectNo:'',
      contractNo:'',
      contractName:'',
      erpStatus:'ALL',
      signCompany:'',
      collectionProject: 'ALL',
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      },
      opsStatus: this.props.isSingle ? '' : 'add',
    }
  }

  getTableWidth = (colum)=> {
    let width = 0
    colum.map((item)=>{
      width += parseFloat(item.width)
    })
    return width
  }
  handleQuery = () => {
    this.setState({
      loading: true
    })
    this.props.sendERPQuery(this.queryParam).then(res => {
      if(res.response) {
        this.setState({
          loading: false,
          selectedRows: [],
          selectedRowKeys: [],
        })
      }
    })
  }
  // 查询接口
  queryParams = (param) => {
    this.queryParam = {
      ...this.queryParam,
      ...param,
    }
    this.handleQuery()
  }
  // 传送ERP接口
  sendERP = () => {
    this.setState({
      transferLoading:true,
    })
    const selectedRows = this.state.selectedRows
    const pastData = selectedRows.map(item => item.orderLineId)
    const params = {
      orderLineIdList: pastData
    }
    this.props.sendERP(params).then((res)=>{
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          showSendMsg:true,
          sendInfo:res.response.data,
        })
        this.handleQuery()
      }
      this.setState({
        transferLoading:false,
      })
    })
  }
  // 页码修改
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  // 每页显示修改
  handleChangeSize = (current, size) => {
    this.queryParam.pageInfo.pageNo = current
    this.queryParam.pageInfo.pageSize = size
    this.handleQuery()
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }

  render() {
    const { pageNo, count, pageSize, result } = this.props.erpList
    const { selectedRowKeys } = this.state
    const rowSelection = {
      hideDefaultSelections:true,
      selectedRowKeys,
      type: this.props.isSingle ? 'radio': 'checkBox',
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.erpStatus === '传送成功' || record.erpStatus === '已传送PA' || record.erpStatus === 'PA处理中'
      }),
    }
    const pagination = {
      current: pageNo,
      total: count,
      showTotal: (total) => (`共 ${total} 条`),
      pageSize: pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,
    }
    return (
      <div>
        <TransferERPForm
          queryParms={this.queryParams}
        />
        <div style={{padding: '15px 0'}}>
          <Button type="primary" loading={this.state.transferLoading} onClick={this.sendERP} disabled={this.state.selectedRows.length ? false :true}>传送ERP</Button>
        </div>
        <Table
          rowSelection={rowSelection}
          pagination={pagination}
          bordered
          columns={this.ErpColumns}
          size="middle"
          scroll={{ x: this.getTableWidth(this.ErpColumns)}}
          loading={this.state.loading}
          dataSource={result}
        />
        {
          this.state.showSendMsg &&
          <TransferNotice
            sendInfo={this.state.sendInfo}
            closeNotice={() => this.setState({
              showSendMsg: false
            })}
          />
        }
      </div>
    )
  }
}

export default TransferERP
