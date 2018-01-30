import React from 'react'
import { Form, Button, Input, Row, Col, Select, DatePicker, Table, Modal, Upload, message, Icon, InputNumber } from 'antd'
import './billDetail.less'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSearch from './selectSearch'
import moment from 'moment'
import { contentCols, totalColumns, detailColumns } from './billColumns'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input

const data = [{
  title: '城建',
  taxRate: '5%',
  tax: '2021',
}, {
  title: '教育',
  taxRate: '8%',
  tax: '12000',
}, {
  title: '所得税',
  taxRate: '10%',
  tax: '3000',
}, {
  title: '合计',
  taxRate: '20%',
  tax: '21000',
}]

class BillDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      count: 0,
      content: '',
      taxRate: '',
      selectedRowKeys: [],
      selectedRows: [],
      currentNo: 1,
      totalAmount: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.detail && nextProps.detail.appLineItems.length > 0 && this.state.dataSource.length === 0) {
      let data = []
      nextProps.detail.appLineItems.map((item, index) => {
        data.push({
          lineNo: index,
          level: 1,
          arBillingId: item.arBillingId,
          contractItemId: item.contractItemId,
          billingContent: '',
          specificationType: '',
          unit: '',
          quantity: '',
          unitPrice: 0,
          noRateAmount: 0,
          billingAmount: item.billingAmount,
          totalAmount: item.billingAmount,
          billingTaxRate: 0,
          billingTaxAmount: 0,
        })
      })
      this.setState({ dataSource: data, count: data.length })
    }
  }

  handleAdd = (arBillingId, contractItemId) => {
    const { count, dataSource } = this.state;
    const newData = {
      lineNo: count,
      level: 2,
      arBillingId,
      contractItemId,
      billingContent: '',
      specificationType: '',
      unit: '',
      quantity: '',
      unitPrice: 0,
      noRateAmount: 0,
      billingAmount: 0,
      billingTaxRate: 0,
      billingTaxAmount: 0,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }

  handleDelete = (record) => {
    let dataSource = [...this.state.dataSource];
    this.state.dataSource.map((item, index) => {
      if(record.arBillingId === item.arBillingId && item.level === 1) {
        const amount = dataSource[item.lineNo]['billingAmount']
        dataSource[item.lineNo]['billingAmount'] = parseFloat(record.billingAmount) + parseFloat(amount)
      }
      if(item.lineNo === record.lineNo) {
        dataSource = dataSource.slice(index - 1, index)
      }
    })
    this.setState({ dataSource: dataSource });
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { custInfo, comInfo } = this.props.detail
        const params = {
          ...values,
          billingCustInfoId: custInfo.billingCustInfoId,
          billingComInfoId: comInfo.billingComInfoId,
          billingApplicationType: this.props.billType,
          billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
          appLineItems: this.state.dataSource
        }
        console.log(params)
        this.props.billApplySave(params)
      }
    });
  }

  handleChange = (value, col, index, record) => {
    let dataSource = this.state.dataSource
    if(col === 'billingContent') {
      dataSource[index][col] = value[1]
    } else if(col === 'billingAmount') {
      //发票拆分子记录输入金额后，从新计算携带数据的金额
      const result = dataSource.filter(d => d.level === 1 && record.arBillingId === d.arBillingId)[0]
      if(value >= result.billingAmount) {
        message.warn(`拆分金额必须小于拆分前金额`)
        return
      }
      dataSource[result.lineNo][col] = result.totalAmount - value
      dataSource[index][col] = value
    } else {
      dataSource[index][col] = value
    }
    this.setState({
      dataSource: dataSource
    })
  }

  billingUnify = () => {
    let { selectedRows, currentNo, dataSource } = this.state
    //判断是否存在不一致组号
    const groupNo = selectedRows[0].groupNo
    selectedRows.map(record => {
      if(dataSource[record.lineNo]['groupNo'] !== groupNo) {
        currentNo = 1
      }
    })
    selectedRows.map((record, index) => {
      dataSource[record.lineNo]['groupNo'] = currentNo
    })
    this.setState({
      dataSource: dataSource,
      selectedRowKeys: [],
      currentNo: currentNo + 1,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
    const formItemLayout1 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    }
    const columns = [{
      title: '操作',
      dataIndex: 'action',
      width: 60,
      render: (text, record, index) => (
        <div>
          {
            record.level === 1 ?
            <Button type="primary" ghost onClick={() => this.handleAdd(record.arBillingId, record.contractItemId)}>+</Button>
            : null
          }
          {
            record.level === 2 ?
              <Button type="primary" ghost onClick={() => this.handleDelete(record)}>-</Button>
              : null
          }
        </div>
      )
    }, {
      title: '组号',
      dataIndex: 'groupNo',
      width: 50,
    }, {
      title: '开票内容',
      dataIndex: 'billingContent',
      width: 150,
      render: (text, record, index) => (
        <SelectSearch
          url="/arc/billingApplication/billingContent/search"
          columns={contentCols}
          label="开票内容"
          idKey="billingRecordId"
          valueKey="billingContentName"
          value={['', this.state.dataSource[index]['billingContent']]}
          onChange={(v) => this.handleChange(v, 'billingContent', index)}
        />
      )
    }, {
      title: '规格型号',
      dataIndex: 'specificationType',
      width: 100,
      render: (text, record, index) => (
        <Input placeholder="规格型号" onChange={(e) => this.handleChange(e.target.value, 'specificationType', index)}/>
      )
    }, {
      title: '单位',
      dataIndex: 'unit',
      width: 80,
      render: (text, record, index) => (
        <Input placeholder="单位" onChange={(e) => this.handleChange(e.target.value, 'unit', index)} />
      )
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: 70,
      render: (text, record, index) => (
        <InputNumber
          placeholder="数量"
          defaultValue="1"
          onChange={(value) => this.handleChange(value, 'quantity', index)} />
      )
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      render: (text, record, index) => {
        const { billingAmount, billingTaxRate, quantity} = this.state.dataSource[index]
        console.log(billingTaxRate)
        return (
          <InputNumber
            placeholder="单价"
            value={billingTaxRate ? (billingAmount / (1 + parseFloat(billingTaxRate)) / (quantity ? quantity : 1)).toFixed(2) : 0}
            onChange={(value) => this.handleChange(value, 'unitPrice', index)}
          />
        )
      }
    }, {
      title: '不含税金额',
      dataIndex: 'noRateAmount',
      width: 100,
      render: (text, record, index) => {
        const { billingAmount, billingTaxRate } = this.state.dataSource[index]
        console.log(billingTaxRate)
        return (
          <InputNumber
            placeholder="不含税金额"
            value={billingTaxRate ? (billingAmount / (1 + parseFloat(billingTaxRate))).toFixed(2) : 0}
            onChange={(value) => this.handleChange(value, 'noRateAmount', index, record)}/>
        )
      }
    }, {
      title: '含税金额',
      dataIndex: 'billingAmount',
      width: 100,
      render: (text, record, index) => (
        <InputNumber
          placeholder="含税金额"
          defaultValue={record.billingAmount}
          value={this.state.dataSource[index]['billingAmount']}
          onChange={(value) => this.handleChange(value, 'billingAmount', index, record)}/>
      )
    }, {
      title: '税率',
      dataIndex: 'billingTaxRate',
      width: 100,
      render: (text, record, index) => (
        <SelectInvokeApi
          typeCode="BILLING_APPLICATION"
          paramCode="TAX_RATE"
          placeholder="税率"
          hasEmpty
          value={this.state.dataSource[index]['billingTaxRate']}
          onChange={(v) => this.handleChange(v, 'billingTaxRate', index)}
        />
      )
    }, {
      title: '税额',
      dataIndex: 'billingTaxAmount',
      width: 100,
      render: (text, record, index) => {
        const { billingAmount, billingTaxRate} = this.state.dataSource[index]
        const unitPrice = billingAmount / (1 + parseFloat(billingTaxRate))
        return (
          <InputNumber
            placeholder="税额"
            value={(unitPrice * billingTaxRate).toFixed(2)}
            onChange={(value) => this.handleChange(value, 'billingTaxAmount', index)}
          />
        )
      }
    }]
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const { custInfo, comInfo, appLineItems} = this.props.detail
    const detailData = [{
      title: '购买方',
      customerName: custInfo.billingCustName,
      taxPayer: custInfo.taxpayerIdentificationNumber,
      address: custInfo.addressPhoneNumber,
      bankAccount: custInfo.bankBankAccount,
    }, {
      title: '销售方',
      customerName: comInfo.billingComName,
      taxPayer: comInfo.taxpayerIdentificationNumber,
      address: comInfo.addressPhoneNumber,
      bankAccount: comInfo.bankBankAccount
    }]
    const rowSelection = {
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        })
      },
      selectedRowKeys: this.state.selectedRowKeys,
    }
    return (
      <Modal
        title="发票编辑"
        width="1100px"
        style={{ top: 20 }}
        visible={true}
        wrapClassName="vertical-center-modal"
        footer={[
          <Button key="submit" type="primary" onClick={this.handleOk}>
            <Icon type="check" />开票
          </Button>,
        ]}
        onCancel={() => this.props.onCancel()}
      >
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="费用承担着">
                {getFieldDecorator('costBear')(
                  <SelectInvokeApi
                    typeCode="BILLING_APPLICATION"
                    paramCode="COST_BEAR"
                    placeholder="费用承担着"
                    hasEmpty
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="开票类型">
                {
                  getFieldDecorator('billingType', {
                    initialValue: '', rules: [{ required: true, message: '请选择开票类型!' }]
                  })(
                    <SelectInvokeApi
                      typeCode="BILLING_APPLICATION"
                      paramCode="BILLING_TYPE"
                      placeholder="开票类型"
                      hasEmpty
                    />
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="开票日期">
                {
                  getFieldDecorator('billingDate', {rules: [{ required: true, message: '请选择开票日期!' }]})(
                    <DatePicker format="YYYY-MM-DD"/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <div className="arc-info">
            <Table
              rowKey="id"
              size="small"
              bordered
              columns={detailColumns}
              dataSource={detailData}
              pagination={false}
            />
          </div>
          <div className="add-btns">
            <Button type="primary" style={{marginLeft: '5px'}} ghost onClick={() => this.billingUnify()}>统一开票</Button>
          </div>
          <Table
            rowSelection={rowSelection}
            style={{marginBottom: '10px'}}
            rowKey="receiptClaimId"
            bordered
            size="small"
            columns={columns}
            pagination={false}
            dataSource={this.state.dataSource}
          />
          <Row gutter={40}>
            <Col span={14}>
              <FormItem {...formItemLayout1} label="发票备注">
                {
                  getFieldDecorator('requirements')(
                    <TextArea placeholder="请输入发票备注" rows="2" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={14}>
              <FormItem {...formItemLayout1} label="附件">
                {
                  getFieldDecorator('file')(
                    <Upload {...props}>
                      <Button>
                        <Icon type="upload" />点击上传
                      </Button>
                    </Upload>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={14}>
              <FormItem {...formItemLayout1} label="开票要求">
                {
                  getFieldDecorator('billingApplicantRequest', {rules: [{max: 350, message: '开票要求不能超过350个字符!' }]})(
                    <TextArea placeholder="请输入开票要求" rows="2" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          {
            this.props.billType === 'BILLING_EXCESS' ?
              <div className="arc-info">
                <Table
                  style={{width: '50%'}}
                  rowKey="id"
                  size="small"
                  bordered
                  columns={totalColumns}
                  dataSource={data}
                  pagination={false}
                />
              </div> : null
          }
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(BillDetail)

