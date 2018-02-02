import React from 'react'
import BillingApplyForm from './billingApplyForm'
import BillDetail from './billDetail'
import BillUpdate from './billUpdate'
import OtherContractAdd from './otherContractAdd'
import { Table, Button, message } from 'antd'
import { otherTypes, advanceTypes, redTypes, redFontCols, normalTypes } from './billColumns'
import './billingApplication.less'

export default class BillingApplication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentType: 'BILLING_NORMAL',
      detailVisible: false,
      updateVisible: false,
      otherAddVisible: false,
      selectedRows: [],
      isAdd: false,
      currentRecord: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.updateSuccess !== nextProps.updateSuccess && nextProps.updateSuccess) {
      message.success('申请信息修改成功!')
      this.setState({
        updateVisible: false,
        otherAddVisible: false,
        selectedRows: [],
        currentRecord: {},
      })
      this.getInitQuery()
    } else if(this.props.addSuccess !== nextProps.addSuccess && nextProps.addSuccess) {
      message.success('申请信息添加成功!')
      this.setState({
        updateVisible: false,
        otherAddVisible: false,
      })
      this.getInitQuery()
    } else if(this.props.redApplySuccess != nextProps.redApplySuccess && nextProps.redApplySuccess) {
      message.success('发票红冲成功!')
    } else if(this.props.billSaveSuccess !== nextProps.billSaveSuccess && nextProps.billSaveSuccess) {
      message.success('申请开票成功!')
      this.setState({
        detailVisible: false,
      })
    }
  }

  getInitQuery = () => {
    const params = {
      arDateStart: '',
      arDateEnd: '',
      companyName: '',
      custName: '',
      projectNos: [],
      contractNos: [],
      invoiceNumbers: [],
      paymentName: '',
      billingApplicationType: this.state.currentType,
    }
    this.props.billApplySearch(params)
  }

  getApplyChange = (value) => {
    this.props.initData()
    this.setState({
      currentType: value,
    })
  }

  getApplyColumns = () => {
    const type = this.state.currentType
    const normalCols = [
      {
        title: '开票申请类别',
        dataIndex: 'billingApplicationTypeName',
        width: 130,
        fixed: 'left',
      }, {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 150,
        fixed: 'left',
      }, {
        title: '签约公司',
        dataIndex: 'comName',
        width: 220,
      },  {
        title: '合同编码',
        dataIndex: 'contractNo',
        width: 260,
      }, {
        title: '发票号',
        dataIndex: 'invoiceNumber',
        width: 100,
      }, {
        title: '客户名称',
        dataIndex: 'custName',
        width: 220,
      }, {
        title: '付款条件',
        dataIndex: 'paymentTerm',
        width: 100,
      }, {
        title: '付款条款',
        dataIndex: 'paymentName',
        width: 100,
      }, {
        title: '付款阶段',
        dataIndex: 'paymentPhrases',
        width: 170,
      }, {
        title: '付款金额',
        dataIndex: 'billedArAmount',
        width: 100,
      }, {
        title: '已开票金额',
        dataIndex: 'alreadyBillingAmount',
        width: 80,
      }, {
        title: '提前开票原因',
        dataIndex: 'advanceBillingReasonName',
        width: 130,
      }, {
        title: '预计回款日期',
        dataIndex: 'receiptReturnDate',
        width: 100,
      }, {
        title: '提前开票备注',
        dataIndex: 'advanceBillingRemark',
        width: 100,
      }, {
        title: '操作',
        dataIndex: 'action',
        width: 80,
        fixed: 'right',
        render: (text, record) => (
          <a href="#"
             onClick={() => {
               this.setState({
                 updateVisible: true,
                 currentRecord: record
               })}
             }
          >修改</a>
        )
      },
    ]
    const advanceCols = [
      {
        title: '开票申请类别',
        dataIndex: 'billingApplicationTypeName',
        width: 120,
      }, {
        title: '签约公司',
        dataIndex: 'comName',
        width: 150,
      }, {
        title: '客户名称',
        dataIndex: 'custName',
        width: 220,
      }, {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 150,
      }, {
        title: '币种',
        dataIndex: 'contractCurrency',
        width: 100,
      }, {
        title: '提前开票原因',
        dataIndex: 'advanceBillingReasonName',
        width: 150,
      }, {
        title: '预计回款日期',
        dataIndex: 'receiptReturnDate',
        width: 100,
      }, {
        title: '提前开票备注',
        dataIndex: 'advanceBillingRemark',
        width: 150,
      }, {
        title: '操作',
        dataIndex: '',
        width: 70,
        render: (text, record) => (
          <a href="#"
             onClick={() => {
               this.setState({
                 updateVisible: true,
                 currentRecord: record
               })}
             }
          >修改</a>
        ),
      },
    ]
    const otherCols = [
      {
        title: '开票申请类别',
        dataIndex: 'billingApplicationTypeName',
        width: 80
      }, {
        title: '签约公司',
        dataIndex: 'comName',
        width: 200
      }, {
        title: '客户名称',
        dataIndex: 'custName',
        width: 200
      }, {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 130
      }, {
        title: '币种',
        dataIndex: 'contractCurrency',
        width: 90
      }, {
        title: '操作',
        dataIndex: 'action',
        width: 80,
        render: (text, record) => (
          <a href="#"
             onClick={() => {
               this.setState({
                 otherAddVisible: true,
                 currentRecord: record
               })}
             }
          >修改</a>
        )
      }
    ]
    if (normalTypes.includes(type)) {
      return normalCols
    } else if (advanceTypes.includes(type)) {
      return advanceCols
    } else if (redTypes.includes(type)) {
      return redFontCols
    } else if (otherTypes.includes(type)) {
      return otherCols
    }
  }

  handleBilling = () => {
    if(this.state.selectedRows.length === 0) {
      message.warn('请选择要开票的记录!')
      return
    }
    let contractItems = []
    this.state.selectedRows.map(b => {
      contractItems.push({
        arBillingId: b.arBillingId,
        contractItemId: b.contractItemId,
      })
    })
    const param = {
      billingApplicationType: this.state.currentType,
      contractItems,
    }
    this.props.billApplyEdit(param)
    this.setState({detailVisible: true})
  }

  handleAddBill = () => {
    this.setState({
      updateVisible: true,
      isAdd: true,
    })
  }

  billRedApply = () => {
    if(this.state.selectedRows.length === 0) {
      message.warn('请选择要红冲的记录!')
      return
    }
    const params = {
      billingOutcomeId: this.state.selectedRows[0].billingOutcomeId
    }
    this.props.billRedApply(params)
  }

  getBillBtns = () => {
    const type = this.state.currentType
    if (normalTypes.includes(type)) {
      return (
        <Button type="primary" ghost onClick={() => this.handleBilling()}>开票</Button>
      )
    } else if (advanceTypes.includes(type)) {
      return (
        <div>
          <Button type="primary" ghost onClick={() => this.handleAddBill()}>增加</Button>
          <Button type="primary" ghost onClick={() => this.handleBilling()}>开票编辑</Button>
        </div>
      )
    } else if (redTypes.includes(type)) {
      return (
        <div>
          <Button type="primary" ghost onClick={() => this.billRedApply()}>红冲</Button>
          <Button type="primary" ghost onClick={() => this.handleBilling()}>开票编辑</Button>
        </div>
      )
    } else if (otherTypes.includes(type)) {
      return (
        <div>
          <Button type="primary" ghost onClick={() => this.setState({otherAddVisible: true, isAdd: true})}>增加</Button>
          <Button type="primary" ghost onClick={() => this.handleBilling()}>开票编辑</Button>
        </div>
      )
    }
  }

  getScrollWidth() {
    let scroll = null
    if(normalTypes.includes(this.state.currentType)){
      scroll = { x: 2050 }
    } else if (redTypes.includes(this.state.currentType)) {
      scroll = { x: 1840 }
    } else {
      scroll = {}
    }
    return scroll
  }

  render() {
    const { billList, updateBillInfo, isLoading, addBillUnContract, addOtherContract, editInfo, billApplySave } = this.props
    const rowSelection = {
      type: normalTypes.includes(this.state.currentType) ? 'checkbox' : 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows: selectedRows})
      }
    }
    const { isAdd, updateVisible, otherAddVisible } = this.state
    return (
      <div>
        <BillingApplyForm
          getApplyChange={value => this.getApplyChange(value)}
          onQuery={this.props.billApplySearch}
        />
        <div className="form-btns">
          {this.getBillBtns()}
        </div>
        <Table
          loading={isLoading}
          rowKey={record => record.arBillingId ? record.arBillingId : record.billingOutcomeId}
          rowSelection={rowSelection}
          bordered
          columns={this.getApplyColumns()}
          dataSource={billList}
          scroll={this.getScrollWidth()}
        />
        {this.state.detailVisible ?
          <BillDetail
            onCancel={() => this.setState({detailVisible: false})}
            detail={editInfo}
            billType={this.state.currentType}
            billApplySave={billApplySave}
          /> : null
        }
        {
          updateVisible ?
            <BillUpdate
              visible={updateVisible}
              onCancel={() => this.setState({updateVisible: false})}
              billAction={isAdd ? addBillUnContract : updateBillInfo}
              record={this.state.currentRecord}
              isAdd={isAdd}
              billType={this.state.currentType}
              isProCodeEdit={normalTypes.includes(this.state.currentType) || this.state.currentType === 'BILLING_UN_CONTRACT_PROJECT'}
            /> : null
        }
        {
          otherAddVisible ?
            <OtherContractAdd
              addAction={isAdd ? addOtherContract : updateBillInfo}
              billType={this.state.currentType}
              visible={otherAddVisible}
              onCancel={() => this.setState({otherAddVisible: false})}
              record={this.state.currentRecord}
              isAdd={isAdd}
            /> : null
        }
      </div>
    )
  }
}

