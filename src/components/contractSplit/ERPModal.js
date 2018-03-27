/**
 * Created by liangshuang on 17/12/12.
 */
/**
 * Created by liangshuang on 17/12/8.
 */
import React from 'react'
import ErpFrom from './ERPWithFrom'
import currency from '../../util/currency'
//import { constructSplitSearchColumns } from '../statementSearch/statementColumns'
import { Table,Modal,Button } from 'antd'

class ERPModal extends React.Component{
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
  }
  getTableWidth = (colum)=> {
    let width = 0
    colum.map((item,idnex)=>{
      width += parseFloat(item.width)
    })
    return width
  }
  // 查询接口
  queryParms = (param) => {
    this.queryParam = {...this.queryParam,...param}
    this.props.sendERPQuery(this.queryParam)
  }
  // 传送ERP接口
  sendERP = () => {
    console.log(this.state.selectedRows)
    //this.props.queryParms(param)
  }
  // 页码修改
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.queryParms()
  }
  // 每页显示修改
  handleChangeSize = (current, size) => {
    this.queryParam.pageInfo.pageNo = current
    this.queryParam.pageInfo.pageSize = size
    this.queryParms()
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  render() {
    console.log('this.props.dataSource.count',this.props.dataSource.count)
    const constructSplitSearchColumns = [
      {
        title: '合同编码',
        dataIndex: 'contractNo',
        fixed: 'left',
        width: 150,
      },
      {
        title: '项目编码',
        dataIndex: 'projectNo',
        fixed: 'left',
        width: 120,
      },
      {
        title: '传ERP状态',
        dataIndex: 'erpStatus',
        width: 80,
      },
      {
        title: '错误原因',
        dataIndex: 'erpResult',
        width: 100,
      },
      {
      title: '合同名称',
      dataIndex: 'contractName',
      width: 400,
    },  {
      title: '立项BU',
      dataIndex: 'BUid',
      width: 80,
    },

      {
        title: '合同税率',
        dataIndex: 'contractTaxRate',
        width: 70,
      },
      {
        title: '退税率',
        dataIndex: 'returnTaxRate',
        width: 70,
      },
      {
        title: 'Task',
        dataIndex: 'contractCategory',
        width: 120,
      },
      {
        title: '合同额',
        dataIndex: 'contractAmount',
        width: 100,
        render: (text,rocord,index)=>(text ? currency(text) : currency(0))
      },
      {
        title: 'Gross order',
        dataIndex: 'grossOrder',
        width: 100,
        render: (text,rocord,index)=>(text ? currency(text) : currency(0))
      },
      {
        title: '结算方式',
        dataIndex: 'revenueCheckout',
        width: 100,
      },
      {
        title: '签约公司',
        dataIndex: 'signCompany',
        width: 220,
      }, {
        title: '签约日期',
        dataIndex: 'signDate',
        width: 120,
      },
      {
        title: '客户名称',
        dataIndex: 'custName',
        width: 80,
      },

    ]
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      onChange: this.onSelectChange,
    }
    const pagination = {
      current: this.props.dataSource.pageNo,
      total: this.props.dataSource.count,
      pageSize: this.props.dataSource.pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,
    }
    return (
      <div style={{width:'100%',minHeight:'500px'}}>
        <Modal
          wrapClassName="erpModal"
          width={1024}
          visible={true}
          onOk={this.props.closeERPModal}
          onCancel={this.props.closeERPModal}
          title=""
          footer={null}
        >
          <ErpFrom queryParms={this.queryParms}/>
          <Button type="primary" onClick={this.sendERP}>传送ERP</Button>
          <div className="split"></div>
          <Table
            rowSelection={rowSelection}
            pagination={pagination}
            bordered
            columns={constructSplitSearchColumns}
            size="middle"
            scroll={{ x: this.getTableWidth(constructSplitSearchColumns),y:'200px' }}
            /*loading={this.state.loading}*/
            dataSource={this.props.dataSource.result}
          />
        </Modal>

      </div>
    )
  }
}

export default ERPModal
