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
    addFlag:false,
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
    let flag = false
    if (selectedRows[0]) {
      selectedRows.map((item)=> {
        if (item.status === 'BILLING_OK' || item.status === 'BILLING_INVALID_OK') {
          flag = true
        }
      })
    }
    if (flag || !selectedRows[0]) {
      this.setState({
        addFlag:false
      })
    }else {
      this.setState({
        addFlag:true
      })
    }
    this.setState({ selectedRowKeys, selectedRows })
  }
  modifiedData = (type) => {
    let flag = false
    let paramData = this.state.selectedRows
    let billingDataInitResultList = []
    let param = {}
    paramData.map((item)=>{
      if (type === 'add' && (item.status === 'BILLING_OK' || item.status === 'BILLING_INVALID_OK')) {
        message.error('所选申请单发票已录入完毕，请勿重复增加')
        flag = true
      }
      billingDataInitResultList.push({
        billingOutcomeId: item.billingOutcomeId,
        billingAppLineId: item.billingAppLineId,
      })
    })
    if (flag) {
      this.setState({
        selectedRows:[],
        selectedRowKeys:[],
      })
      return
    }
    param.billingDataInitResultList = billingDataInitResultList
    param.buttonType = type
    this.props.showDataInitModal(param).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          showInfo:true,
          selectType:type,
          billingDataInitResultList:billingDataInitResultList
        })
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

  render() {
    const billingDataInitColumns = [
      {
        title:'数据状态',
        dataIndex:'createTypeName',
        width:80
      }, {
        title:'开票状态',
        dataIndex:'statusName',
        width:100
      }, {
        title:'申请单号',
        dataIndex:'billingApplicationId',
        width:100
      }, {
        title:'行ID',
        dataIndex:'billingAppLineId',
        width:100
      }, {
        title:'项目编码',
        dataIndex:'projectNo',
        width:100
      }, {
        title:'款项名称',
        dataIndex:'paymentName',
        width:80
      }, {
        title:'发票号码',
        dataIndex:'invoiceNumber',
        width:80
      }, {
        title:'签约公司',
        dataIndex:'companyName',
        width:200
      }, {
        title:'开票客户名称',
        dataIndex:'custName',
        width:250
      }, {
        title:'发票类型',
        dataIndex:'invoiceTypeName',
        width:80
      }, {
        title:'发票代码',
        dataIndex:'invoiceCode',
        width:150
      }, {
        title:'开票日期',
        dataIndex:'billingDate',
        width:100
      }, {
        title:'含税金额',
        dataIndex:'taxIncludeAmount',
        width:120,
      }, {
        title:'税率',
        dataIndex:'taxRate',
        width:60,
        render: (text) => (text ? (text * 100) + '%' : text),
      }, {
        title:'不含税金额',
        dataIndex:'taxExcludeAmount',
        width:120,
      },
    ]
    const { selectedRowKeys } = this.state
    const { pageNo, count, pageSize} = this.props.billInitData.getbillDataInitList
    const pagination = {
      current: pageNo,
      total: count,
      pageSize: pageSize,
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
        <Button key="primary" onClick={()=>this.modifiedData('add')} disabled={!this.state.addFlag}>增加</Button>
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
            <InfoModal
              type={this.state.selectType}
              resultList={this.state.billingDataInitResultList}
              data ={this.props.billInitData.eidiBillDataInit}
              colseModal={this.closeModal}
              saveData = {this.props.saveBillDataInit}/>
            : null
        }
      </div>
    )
  }
}
export default BillingDataInitAddCom
