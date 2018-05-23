/**
 * Created by liangshuang on 18/5/14.
 */
import React from 'react'
import {Table, message, Button} from 'antd'
import currency from '../../../util/currency'
import BillingDataInitAddWithFrom from './billingDataInitAddWithFrom'
import InfoModal from './infoModal'

class BillingDataInitAddCom extends React.Component {
  state = {
    loading: false,
    showInfo:false,
    selectedRows:[],
    selectedRowKeys:[],
    selectType:'',
    infoData:[],
    billingDataInitResultList:[]

  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    projectNo: '',
    contractNo: '',
    custName: '',
    companyName: '',
    invoiceNumbers: '',
    createType: '',
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.billInitData.myContractRefresh !== nextProps.billInitData.myContractRefresh) {
      this.closeModal()
    }
  }
  getWidth = (billingDataInitColumns) => {
    let width = 0
    billingDataInitColumns.map((item,index) => {
      width += parseFloat(item.width)
    })
    return width

  }
  getBillDataInitList = (params) => {
    this.queryParam = {...this.queryParam,...params}
    this.handleQuery()
  }
  handleQuery = () => {
    this.setState({
      loading:true
    })
    this.props.getBillDataInitList(this.queryParam).then((res)=> {
      this.setState({
        loading: false,
        selectedRowKeys:[],
        selectedRows:[]
      })
      if (res && res.response && res.response.resultCode === '000000') {
      } else {
        message.error('加载数据失败')
      }
    })
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
    this.setState({ selectedRowKeys, selectedRows })
  }
  modifiedData = (type) => {
    let paramData = this.state.selectedRows
    let billingDataInitResultList = []
    let param = {}
    paramData.map((item)=>{
      let queryParm = {}
      queryParm.billingOutcomeId = item.billingOutcomeId
      queryParm.billingAppLineId = item.billingAppLineId
      billingDataInitResultList.push(queryParm)
    })
    param.billingDataInitResultList = billingDataInitResultList
    param.buttonType = type
    this.props.showDataInitModal(param).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          showInfo:true,
          selectType:type,
          billingDataInitResultList:billingDataInitResultList
        })
      } else {
       // message.error(res.resultMessage)
      }
    })
  }
  closeModal =() => {

    this.setState({
      showInfo:false,
      infoData:[],
      selectedRows:[],
      selectedRowKeys:[],
    })
    this.handleQuery()
  }
  saveData =(param) => {
    param.billingOutcomeId = this.props.billInitData.eidiBillDataInit.billingOutcomeId
    param.billingDataInitResultList = this.state.billingDataInitResultList
    this.props.saveBillDataInit(param).then((res)=> {
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('保存成功')
      } else {
       // message.error('保存数据失败')
      }
    })
  }

  render() {
    const billingDataInitColumns = [
      {
        title:'数据状态',
        dataIndex:'createTypeName',
        width:80
      },
      {
        title:'开票状态',
        dataIndex:'statusName',
        width:100
      },
      {
        title:'申请单ID',
        dataIndex:'billingApplicationId',
        width:100
      },
      {
        title:'行ID',
        dataIndex:'billingAppLineId',
        width:100
      },
      {
        title:'项目编码',
        dataIndex:'projectNo',
        width:100
      },
      {
        title:'款项名称',
        dataIndex:'paymentName',
        width:80
      },
      {
        title:'发票号码',
        dataIndex:'invoiceNumber',
        width:80
      },
      {
        title:'签约公司',
        dataIndex:'companyName',
        width:200
      },
      {
        title:'开票客户名称',
        dataIndex:'custName',
        width:250
      },
      {
        title:'发票类型',
        dataIndex:'invoiceTypeName',
        width:80
      },
      {
        title:'发票代码',
        dataIndex:'invoiceCode',
        width:150
      },
      {
        title:'开票日期',
        dataIndex:'billingDate',
        width:100
      },
      {
        title:'含税金额',
        dataIndex:'taxIncludeAmount',
        width:120,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title:'税率',
        dataIndex:'taxRate',
        width:60,
        render: (text, record, index) => (text ? (text * 100) + '%' : text),
      },
      {
        title:'不含税金额',
        dataIndex:'taxExcludeAmount',
        width:120,
        render: (text, record, index) => (text ? currency(text) : text),
      },
    ]
    const { selectedRowKeys } = this.state
    const pagination = {
      current: this.props.billInitData.getbillDataInitList.pageNo,
      total: this.props.billInitData.getbillDataInitList.count,
      pageSize: this.props.billInitData.getbillDataInitList.pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,
    }
    const rowSelection = {
      selectedRowKeys,
      type: 'checkbox',
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <BillingDataInitAddWithFrom getBillDataInitList={this.getBillDataInitList}/>
        <br />
        <Button key="primary" onClick={()=>this.modifiedData('add')} disabled={!(this.state.selectedRows && this.state.selectedRows.length)}>增加</Button>
        <Button style={{marginLeft:'10px'}} key="primary1" onClick={()=>this.modifiedData('edit')} disabled={!(this.state.selectedRows && this.state.selectedRows.length)}>编辑</Button>
        <div style={{marginBottom:'10px'}}></div>
        <Table
          bordered
          rowSelection={rowSelection}
          columns={billingDataInitColumns}
          size="small"
          loading={this.state.loading}
          pagination={pagination}
          scroll={{ x:this.getWidth(billingDataInitColumns) }}
          dataSource={this.props.billInitData.getbillDataInitList.result}
        />
        {
          this.state.showInfo ?
            <InfoModal type={this.state.selectType} data ={this.props.billInitData.eidiBillDataInit} colseModal={this.closeModal} saveData = {this.saveData}/>
            : null
        }
      </div>
    )
  }
}
export default BillingDataInitAddCom
