/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Pagination, Row, Col, Table, Button, notification } from 'antd'
import PropTypes from 'prop-types'
import CBSTurnoverWholenessConfirmSearchWithForm from './cbsTurnoverWholenessConfirmSearch'
import EditCBSTurnoverDataWithForm from './editCBSTurnoverData'

const columns = [{
  title: '数据状态',
  dataIndex: 'status',
  key: 'status',
  width: 80,
  fixed: 'left',
}, {
  title: '收款日期',
  dataIndex: 'receiptDate',
  key: 'receiptDate',
  width: 80,
  fixed: 'left',
}, {
  title: '币种',
  dataIndex: 'currency',
  key: 'currency',
  width: 45,
}, {
  title: '收款金额',
  dataIndex: 'receiptAmount',
  key: 'receiptAmount',
  width: 100,
}, {
  title: '客户名称',
  dataIndex: 'custName',
  key: 'custName',
  width: 300,
}, {
  title: '流水分类',
  dataIndex: 'claimType',
  key: 'claimType',
  width: 100,
}, {
  title: '备注',
  dataIndex: 'statusDesc',
  key: 'statusDesc',
  width: 635,
}, {
  title: '客户付款方式',
  dataIndex: 'custPayMethod',
  key: 'custPayMethod',
  width: 100,
}, {
  title: '银行流水备注',
  dataIndex: 'bankTurnoverComment',
  key: 'bankTurnoverComment',
  width: 100,
}, {
  title: '付款客户名称',
  dataIndex: 'payCustName',
  key: 'payCustName',
  width: 300,
}, {
  title: '客户付款银行账号',
  dataIndex: 'custBankAccount',
  key: 'custBankAccount',
  width: 120,
}, {
  title: '客户付款银行',
  dataIndex: 'custBankName',
  key: 'custBankName',
  width: 300,
}, {
  title: '银行流水号',
  dataIndex: 'bankTransactionNo',
  key: 'bankTransactionNo',
  width: 100,
}, {
  title: '公司',
  dataIndex: 'company',
  key: 'company',
  width: 300,
},
]

const openNotificationWithIcon = (msg) => {
  notification.error({
    message: '错误',
    description: msg,
  })
}

export default class CBSTurnoverWholenessConfirm extends React.Component {
  state = {
    selectedRowKeys: [],
    editVisible: false,
  }
  componentDidMount() {
    this.handleQuery()
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    receiptDateStart: '',
    receiptDateEnd: '',
    custId: '',
    receiptMethodId: '10',
    sourceType: 'CBS',
    status: '',
  }
  handleSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }
  handleChangeParam = (param) => {
    this.queryParam = { ...this.queryParam, ...param }
    console.log(this.queryParam)
    this.handleQuery()
  }
  handleQuery = () => {
    this.props.getCBSTurnoverWholenessData(this.queryParam)
    // ajax request after empty completing
  }
  handleEdit = () => {
    if (!this.state.selectedRowKeys.length) {
      openNotificationWithIcon('请选择想要编辑的数据。')
    } else if (this.state.selectedRowKeys.length > 1) {
      openNotificationWithIcon('只可对一条数据进行编辑。')
    } else {
      this.setState({ editVisible: true })
      // console.log('弹出编辑界面，传递数据：[' + this.state.selectedRowKeys + ']')
    }
  }
  handleEditConfirm = () => {
    this.setState({ editVisible: false })
    this.handleQuery()
  }
  handleEditCancel = () => {
    this.setState({ editVisible: false })
  }
  handleConfirm = () => {
    console.log('确认。。然后刷新数据。')
    this.handleQuery()
  }
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  handleExcept = () => {
    if (!this.state.selectedRowKeys.length) {
      openNotificationWithIcon('请选择想要排除的数据。')
    } else {
      console.log(`调用排除接口，传递数据：[${this.state.selectedRowKeys}]，然后刷新列表`)
      this.handleQuery()
    }
  }
  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }
    const pagination = (<Pagination
      current={this.props.getCBSTurnoverWholenessData.pageNo}
      onChange={this.handleChangePage}
      total={this.props.getCBSTurnoverWholenessData.count}
    />)
    const makeSummary = () => {
      if (this.props.getCBSTurnoverWholenessData.amountSum && this.props.getCBSTurnoverWholenessData.amountSum) {
        return this.props.getCBSTurnoverWholenessData.map(item => `${item.currency}：${item.totalAmount}`).join('  ')
      } else {
        return '0.00'
      }
    }
    return (
      <div>
        <CBSTurnoverWholenessConfirmSearchWithForm
          query={this.handleChangeParam}
        />
        <br />
        <Row style={{ lineHeight: '28px' }}>
          <Col span={8}>
            <Button type="default" onClick={this.handleEdit}>编辑</Button>&nbsp;&nbsp;
            <Button type="default" onClick={() => { console.log('change router') }}>人工录入</Button>&nbsp;&nbsp;
            <Button type="default" onClick={this.handleExcept}>排除</Button>&nbsp;&nbsp;
            <Button type="primary" onClick={this.handleConfirm}>确认</Button>&nbsp;&nbsp;
          </Col>
          <Col span={16} style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 'bold' }}>
            <span>金额合计：</span><span className="primary-color" style={{ color: '#F4A034' }}>{makeSummary()}</span>
          </Col>
        </Row>
        <br />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.props.cbsTurnoverWholenessConfirm.result}
          bordered
          size="middle"
          pagination={pagination}
          scroll={{ x: '2660px' }}
        />
        <EditCBSTurnoverDataWithForm
          onConfirm={this.handleEditConfirm}
          onCancel={this.handleEditCancel}
          visible={this.state.editVisible}
        />
      </div>
    )
  }
}

CBSTurnoverWholenessConfirm.propTypes = {
  getCBSTurnoverWholenessData: PropTypes.func.isRequired,
  cbsTurnoverWholenessConfirm: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.array.isRequired,
    amountSum: PropTypes.array.isRequired,
  }).isRequired,
}

