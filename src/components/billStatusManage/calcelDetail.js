/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import currency from '../../util/currency'
import { Modal, Row, Col, Button, Input, Form, Table, message, Select } from 'antd'

const { TextArea } = Input
const Option = Select.Option
class CancelModal extends React.Component {
  state = {
    selectedRowKeys: '',
    selectedRows: '',
    disableDis: true,
    showNewApplayDis: false,
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    if(selectedRowKeys.length){
      this.setState({
        disableDis: false,
      })
    }else{
      this.setState({
        disableDis: true,
      })
    }
    this.setState({ selectedRowKeys, selectedRows })
  }
  // 作废
  disableItem = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要作废的数据')
      return
    }
    const params={
      applicationId: this.props.data[0].applicationId,
      applineId: this.state.selectedRows[0].billingLineId,
      outcomeId: this.props.data[0].outcomeId,
      invalidAmount: this.state.selectedRows[0].invalidAmount,
      isAgainInvoice: this.state.showNewApplayDis,
      appLineItems:this.props.DetailList,
    }
    // console.log('params',params)
    this.props.disableApprove(params)
  }
  showNewApplay = (flag) => {
    console.log(flag)
    if(flag=='1'){
      this.setState({
        showNewApplayDis: true,
      })
    }
    if(flag=='2'){
      this.setState({
        showNewApplayDis: false,
      })
    }
  }
  render() {
    let dataSource = this.props.data
    const columns = [{
      title: '项目编码',
      dataIndex: 'projectCode',
      width: 180,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '签约公司',
      dataIndex: 'company',
      width: 300,
    }, {
      title: '合同编码',
      dataIndex: 'contractCode',
      width: 200,
    }, {
      title: '付款条件',
      dataIndex: 'paymentTerm',
      width: 300,
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
      dataIndex: 'paymentAmount',
      width: 150,
      render: (text, record, index) => (text ? currency(text) : text),
    }, {
      title: 'Billed AR金额',
      dataIndex: 'arAmount',
      width: 150,
      render: (text, record, index) => (text ? currency(text) : text),
    }, {
      title: '已开票金额',
      dataIndex: 'invoiceAmount',
      width: 100,
      render: (text, record, index) => (text ? currency(text) : text),
    }, {
      title: '作废金额',
      dataIndex: 'invalidAmount',
      width: 150,
      render: (text, record, index) => (text ? currency(text) : text),
    },
    ]
    const newColumns = [
      {
        title: '',
        dataIndex: 'title',
        width: 150,
      }, {
        title: '客户名称',
        dataIndex: 'customerName',
        width: 150,
      },
      {
        title: '纳税人识别号',
        dataIndex: 'taxPayer',
        width: 150,
      },
      {
        title: '地址电话',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '开户行及账号',
        dataIndex: 'bankAccount',
        width: 150,
      },
    ]
    const detailData = [{
      title: '购买方',
      customerName: '中国移动',
      taxPayer: '212SDFX',
      address: '北京市海淀区知春路010-89332322',
      bankAccount: '招商银行'
    }, {
      title: '销售方',
      customerName: '亚信科技',
      taxPayer: '243SDaaFX',
      address: '北京市海淀区中关村',
      bankAccount: '招商银行'
    }]
    const contentsColumns = [{
      title: '开票内容',
      dataIndex: 'billingContent',
      width: 150,
    }, {
      title: '规格型号',
      dataIndex: 'specificationType',
      width: 100,
    }, {
      title: '单位',
      dataIndex: 'unit',
      width: 100,
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: 100,
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      render: (text, record, index) => (text ? currency(text) : text),
    }, {
      title: '金额',
      dataIndex: 'billingAmount',
      width: 100,
      render: (text, record, index) => (text ? currency(text) : text),
    }, {
      title: '税率',
      dataIndex: 'billingTaxRate',
      width: 100,
    }, {
      title: '税额',
      dataIndex: 'billingTaxAmount',
      width: 100,
      render: (text, record, index) => (text ? currency(text) : text),
    }]
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      onChange: this.onSelectChange,
    }
    return (
      <div>
        <Modal
          width={1024}
          title="作废详情"
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          onOk={this.props.onOk}
          footer={
            <Button onClick={this.disableItem}>
              确认
            </Button>
          }
        >
          <Row gutter={40}>
            <Col span={16} key={1}>
             是否重新开票：
              <Select disabled={this.state.selectedRowKeys.length > 0 ? false : true} defaultValue="N" onChange={(v) => this.setState({showNewApplayDis: v === 'Y' ? true : false })}>
                <Option value="Y">是</Option>
                <Option value="N">否</Option>
              </Select>
            </Col>
          </Row>
          <br />
          <br />
          <Table
            rowKey="receiptClaimId"
            rowSelection={rowSelection}
            columns={columns}
            pagination ={false}
            bordered
            size="small"
            scroll={{ x: '1700px' }}
            dataSource={this.props.dataSource}
          />
          <br /><br />
          {
            this.state.showNewApplayDis && this.state.selectedRowKeys.length ?
              <div>
                <Table
                  rowKey="receiptClaimId"
                  columns={newColumns}
                  pagination={false}
                  bordered
                  size="small"
                  scroll={{x: '750px'}}
                  dataSource={detailData}
                />
                <br /><br />
                <Table
                  rowKey="receiptClaimId"
                  columns={contentsColumns}
                  pagination={false}
                  bordered
                  size="small"
                  scroll={{x: '750px'}}
                  dataSource={this.props.DetailList}
                />
                <br /><br />
                <div>
                  <span style={{display:'inline-block'}}>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span>
                  <span style={{display:'inline-block',verticalAlign:'text-top',width:'931px'}}><TextArea/></span>

                </div>
                <div style={{marginTop:'20px'}}>
                  <span style={{display:'inline-block'}}>开票要求：</span>
                  <span style={{display:'inline-block',verticalAlign:'text-top',width:'931px'}}><TextArea/></span>

                </div>
              </div>

            : ''
          }
        </Modal>
      </div>
    )
  }
}
CancelModal.propTypes = {
  closeClaim: PropTypes.func.isRequired,
  applyReject: PropTypes.func.isRequired,
  applyComfirm: PropTypes.func.isRequired,
  infoVisitable: PropTypes.bool.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
}
const CancelModalWithForm = Form.create()(CancelModal)

export default CancelModalWithForm
