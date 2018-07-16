import React from 'react'
import { Table, Button } from 'antd'
import ReceiptApplyForm from './receiptApplyForm'
import ReceiptDetail from './receiptDetail'
import { toThousands }  from '../../../util/currency'
import {getContractUrl} from "../../../actions/billApplication";
const receiptColumns = [{
  title: '项目编码',
  dataIndex: 'projectNo',
  width: 100,
}, {
  title: '合同编码',
  dataIndex: 'contractNo',
  width: 260,
}, {
  title: '合同名称',
  dataIndex: 'contractName',
  width: 350,
}, {
  title: '付款条款',
  dataIndex: 'paymentName',
  width: 80,
}, {
  title: '付款阶段',
  dataIndex: 'paymentPhrases',
  width: 80,
}, {
  title: '款项金额',
  dataIndex: 'paymentAmount',
  width: 100,
  render: (text, record) => record.paymentAmount > 0 ? toThousands(record.paymentAmount) : text
}, {
  title: '实际完成日期',
  dataIndex: 'actualCpDate',
  width: 100,
}, {
  title: '应收日期',
  dataIndex: 'arDate',
  width: 100,
}, {
  title: '应收账款',
  dataIndex: 'oughtReturnMoney',
  width: 100,
  render: (text, record) => record.oughtReturnMoney > 0 ? toThousands(record.oughtReturnMoney) : text
}, {
  title: '申请余额',
  dataIndex: 'applyUseAmount',
  width: 100,
  render: (text, record) => record.applyUseAmount > 0 ? toThousands(record.applyUseAmount) : text
}]
export default class ReceiptApply extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showApplyDetail: false,
      selectedRows: [],
    }
    this.queryParams = {
      arDateStart: '',
      arDateEnd: '',
      companyName: '',
      custName: '',
      projectNos: '',
      contractNos: '',
      paymentName: '',
      province: '',
      region: '',
      sbuNo: '',
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      }
    }
  }

  queryReceiptApply = (params) => {
    if(params) {
      this.queryParams = {
        ...params,
        pageInfo: {
          pageNo: 1,
          pageSize: 10,
        }
      }
    }
    this.props.getReceiptAppList(this.queryParams)
  }

  handleApplyReceipt = () => {
    const { selectedRows } = this.state
    const params = selectedRows.map(item => ({
      fundId: item.fundId,
    }))
    this.props.getReceiptDetail({
      contractItems: params,
    }).then(res => {
      if(res && res.response && res.response.resultCode === '000000') {
        this.setState({
          showApplyDetail: true,
        })
      }
    })
    if(selectedRows.length > 0 && typeof selectedRows[0].contractId !== 'undefined') {
      this.props.getContractUrl(selectedRows[0].contractId)
    }
  }

  handleChangePage = (page) => {
    this.queryParams.pageInfo.pageNo = page
    this.queryReceiptApply()
  }
  handleChangeSize = (current, size) => {
    this.queryParams.pageInfo.pageNo = current
    this.queryParams.pageInfo.pageSize = size
    this.queryReceiptApply()
  }

  closeDetail = (hasQuery) => {
    this.setState({showApplyDetail: false})
    if(hasQuery) {
      this.queryReceiptApply()
    }
  }

  render() {
    const { loading, receiptPage, receiptDetail, contractUrl } = this.props
    const { count, pageNo, pageSize, result } = receiptPage
    const rowSelection = {
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        })
      },
    }
    const pagination = {
      total: count,
      showTotal: (total) => (`共 ${total} 条`),
      pageSize: pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,
    }
    return (
      <div>
        <ReceiptApplyForm
          query={this.queryReceiptApply}
        />
        <div className="form-btns">
          <Button
            type="primary"
            ghost
            onClick={() => this.handleApplyReceipt()}
            disabled={this.state.selectedRows.length < 1}
          >申请</Button>
        </div>
        <Table
          loading={loading}
          rowKey={record => record.fundId}
          rowSelection={rowSelection}
          bordered
          size="small"
          columns={receiptColumns}
          dataSource={result}
          pagination={pagination}
        />
        {
          this.state.showApplyDetail ?
            <ReceiptDetail
              receiptDetail={receiptDetail}
              onCancel={this.closeDetail}
              receiptApplySave={this.props.receiptApplySave}
              contractUrl={contractUrl}
            /> : null
        }
      </div>
    )
  }
}
