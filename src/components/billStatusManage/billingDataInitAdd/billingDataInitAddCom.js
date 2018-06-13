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
        title:'申请单号',
        dataIndex:'billingApplicationId',
        width:100,
        float: 'left',
      }, {
        title:'行号',
        dataIndex:'billingAppLineId',
        width:100
      }, {
        title:'申请日期',
        dataIndex:'billingApplicationDate',
        width:150
      }, {
        title:'项目编码',
        dataIndex:'projectNo',
        width:100
      }, {
        title:'合同编码',
        dataIndex:'contractNo',
        width:190
      }, {
        title:'合同名称',
        dataIndex:'contractName',
        width:350
      }, {
        title:'签约公司',
        dataIndex:'companyName',
        width:200
      }, {
        title:'客户名称',
        dataIndex:'custName',
        width:250
      }, {
        title:'开票内容',
        dataIndex:'billingContent',
        width:250
      },  {
        title:'款项名称',
        dataIndex:'paymentName',
        width:80
      }, {
        title:'开票阶段',
        dataIndex:'billingPhrases',
        width:120
      }, {
        title:'发票类型',
        dataIndex:'invoiceTypeName',
        width:80
      }, {
        title:'开票税率',
        dataIndex:'taxRate',
        width:90,
        render: (text) => (text ? (text * 100) + '%' : text),
      }, {
        title:'开票金额',
        dataIndex:'billingAmount',
        width:100,
      }, {
        title:'开票说明',
        dataIndex:'billingApplicationRequest',
        width:150
      }, {
        title:'发票备注',
        dataIndex:'billingApplicationRemark',
        width:180
      }, {
        title:'发票代码',
        dataIndex:'invoiceCode',
        width:150
      }, {
        title:'发票号',
        dataIndex:'invoiceNumber',
        width:150
      }, {
        title:'发票类型',
        dataIndex:'invoiceType',
        width:150
      }, {
        title:'发票日期',
        dataIndex:'billingDate',
        width:100
      }, {
        title:'含税金额',
        dataIndex:'taxIncludeAmount',
        width:120,
        render: (text) => (text ? currency(text) : text),
      }, {
        title:'不含税金额',
        dataIndex:'taxExcludeAmount',
        width:100,
        render: (text) => (text ? currency(text) : text),
      }, {
        title:'税额',
        dataIndex:'taxAmount',
        width:100,
        render: (text) => (text ? currency(text) : text),
      }, {
        title:'审批完成日期',
        dataIndex:'approveCPDate',
        width:100
      }, {
        title:'数据来源',
        dataIndex:'createTypeName',
        width:80
      }, {
        title:'开票状态',
        dataIndex:'statusName',
        width:100
      },
    ]
    const { selectedRowKeys } = this.state
    const { pageNo, count, pageSize} = this.props.billInitData.getbillDataInitList
    const pagination = {
      current: pageNo,
      total: count,
      showTotal: (total) => (`共 ${total} 条`),
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
        <BillingDataInitAddWithFrom
          getBillDataInitList={this.getBillDataInitList}
          exportExcel={this.props.exportExcel}
        />
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
              saveData={this.props.saveBillDataInit}
            />
            : null
        }
      </div>
    )
  }
}
export default BillingDataInitAddCom
