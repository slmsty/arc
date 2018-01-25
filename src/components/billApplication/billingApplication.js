import React from 'react'
import BillingApplyForm from './billingApplyForm'
import BillDetail from './billDetail'
import BillUpdate from './billUpdate'
import OtherContractAdd from './otherContractAdd'
import { Table, Button, message } from 'antd'
import './billingApplication.less'

const advanceCols = [
  {
    title: '开票申请类别',
    dataIndex: 'applyType',
    width: 150,
  }, {
    title: '签约公司',
    dataIndex: 'comName',
    width: 150,
  }, {
    title: '客户名称',
    dataIndex: 'custName',
    width: 150,
  }, {
    title: '项目编码',
    dataIndex: 'projectNo',
    width: 150,
  }, {
    title: '提前开票原因',
    dataIndex: 'advanceBillingReason',
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
    width: 80,
    render: () => <a href="#">修改</a>,
  },
]

const otherCols = [
  {
    title: '开票申请类别',
    dataIndex: 'applyType',
  }, {
    title: '签约公司',
    dataIndex: 'comName',
  }, {
    title: '客户名称',
    dataIndex: 'custName',
  }
]

const normalTypes = ['BILLING_NORMAL', 'BILLING_CONTRACT', 'BILLING_EXCESS']
const advanceTypes = ['BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT']
const redTypes = ['BILLING_RED', 'BILLING_RED_OTHER']
const otherTypes = ['BILLING_OTHER']

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
      arBillingId: '',
      contractItemId: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.updateSuccess !== nextProps.updateSuccess && nextProps.updateSuccess) {
      message.success('申请信息修改成功!')
      this.setState({updateVisible: false})
    } else if(this.props.addSuccess !== nextProps.addSuccess && nextProps.addSuccess) {
      message.success('申请信息添加成功!')
      this.setState({
        updateVisible: false,
        otherAddVisible: false,
      })
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
    } else if(this.props.redApplySuccess != nextProps.redApplySuccess && nextProps.redApplySuccess) {
      message.success('发票红冲成功!')
    }
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
        dataIndex: 'applyType',
        width: 100,
      }, {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 150,
      }, {
        title: '签约公司',
        dataIndex: 'comName',
        width: 150,
      },  {
        title: '合同编码',
        dataIndex: 'contractNo',
        width: 150,
      }, {
        title: '发票号',
        dataIndex: 'invoiceNumber',
        width: 100,
      }, {
        title: '客户名称',
        dataIndex: 'custName',
        width: 100,
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
        width: 100,
      }, {
        title: '付款金额',
        dataIndex: 'billedArAmount',
        width: 100,
      }, {
        title: '已开票金额',
        dataIndex: 'alreadyBillingAmount',
        width: 100,
      }, {
        title: '提前开票原因',
        dataIndex: 'advanceBillingReason',
        width: 100,
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
        render: (text, record) => (
          <a href="#"
             onClick={() => {
               this.setState({
                 updateVisible: true,
                 arBillingId: record.arBillingId,
                 contractItemId: record.contractItemId,
               })}
             }
          >修改</a>
        )
      },
    ]
    const redFontCols = [
      {
        title: '开票申请类别',
        dataIndex: 'billingApplicationTypeName',
        width: 100,
      }, {
        title: '发票号',
        dataIndex: 'invoiceNumber',
        width: 150,
      }, {
        title: '开票金额',
        dataIndex: 'taxIncludeAmount',
        width: 100,
      }, {
        title: '开票税额',
        dataIndex: 'taxAmount',
        width: 100,
      }, {
        title: '开票税率',
        dataIndex: 'taxRate',
        width: 100,
        render: (text) => {
          return `${text * 100}%`
        }
      }, {
        title: '项目编码',
        dataIndex: 'projectNo',
        width: 150,
      }, {
        title: '签约公司',
        dataIndex: 'comName',
        width: 150,
      }, {
        title: '合同编码',
        dataIndex: 'contractNo',
        width: 150,
      }, {
        title: '客户名称',
        dataIndex: 'custName',
        width: 150,
      }, {
        title: '付款条款',
        dataIndex: 'paymentName',
        width: 150,
      }, {
        title: '付款阶段',
        dataIndex: 'paymentPhrases',
        width: 100,
      }, {
        title: '付款金额',
        dataIndex: 'billedArAmount',
        width: 100,
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
          <Button type="primary" ghost onClick={() => this.setState({otherAddVisible: true})}>增加</Button>
          <Button type="primary" ghost onClick={() => this.setState({otherAddVisible: true})}>开票编辑</Button>
        </div>
      )
    }
  }

  render() {
    const { billList, updateBillInfo, isLoading, addBillUnContract, addOtherContract, editInfo, billApplySave } = this.props
    const rowSelection = {
      type: redTypes.includes(this.state.currentType) ? 'radio' : 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        this.setState({selectedRows: selectedRows})
      }
    }
    const { isAdd, arBillingId, contractItemId, updateVisible, otherAddVisible } = this.state
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
          rowKey="receiptClaimId"
          rowSelection={rowSelection}
          bordered
          columns={this.getApplyColumns()}
          dataSource={billList}
        />
        {this.state.detailVisible ?
          <BillDetail
            onCancel={() => this.setState({detailVisible: false})}
            detail={editInfo}
            billType={this.state.currentType}
            billApplySave={billApplySave}
          /> : null
        }
        <BillUpdate
          visible={updateVisible}
          onCancel={() => this.setState({updateVisible: false})}
          billAction={isAdd ? addBillUnContract : updateBillInfo}
          arBillingId={arBillingId}
          contractItemId={contractItemId}
          isAdd={isAdd}
        />
        <OtherContractAdd
          addAction={addOtherContract}
          billType={this.state.currentType}
          visible={otherAddVisible}
          onCancel={() => this.setState({otherAddVisible: false})}
        />
      </div>
    )
  }
}

