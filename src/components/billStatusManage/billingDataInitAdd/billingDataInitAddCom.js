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
    infoData:[]

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
  modifiedData = (record) => {
    this.setState({
      showInfo:true,
      infoData:record
    })
  }
  closeModal =() => {
    this.setState({
      showInfo:false,
      infoData:[]
    })
    this.handleQuery()
  }
  saveData =(param) => {
    param.billingOutcomeId = this.state.infoData.billingOutcomeId
    this.props.saveBillDataInit(param).then((res)=> {
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('保存成功')
      } else {
        message.error('保存数据失败')
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
        width:80
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
        width:60
      },
      {
        title:'不含税金额',
        dataIndex:'taxExcludeAmount',
        width:120,
        render: (text, record, index) => (text ? currency(text) : text),
      },
      {
        title:'操作',
        dataIndex:'opion',
        width:60,
        fixed:'right',
        render: (text, record, index) => (
          <div>
            <Button onClick={()=>this.modifiedData(record)}>修改</Button>
          </div>
        ),
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
      type: 'radio',
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <BillingDataInitAddWithFrom getBillDataInitList={this.getBillDataInitList}/>
        <br />
        <Table
          rowKey="billingAppLineId"
          bordered
          columns={billingDataInitColumns}
          size="small"
          loading={this.state.loading}
          pagination={pagination}
          scroll={{ x:this.getWidth(billingDataInitColumns) }}
          dataSource={this.props.billInitData.getbillDataInitList.result}
        />
        {
          this.state.showInfo ?
            <InfoModal data ={this.state.infoData} colseModal={this.closeModal} saveData = {this.saveData}/>
            : null
        }
      </div>
    )
  }
}
export default BillingDataInitAddCom
