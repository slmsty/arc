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
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div147.5-按钮56-翻页160
    const tableHeight = screenHeight - 8 - 12 - 147.5 - 56 - 160
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    /*if (this.props.contractSplitDara.myContractRefresh !== nextProps.contractSplitDara.myContractRefresh) {
      this.handleQuery()
    }*/
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
    })
  }
  saveContractSplitInfo = (param) => {
    this.props.saveContractSplitInfo(param).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
      } else {
        message.error('保存失败')
      }
    })
    this.closeModalClaim()
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
    console.log('length',this.state.selectedRowKeys.length)
    if(this.state.selectedRowKeys.length>1){
      message.error('一次只能对一条数据进行拆分')
      return
    }
    if(this.state.selectedRowKeys.length==0){
      message.error('请选择需要拆分的数据')
      return
    }
    this.setState({
      contarctSplitModal: true,
    })
  }
  render() {
    const columns = [{
      title: '拆分状态',
      dataIndex: 'status',
      width: 150,
      textAlign: 'center',
      fixed: 'left',
      render: (text, record, index) => (text=='N' ? "未拆分合同" : "已拆分合同"),
    }, {
      title: '合同内部编码',
      dataIndex: 'internalNo',
      width: 200,
    }, {
      title: '项目编码',
      dataIndex: 'projectNo',
      width: 150,
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
      width: 150,
      render: (text, record, index) => (text ? currency(text) : 0),
    }, {
      title: '签约日期',
      dataIndex: 'contractDate',
      width: 150,
    }, {
      title: 'Sale签约BU',
      dataIndex: 'salesBuNo',
      width: 100,
    }, {
      title: '立项BU',
      dataIndex: 'projectBuNo',
      width: 150,
    }, {
      title: '销售人员',
      dataIndex: 'salesPerson',
      width: 150,
    }, {
      title: '合同生效日',
      dataIndex: 'contractActiveDate',
      width: 150,
    }, {
      title: '合同种类',
      dataIndex: 'contractType',
      width: 150,
    }, {
      title: '币种',
      dataIndex: 'contractCurrency',
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
        <br /><br />
        <Button type="primary" onClick={this.showContractSplitInfo} disabled={this.state.selectedRowKeys.length>0 ? false : true}>合同拆分</Button>
        <br /><br />
        {
          this.state.selectedRows && this.state.selectedRows[0] ?
            <ContractSplitModal
              ModalVisible={this.state.contarctSplitModal}
              closeModal={this.closeModalClaim}
              saveInfo={this.saveContractSplitInfo}
              data={this.state.selectedRows}
            />
            : ''
        }
        <Row>
          <Col span={24} style={{textAlign:'right'}}>
            共{this.props.contractSplitDara.getContractList.result.length}条记录
          </Col>
        </Row>
        <Table
          rowKey="contractId"
          rowSelection={rowSelection}
          pagination={pagination}
          bordered
          columns={columns}
          size="middle"
          scroll={{ x: '2400px', y: this.state.tableHeight }}
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
