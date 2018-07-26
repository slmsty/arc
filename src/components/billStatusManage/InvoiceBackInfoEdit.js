import React from 'react'
import { Modal, Button, Icon, Table, Select, message } from 'antd'
const Option = Select.Option
export default class InvoiceBackInfoEdit extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      result: props.invoiceResult.map(record => ({
        billingOutcomeId: record.billingOutcomeId,
        actionType: record.invoiceResult,
      })),
      saveLoading: false,
    }
  }

  handleSelectChange = (v, i) => {
    let resultInfo = this.state.result
    resultInfo[i].actionType = v
    this.setState({
      result: resultInfo,
    })
  }

  handleOk = () => {
    const params = {
      applicationId: this.props.applicationId,
      invoiceBackInfoList: this.state.result,
    }
    this.setState({
      saveLoading: true
    })
    this.props.saveInvoiceBackInfo(params).then(res => {
      if(res && res.response && res.response.resultCode === '000000') {
        this.setState({
          saveLoading: false
        })
        message.success('纸票退回情况保存成功')
        this.props.onCancel()
      }
    })
  }

  render() {
    const columns = [
      {
        title: '发票号',
        dataIndex: 'invoiceNum',
        width: 100,
        render: (text) => {
          return text ? text : '无'
        }
      }, {
        title: '是否收到发票',
        dataIndex: 'invoiceResult',
        width: 100,
        render: (text, record, index) => {
          return (
            <Select style={{width: '100px'}} defaultValue={text} onChange={(v) => this.handleSelectChange(v, index)}>
              <Option value="">-请选择-</Option>
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
              <Option value="B">无需收票</Option>
            </Select>
          )
        }
      },
    ]
    const { invoiceResult = [] } = this.props
    return (
      <div>
        <Modal
          width="650px"
          title="发票退回情况编辑"
          visible={true}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.props.onCancel()}
          footer={[
            <Button key="submit" type="primary" loading={this.state.saveLoading} onClick={this.handleOk}>
              {!this.state.saveLoading ? <Icon type="check" /> : ''}保存
            </Button>,
          ]}
        >
          <Table
            rowKey={r => r.invoiceNum}
            dataSource={invoiceResult}
            columns={columns}
            bordered
            size="small"
            pagination={false}
          />
        </Modal>
      </div>
    )
  }
}
