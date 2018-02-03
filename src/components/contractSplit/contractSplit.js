/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, message, Row, Col } from 'antd'
import ContractSplitWithFrom from './contractSplitWithFrom'
import ContractSplitModal  from './contractSplitModal'
import currency from '../../util/currency'
export default class ApplySearchCon extends React.Component {
  state = {
    loading: false,
    contarctSplitModal: false,
    splitStatus: true,
    selectedRowKeys: '',
    selectedRows: '',
    contractInfo:'',
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
    projectNos: '',
    contractNos: '',
    contractName: '',
    projectBuNo: '',
    salesBuNo: '',
    status: '',
    operator: '',
  }
  handleQuery = () => {
    this.setState({
      loading: true,
      selectedRowKeys: '',
      selectedRows: '',
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
      contractInfo:selectedRows,
    })
  }
  saveContractSplitInfo = (param) => {
    this.props.saveContractSplitInfo(param).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('保存成功')
        this.closeModalClaim()
      } else {
        message.error('保存失败')
      }
    })

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
  }
  /*
   function contractSplitInfo
   */
  showContractSplitInfo = () => {
    if(this.state.selectedRowKeys.length>1){
      message.error('一次只能对一条数据进行拆分')
      return
    }
    if(this.state.selectedRowKeys.length==0){
      message.error('请选择需要拆分的数据')
      return
    }
    console.log(4)
    // 获取审批表url
    const contractId = this.state.selectedRows[0].contractId
    //const contractId = 201604296622
    console.log('contractId',contractId)
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
  render() {
    console.log('parent',this.state.selectedRows)
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
    }, {
      title: '项目编码',
      dataIndex: 'projectNo',
      width: 100,
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
      render:(text,record,index)=>(text ? `${text}:${record.salesBuNoName}` : ''),
    }, {
      title: '立项BU',
      dataIndex: 'projectBuNo',
      width: 80,
      render:(text,record,index)=>(text ? `${text}:${record.projectBuNoName}` : ''),
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
    console.log('seletctDATA',this.state.contractInfo)
    return (
      <div>
        <ContractSplitWithFrom onQuery={this.handleChangeParam} />
        <br /><br />
        <Button type="primary" onClick={this.showContractSplitInfo} disabled={this.state.selectedRowKeys.length>0 ? false : true}>合同拆分</Button>
        <br /><br />
        {
          this.state.selectedRows && this.state.selectedRows[0] && this.state.contarctSplitModal ?
            <ContractSplitModal
              closeModal={this.closeModalClaim}
              saveInfo={this.saveContractSplitInfo}
              data={this.state.contractInfo}
              contractInfo={this.state.contractInfo[0]}
              user={this.props.user.accountName}
              contractUrl={this.props.contractSplitDara.getUrl}
              tableDetail={this.state.selectedRows[0].orderListLines ? this.state.selectedRows[0].orderListLines : []}
            /> : null
        }
        <Row>
          <Col span={24} style={{textAlign:'right'}}>
            共{this.props.contractSplitDara.getContractList.result.length}条记录
          </Col>
        </Row>
        <Table
          rowKey="contractId"
          rowSelection={rowSelection}
          pagination={false}
          bordered
          columns={columns}
          size="middle"
          scroll={{ x: '1800', y: this.state.tableHeight }}
          loading={this.state.loading}
          dataSource={this.props.contractSplitDara.getContractList.result}
        />
      </div>
    )
  }
}
ApplySearchCon.propTypes = {
  getContractList: PropTypes.func.isRequired,
  saveContractSplitInfo: PropTypes.func.isRequired,
  contactSplitData: PropTypes.shape({
    myContractRefresh: PropTypes.number.isRequired,
    getContractList:PropTypes.object.isRequired,
  }).isRequired,
}
