/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, message, Row, Col } from 'antd'
import ContractSplitWithFrom from './contractSplitWithFrom'
import ContractSplitModal  from './contractSplitModal'
import currency from '../../util/currency'
import ERPModals from "./ERPModal";

const columns = [{
  title: '拆分状态',
  dataIndex: 'status',
  width: 80,
  fixed: 'left',
  textAlign: 'center',
  render: (text, record, index) => (text=='N' ? "未拆分合同" : "已拆分合同"),
}, {
  title: '合同内部编码',
  dataIndex: 'internalNo',
  fixed: 'left',
  width: 100,
  render: (text, record, index) => (<a  href="javascript:;" onClick={()=>this.showModals(record)}>{text}</a>),
}, {
  title: '项目编码',
  dataIndex: 'projectNo',
  fixed: 'left',
  width: 100,
  render: (text, record, index) => (<a  href="javascript:;" onClick={()=>this.showModals(record)}>{text}</a>),
}, {
  title: '合同名称',
  dataIndex: 'contractName',
  width: 600,
}, {
  title: '合同编码',
  dataIndex: 'contractNo',
  width: 200,
}, {
  title: '合同金额',
  dataIndex: 'contractAmount',
  width: 100,
  render: (text, record, index) => (text ? currency(text) : 0),
}, {
  title: '签约日期',
  dataIndex: 'contractDate',
  width: 90,
}, {
  title: 'Sale签约BU',
  dataIndex: 'salesBuNo',
  width: 100,
  render:(text,record,index)=>(text ? (record.salesBuNoName ? `${text}:${record.salesBuNoName}` : text) : ''),
}, {
  title: '立项BU',
  dataIndex: 'projectBuNo',
  width: 80,
  render:(text,record,index)=>(text ? (record.projectBuNoName ? `${text}:${record.projectBuNoName}` : text) : ''),
}, {
  title: '销售人员',
  dataIndex: 'salesPerson',
  width: 80,
}, {
  title: '合同生效日',
  dataIndex: 'contractActiveDate',
  width: 100,
}, {
  title: '合同种类',
  dataIndex: 'contractType',
  width: 120,
}, {
  title: '币种',
  dataIndex: 'contractCurrency',
  width: 50,
},
]
export default class ApplySearchCon extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      contarctSplitModal: false,
      splitStatus: true,
      selectedRowKeys: '',
      selectedRows: '',
      test:false,
      ERPModal:false,
      sendErpDataSource:[]
    }
  }

  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div147.5-按钮56-翻页160
    const tableHeight = screenHeight - 8 - 12 - 147.5 - 56 - 160
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.contractSplitDara.myContractRefresh !== nextProps.contractSplitDara.myContractRefresh) {
      this.handleQuery()
    }
  }

  componentDidMount() {
    // this.handleQuery()
  }
  queryParam = {
    contractDateStart: '',
    contractDateEnd: '',
    projectNo: '',
    contractNo: '',
    contractName: '',
    projectBuNo: '',
    salesBuNo: '',
    status: '',
    operator: '',
  }
   /* sendERPQueryParam = {
    signDateStart:'',
    signDateEnd:'',
    buId:'',
    isReport:'N',
    projectNo:'',
    contractNo:'',
    contractName:'',
    isProdect:'ALL',
    erpStatus:'ALL',
    signCompany:'',
  }*/
  handleQuery = () => {
    this.setState({
      loading: true,
    })
    this.props.getContractList(this.queryParam).then((res) => {
      this.setState({
        loading: false,
      })
      if (res && res.response && res.response.resultCode === '000000') {
      } else {
        message.error('加载数据失败')
      }
    })
  }
  // 获取tablewidth
  getTableWidth = (columns) => {
    let width = 0
    columns.map((item,index)=>{
      width += parseFloat(item.width)
    })
    return width
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
    this.setState({
      selectedRowKeys:selectedRowKeys,
      selectedRows:selectedRows,
    })
  }
 /* saveContractSplitInfo = (param,projectNo) => {
    this.props.saveContractSplitInfo(param).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('保存成功')
        const data = res.response.result[0]
        console.log('data',data)
        data.orderListLines.map((item)=>{
          item.opsStatus = "modify"
         })
        console.log('data1',data)
        this.setState({
          selectedRows:data
        })
        //this.getInfo(projectNo)
      } else {
        message.error('保存失败')
      }
    })

  }*/
  closeSaveModal = () => {
    this.setState({
      contarctSplitModal: true,
      applyData: '',
      selectedRowKeys: '',
      selectedRows: '',
    })
  }
  showModals = (record) =>{
    if(record.orderListLines){
      record.orderListLines.map(item=>{
        item.opsStatus = 'modify'
      })
    }
    this.setState({
      selectedRows:record,
    })
    this.showContractSplitInfo(record.contractId)
}
  /*
   function closeModalClaim
   关闭详情modal
   */
  closeModalClaim = () => {
    this.setState({
      contarctSplitModal: false,
      applyData: '',
      selectedRowKeys: '',
      selectedRows: '',
    })
    this.handleQuery()
  }
  /*
   function contractSplitInfo
   */
  showContractSplitInfo = (contractId) => {
    /*if(this.state.selectedRowKeys.length>1){
      message.error('一次只能对一条数据进行拆分')
      return
    }
    if(this.state.selectedRowKeys.length==0){
      message.error('请选择需要拆分的数据')
      return
    }*/
    // 获取审批表url
    //const contractId = 201604296622
    this.props.getUrl(contractId).then((res)=>{
      if (res && res.response && res.response.resultCode === '000000') {
      } else {
        message.error('获取审批列表链接失败')
      }
    })
    this.setState({
      contarctSplitModal: true,
    })
  }
  testClose = () => {
    this.setState({
      test: false
    })
  }
  showERPModal = () => {
    this.setState({
      ERPModal: true
    })
  }
  closeERPModal = () => {
    this.setState({
      ERPModal: false
    })
  }
  // 传送ERP
 /* queryParmsErp = (parmas) => {
    this.props.sendERP(parmas).then((res)=>{
      if (res && res.response && res.response.resultCode === '000000') {
        message.success(res.response.data.description)
      } else {
      }
    })
  }*/
  // 传送ERP查询接口
  sendERPQuery = (parmas) => {
    this.props.getContractStatementList(parmas).then((res)=>{
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          sendErpDataSource:res.response.pageInfo
        })
      } else {
        message.error('获取审批列表链接失败')
      }
    })
  }
  //重新获取去数据
  getInfo = (projectNo) => {
    const queryParam = {}
    queryParam.projectNo = projectNo
    queryParam.status = 'Y'
    this.props.getContractList(queryParam).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        console.log(res.response.pageInfo.result[0])
        this.showModals(res.response.pageInfo.result[0])
      }
    })
  }

  render() {
    const columns = [{
      title: '拆分状态',
      dataIndex: 'status',
      width: 80,
      textAlign: 'center',
      fixed: 'left',
      render: (text, record, index) => (text=='N' ? "未拆分合同" : "已拆分合同"),
    }, {
      title: '合同内部编码',
      dataIndex: 'internalNo',
      width: 100,
      fixed: 'left',
      render: (text, record, index) => (<a  href="javascript:;" onClick={()=>this.showModals(record)}>{text}</a>),
    }, {
      title: '项目编码',
      dataIndex: 'projectNo',
      width: 100,
      fixed: 'left',
      render: (text, record, index) => (<a  href="javascript:;" onClick={()=>this.showModals(record)}>{text}</a>),
    }, {
      title: '合同名称',
      dataIndex: 'contractName',
      width: 600,
    }, {
      title: '合同编码',
      dataIndex: 'contractNo',
      width: 200,
    }, {
      title: '合同金额',
      dataIndex: 'contractAmount',
      width: 100,
      render: (text, record, index) => (text ? currency(text) : 0),
    }, {
      title: '签约日期',
      dataIndex: 'contractDate',
      width: 90,
    }, {
      title: 'Sale签约BU',
      dataIndex: 'salesBuNo',
      width: 100,
      render:(text,record,index)=>(text ? (record.salesBuNoName ? `${text}:${record.salesBuNoName}` : text) : ''),
    }, {
      title: '立项BU',
      dataIndex: 'projectBuNo',
      width: 80,
      render:(text,record,index)=>(text ? (record.projectBuNoName ? `${text}:${record.projectBuNoName}` : text) : ''),
    }, {
      title: '销售人员',
      dataIndex: 'salesPerson',
      width: 80,
    }, {
      title: '合同生效日',
      dataIndex: 'contractActiveDate',
      width: 100,
    }, {
      title: '合同种类',
      dataIndex: 'contractType',
      width: 120,
    }, {
      title: '币种',
      dataIndex: 'contractCurrency',
      width: 50,
    },
      {
        title: '是否复算项目',
        dataIndex: 'recalculate',
        width: 100,
      },
    ]
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      onChange: this.onSelectChange,
    }
    const pagination = {
      current: this.props.contractSplitDara.getContractList.pageNo,
      total: this.props.contractSplitDara.getContractList.count,
      pageSize: this.props.contractSplitDara.getContractList.pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,

    }
    return (
      <div>
        <ContractSplitWithFrom onQuery={this.handleChangeParam} />
        <div className="split"></div>
        {/*<Button type="primary" onClick={this.showContractSplitInfo} disabled={this.state.selectedRowKeys.length>0 ? false : true}>合同拆分</Button>
        <div className="split"></div>*/}
        {
          this.state.contarctSplitModal ?
            <ContractSplitModal
              getInfo = {this.getInfo}
              closeModal={this.closeModalClaim}
              saveInfo={this.props.saveContractSplitInfo}
              data={this.state.selectedRows}
              user={this.props.user.accountName}
              contractUrl={this.props.contractSplitDara.getUrl}
              tableDetail={this.state.selectedRows.orderListLines ? this.state.selectedRows.orderListLines : []}
            /> : null
        }

        <Button type='primary' onClick={this.showERPModal}>传送ERP</Button>
        <Row>
          <Col span={24} style={{textAlign:'right'}}>
            共{this.props.contractSplitDara.getContractList.result.length}条记录
          </Col>
        </Row>
        <Table
          rowKey="contractId"
          pagination={false}
          bordered
          columns={columns}
          size="middle"
          scroll={{ x: this.getTableWidth(columns), y: this.state.tableHeight }}
          loading={this.state.loading}
          dataSource={this.props.contractSplitDara.getContractList.result}
        />
        {this.state.ERPModal ?
          <ERPModals
            sendERPQuery={this.sendERPQuery}
            sendERPParms = {this.props.sendERP}
            closeERPModal = {this.closeERPModal}
            dataSource = {this.state.sendErpDataSource}
          />
          : null
        }
      </div>
    )
  }
}
