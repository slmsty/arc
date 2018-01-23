import React from 'react'
import { Form, Button, Input, Row, Col, Select, DatePicker, Table, Modal, Upload, message, Icon } from 'antd'
import './billDetail.less'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSearch from './selectSearch'
import moment from 'moment'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
const contentCols = [{
  title: '内容名称',
  dataIndex: 'billingContentName',
  width: 200,
}, {
  title: '内容',
  dataIndex: 'billingRecordId',
  width: 200,
}]

const totalColumns = [
  {
    title: '',
    dataIndex: 'title',
    width: 80,
  }, {
    title: '税率',
    dataIndex: 'taxRate',
    width: 150,
  }, {
    title: '税额',
    dataIndex: 'tax',
    width: 150,
  }
]

const detailColumns = [{
  title: '',
  dataIndex: 'title',
  width: 80,
}, {
  title: '客户名称',
  dataIndex: 'customerName',
  width: 150,
}, {
  title: '纳税人识别码',
  dataIndex: 'taxPayer',
  width: 150,
}, {
  title: '地址电话',
  dataIndex: 'address',
  width: 150,
}, {
  title: '开户行及账号',
  dataIndex: 'bankAccount',
  width: 150,
}]

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
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.detail && nextProps.detail.appLineItems.length > 0 && this.state.dataSource.length === 0) {
      let data = []
      nextProps.detail.appLineItems.map((item, index) => {
        data.push({
          lineNo: index,
          arBillingId: item.arBillingId,
          contractItemId: item.contractItemId,
          billingContent: '',
          specificationType: '',
          unit: '',
          quantity: '',
          unitPrice: '',
          billingAmount: item.billingAmount,
          billingTaxRate: '',
          billingTaxAmount: '',
        })
      })
      this.setState({ dataSource: data, count: data.length })
    }
  }

  handleAdd = (arBillingId, contractItemId) => {
    const { count, dataSource } = this.state;
    const newData = {
      lineNo: count,
      arBillingId,
      contractItemId,
      billingContent: '',
      specificationType: '',
      unit: '',
      quantity: '',
      unitPrice: '',
      billingAmount: '',
      billingTaxRate: '',
      billingTaxAmount: '',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }

  handleDelete = (lineNo) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.lineNo !== lineNo) });
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //const values = this.props.form.getFieldsValue()
        console.log(values)
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

  handleChange = (value, col, index) => {
    console.log(value, col, index)
    let dataSource = this.state.dataSource
    if(col === 'billingContent') {
      dataSource[index][col] = value[1]
    } else {
      dataSource[index][col] = value
    }

    this.setState({
      dataSource: dataSource
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
        width: 70,
        render: (text, record, index) => (
          <div>
            <Button type="primary" style={{padding: '0 10px'}} ghost onClick={() => this.handleAdd(record.arBillingId, record.contractItemId)}>+</Button>
            {
              this.state.dataSource.length > 1 ?
                <Button type="primary" style={{marginLeft: '5px', padding: '0 10px'}} ghost onClick={() => this.handleDelete(record.lineNo)}>-</Button>
                : null
            }
          </div>
        )
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
      width: 100,
      render: (text, record, index) => (
        <Input placeholder="单位" onChange={(e) => this.handleChange(e.target.value, 'unit', index)} />
      )
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: 100,
      render: (text, record, index) => (
        <Input placeholder="数量" defaultValue="1" onChange={(e) => this.handleChange(e.target.value, 'quantity', index)} />
      )
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      render: (text, record, index) => (
        <Input placeholder="单价" onChange={(e) => this.handleChange(e.target.value, 'unitPrice', index)}/>
      )
    }, {
      title: '金额',
      dataIndex: 'billingAmount',
      width: 100,
      render: (text, record, index) => (
        <Input placeholder="金额" defaultValue={record.billingAmount} onChange={(e) => this.handleChange(e.target.value, 'billingAmount', index)}/>
      )
    }, {
      title: '税率',
      dataIndex: 'billingTaxRate	',
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
      render: (text, record, index) => (
        <Input placeholder="税额" onChange={(e) => this.handleChange(e.target.value, 'billingTaxAmount', index)}/>
      )
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
    return (
      <Modal
        title="发票编辑"
        width="1000px"
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
          <Table
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
          </div>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(BillDetail)

