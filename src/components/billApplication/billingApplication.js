import React from 'react'
import BillingApplyForm from './billingApplyForm'
import BillDetail from './billDetail'
import BillUpdate from './billUpdate'
import OtherContractAdd from './otherContractAdd'
import BigSignAudit from '../../containers/billApplication/bigSignAudit'
import { Table, Button, message, Modal } from 'antd'
import { otherTypes, advanceTypes, redTypes, redFontCols, normalTypes } from './billColumns'
import './billingApplication.less'
const confirm = Modal.confirm

export default class BillingApplication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentType: 'BILLING_CONTRACT',
      updateVisible: false,
      otherAddVisible: false,
      selectedRows: [],
      selectedRowKeys: [],
      isAdd: false,
      currentRecord: {},
      showBillApprove: false,
      queryParam: {
        arDateStart: '',
        arDateEnd: '',
        companyName: '',
        custName: '',
        projectNos: [],
        contractNos: [],
        invoiceNumbers: [],
        paymentName: '',
        billingApplicationType: 'BILLING_CONTRACT',
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.billList !== nextProps.billList && nextProps.billList) {
      this.setState({
        selectedRows: nextProps.billList.slice(0, 1),
        selectedRowKeys: [0],
      })
    }
    if(this.props.updateSuccess !== nextProps.updateSuccess && nextProps.updateSuccess) {
      message.success('申请信息修改成功!')
      this.setState({
        updateVisible: false,
        otherAddVisible: false,
        currentRecord: {},
      })
      this.getInitQuery()
    } else if(this.props.addSuccess !== nextProps.addSuccess && nextProps.addSuccess) {
      message.success('申请信息添加成功!')
      this.setState({
        updateVisible: false,
        otherAddVisible: false,
        currentRecord: {},
        selectedRowKeys: [0],
      })
      this.getInitQuery()
    } else if(this.props.redApplySuccess != nextProps.redApplySuccess && nextProps.redApplySuccess) {
      message.success('发票红冲成功!')
    } else if(this.props.billSaveSuccess !== nextProps.billSaveSuccess && nextProps.billSaveSuccess) {
      message.success('申请开票成功!')
      this.getInitQuery()
    } else if(nextProps.failureMsg !== '') {
      message.error(nextProps.failureMsg)
    }
  }

  getInitQuery = () => {
    this.props.billApplySearch(this.state.queryParam)
  }

  setQueryParams = (param) => {
    this.setState({
      queryParam: param,
    })
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
      }, {
        title: '合同编码',
        dataIndex: 'contractNo',
        width: 260,
      }, {
        title: '合同名称',
        dataIndex: 'contractName',
        width: 260,
      }, {
        title: '客户名称',
        dataIndex: 'custName',
        width: 220,
      }, {
        title: '付款条件',
        dataIndex: 'paymentTerm',
        width: 100,
      }, {
        title: '款项名称',
        dataIndex: 'paymentName',
        width: 100,
      }, {
        title: '付款阶段',
        dataIndex: 'paymentPhrases',
        width: 170,
      }, {
        title: '款项金额',
        dataIndex: 'paymentAmount',
        width: 100,
      }, {
        title: '已开票金额',
        dataIndex: 'outcomeAmount',
        width: 80,
      }, {
        title: '已申请金额',
        dataIndex: 'applyIngAmount',
        width: 120,
      }, {
        title: '可申请金额',
        dataIndex: 'applyUseAmount',
        width: 100,
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
        title: 'SBU',
        dataIndex: 'sbuName',
        width: 110,
      }, {
        title: '区域',
        dataIndex: 'region',
        width: 100,
      }, {
        title: '省份',
        dataIndex: 'province',
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
                 currentRecord: record,
                 isAdd: false,
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
        width: 180,
        fixed: 'left',
      }, {
        title: '签约公司',
        dataIndex: 'comName',
        width: 240,
      }, {
        title: '客户名称',
        dataIndex: 'custName',
        width: 270,
      }, {
        title: '已申请金额',
        dataIndex: 'applyIngAmount',
        width: 120,
      }, {
        title: '已开票金额',
        dataIndex: 'outcomeAmount',
        width: 120,
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
        fixed: 'right',
        render: (text, record) => (
          <a href="#"
             onClick={() => {
               this.setState({
                 updateVisible: true,
                 currentRecord: record,
                 isAdd: false,
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
        title: '已申请金额',
        dataIndex: 'applyIngAmount',
        width: 100,
      }, {
        title: '已开票金额',
        dataIndex: 'outcomeAmount',
        width: 100,
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
                 currentRecord: record,
                 isAdd: false,
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
    } else {
      return normalCols
    }
  }

  handleBilling = () => {
    if(this.state.selectedRows.length === 0) {
      message.warn('请选择要开票的记录!')
      return
    }
    const _this = this
    if(normalTypes.includes(this.state.currentType)) {
      let content = ''
      this.state.selectedRows.map(s => {
        if(s.applyUseAmount > 0) {
          content += `项目编码【${s.projectNo}】的款项已申请${s.applyIngAmount}元发票，还可正常申请${s.applyUseAmount}元，是否继续申请?\n`
        } else {
          content += `项目编码【${s.projectNo}】已开票申请完成，是否再次申请?`
        }
      })
      confirm({
        title: '提示',
        content: content,
        onOk() {
          _this.billingSubmit()
        }
      })
    } else {
      this.billingSubmit()
    }
  }

  billingSubmit = () => {
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
    const contractId = this.state.selectedRows ? this.state.selectedRows[0].contractId : ''
    this.props.billApplyEdit(param)
    this.props.getContractUrl(contractId)
  }

  handleAddBill = () => {
    this.setState({
      updateVisible: true,
      isAdd: true,
    })
  }

  billRedApply = () => {
    if(this.state.selectedRows.length === 0) {
      message.warn('请选择要退票的记录!')
      return
    }
    this.props.getRedApplyDetail(this.state.selectedRows.map(s => s.billingOutcomeId)).then(res => {
      const { resultCode } = res.response
      if(resultCode === '000000') {
        this.setState({
          showRedApply: true,
        })
      }
    })
  }

  searchContractBill = () => {
    this.setState({showBillApprove: true})
  }

  getBillBtns = () => {
    const type = this.state.currentType
    if (normalTypes.includes(type)) {
      return (
        <div>
          <Button type="primary" ghost onClick={() => this.handleBilling()}>开票</Button>
          <Button type="primary" onClick={() => this.searchContractBill()}>开票审核</Button>
        </div>
      )
    } else if (advanceTypes.includes(type)) {
      return (
        <div>
          <Button type="primary" ghost onClick={() => this.handleAddBill()}>增加</Button>
          <Button type="primary" ghost onClick={() => this.handleBilling()}>开票</Button>
        </div>
      )
    } else if (redTypes.includes(type)) {
      return (
        <div>
          <Button type="primary" ghost onClick={() => this.billRedApply()}>退票</Button>
        </div>
      )
    } else if (otherTypes.includes(type)) {
      return (
        <div>
          <Button type="primary" ghost onClick={() => this.setState({otherAddVisible: true, isAdd: true})}>增加</Button>
          <Button type="primary" ghost onClick={() => this.handleBilling()}>开票</Button>
        </div>
      )
    }
  }

  getScrollWidth() {
    let scroll = null
    if(normalTypes.includes(this.state.currentType)){
      scroll = { x: 2760 }
    } else if (redTypes.includes(this.state.currentType)) {
      scroll = { x: 1800 }
    } else if (advanceTypes.includes(this.state.currentType)) {
      scroll = { x: 1640 }
    } else {
      scroll = {}
    }
    return scroll
  }

  render() {
    const { billList, updateBillInfo, isLoading, addBillUnContract, addOtherContract, getTaxInfo,
      editInfo, billApplySave, billApplyCheck, currentUser, contractUrl, redApplyDetail, billApplicationRedApply } = this.props
    const rowSelection = {
      type: normalTypes.includes(this.state.currentType) || redTypes.includes(this.state.currentType)? 'checkbox' : 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        })
      },
      selectedRowKeys: this.state.selectedRowKeys,
    }
    const { isAdd, updateVisible, otherAddVisible, showBillApprove, showRedApply } = this.state
    return (
      <div>
        <BillingApplyForm
          getApplyChange={value => this.getApplyChange(value)}
          onQuery={this.props.billApplySearch}
          setQueryParams={this.setQueryParams}
        />
        <div className="form-btns">
          {this.getBillBtns()}
        </div>
        <Table
          loading={isLoading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          bordered
          columns={this.getApplyColumns()}
          dataSource={billList}
          scroll={this.getScrollWidth()}
        />
        {this.props.searchEditSuccess || this.props.showRedApply ?
          <BillDetail
            onCancel={() => this.props.hideDetailModal()}
            detail={redTypes.includes(this.state.currentType) ? redApplyDetail : editInfo}
            billType={this.state.selectedRows[0].billingApplicationType}
            billApplySave={redTypes.includes(this.state.currentType) ? billApplicationRedApply : billApplySave}
            getTaxInfo={getTaxInfo}
            currentUser={currentUser}
            contractUrl={contractUrl}
            isLoading={isLoading}
            isRed={redTypes.includes(this.state.currentType)}
            billingOutcomeIds={this.state.selectedRows.map(s => s.billingOutcomeId)}
          /> : null
        }
        {
          updateVisible ?
            <BillUpdate
              visible={updateVisible}
              onCancel={() => this.setState({updateVisible: false, currentRecord: {}})}
              billAction={isAdd ? addBillUnContract : updateBillInfo}
              record={this.state.currentRecord}
              isAdd={isAdd}
              billType={isAdd ? this.state.currentType : this.state.currentRecord.billingApplicationType}
              isProCodeEdit={normalTypes.includes(this.state.currentType) || this.state.currentType === 'BILLING_UN_CONTRACT_PROJECT'}
            /> : null
        }
        {
          otherAddVisible ?
            <OtherContractAdd
              addAction={isAdd ? addOtherContract : updateBillInfo}
              billType={isAdd ? this.state.currentType : this.state.currentRecord.billingApplicationType}
              visible={otherAddVisible}
              onCancel={() => this.setState({otherAddVisible: false, currentRecord: {}})}
              record={this.state.currentRecord}
              isAdd={isAdd}
            /> : null
        }
        {
          showBillApprove ?
            <BigSignAudit
              onCancel={() => this.setState({showBillApprove: false})}
            /> : null
        }
      </div>
    )
  }
}

