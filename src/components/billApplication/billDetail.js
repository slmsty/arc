import React from 'react'
import { Form, Button, Input, Row, Col, Select, DatePicker, Table, Modal, Upload, message, Icon, InputNumber } from 'antd'
import './billDetail.less'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSearch from './selectSearch'
import requestJsonFetch from '../../http/requestJsonFecth'
import moment from 'moment'
import { contentCols, totalColumns, detailColumns, normalTypes, proApplyColumns, billDetailColumns } from './billColumns'
import UrlModalCom from '../common/getUrlModal'
const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
const confirm = Modal.confirm
const uploadFileType = ['BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT', 'BILLING_RED', 'BILLING_RED_OTHER']
const requirementType = ['BILLING_RED', 'BILLING_RED_OTHER', 'BILLING_EXCESS']

class BillDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      count: 1,
      content: '',
      taxRate: '',
      selectedRowKeys: [],
      selectedRows: [],
      currentNo: 1,
      totalAmount: 0,
      uploading: false,
      file: {},
      fileList: [],
      fileId: '',
      loading: false,
      showDetail: '',
      isCostBearEdit: props.billType === 'BILLING_EXCESS',
      showWarning: false,
      warningData: {
        arcBillingTaxInfo: {},
      },
      submitParams: {},
      showContractLink: false,
    }
  }

  componentDidMount() {
    let data = []
    const items = this.props.type === 'myApply' ? this.props.detail.appLineList : this.props.detail.appLineItems
    items.map((item, index) => {
      data.push({
        lineNo: index,
        groupNo: 1,
        isParent: 1,
        arBillingId: item.arBillingId,
        contractItemId: item.contractItemId,
        billingContent: '',
        specificationType: '',
        unit: '',
        quantity: 1,
        unitPrice: item.billingAmount ? item.billingAmount : 0,
        billingAmountExcludeTax: item.billingAmount ? item.billingAmount : 0,
        billingAmount: item.billingAmount ? item.billingAmount : 0,
        totalAmount: item.billingAmount ? item.billingAmount : 0,
        billingTaxRate: 0,
        billingTaxAmount: 0,
      })
    })
    this.setState({ dataSource: data, count: data.length })
  }

  handleAdd = (lineNo, arBillingId, contractItemId) => {
    let { count, dataSource } = this.state;
    const newData = {
      lineNo: count,
      groupNo: 1,
      isParent: 0,
      arBillingId,
      contractItemId,
      billingContent: '',
      specificationType: '',
      unit: '',
      quantity: 1,
      unitPrice: 0,
      noRateAmount: 0,
      billingAmountExcludeTax: 0,
      billingAmount: 0,
      billingTaxRate: 0,
      billingTaxAmount: 0,
    };
    const data = dataSource.filter(r=> r.arBillingId === arBillingId)
    dataSource.splice(lineNo + data.length, 0, newData)
    const source = dataSource.map((record, index) => ({
        ...record,
        lineNo: index,
      }
    ))
    this.setState({
      dataSource: source,
      count: count + 1,
    });
  }

  handleDelete = (record) => {
    let dataSource = [...this.state.dataSource];
    this.state.dataSource.map((item, index) => {
      if(record.arBillingId === item.arBillingId && item.isParent === 1) {
        const amount = dataSource[item.lineNo]['billingAmount']
        dataSource[item.lineNo]['billingAmount'] = parseFloat(record.billingAmount) + parseFloat(amount)
      }
    })

    dataSource.splice(record.lineNo, 1)
    const newSource = dataSource.map((record, index) => ({
      ...record,
      lineNo: index,
    }))
    this.setState({ dataSource: newSource });
  }

  handleOk = (e) => {
    e.preventDefault();
    const { isRed, billingOutcomeId } = this.props
    //红冲发票不重新开票
    if(isRed && this.props.form.getFieldValue('isAgainInvoice') === 'false') {
      this.props.form.validateFields((err, values) => {
        if(!err) {
          const params = {
            billingOutcomeId,
            billingApplicationType: this.props.billType,
            objectId: this.state.fileId,
            objectName: this.state.file.name,
            billingApplicantRequest: values.billingApplicantRequest,
            isAgainInvoice: 'false',
          }
          this.props.billApplySave(params)
        }
      })
    } else {
      this.props.form.validateFields((err, values) => {
        const groupNos = this.state.dataSource.filter(r => typeof r.groupNo !== 'undefined')
        for(let i = 0; i< this.state.dataSource.length; i++) {
          const record = this.state.dataSource[i]
          if(record.billingAmount <= 0) {
            message.error(`第${i+1}行【开票含税金额】必须大于0`)
            err = true
            break
          }
          if(record.billingTaxRate === '' || typeof record.billingTaxRate === 'undefined') {
            message.error(`第${i+1}行【开票税率】不能为空!`)
            err = true
            break
          }
          if(record.quantity === '' || typeof record.quantity === 'undefined' || record.quantity === 0) {
            message.error(`第${i+1}行【开票数量】不能为空或者为0!`)
            err = true
            break
          }
          if(groupNos.length > 0 && typeof record.groupNo === 'undefined') {
            message.error(`第${i+1}行【开票信息】没有进行分组!`)
            err = true
            break
          }
        }

        if (!err) {
          this.setState({loading: true})
          const { custInfo, comInfo } = this.props.detail
          const appLineItems = this.state.dataSource.map(record => ({
            ...record,
            lineNo: record.lineNo + 1,
            groupNo: groupNos.length > 0 ? record.groupNo : 1,
          }))
          const params = {
            ...values,
            billingOutcomeId,
            billingCustInfoId: custInfo.billingCustInfoId,
            billingComInfoId: comInfo.billingComInfoId,
            billingApplicationType: this.props.billType,
            billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
            appLineItems: appLineItems,
            objectId: this.state.fileId,
            objectName: this.state.file.name,
            isAgainInvoice: 'true',
          }
          const _this = this
          //校验拆分金额是否大于含税金额，大于提示用户并更改开票类型为超额开票
          if(normalTypes.includes(this.props.billType)) {
            requestJsonFetch('/arc/billingApplication/apply/check', {
              method: 'POST',
              body: {
                appLineItems: appLineItems,
                billingApplicationType: this.props.billType,
              },
            }, (res) => {
              this.setState({
                loading: false,
              })
              const { resultCode, resultMessage, isWarning } = res
              if(resultCode === '000000') {
                if(isWarning === 'Y' || this.props.billType === 'BILLING_EXCESS') {
                  this.setState({
                    showWarning: true,
                    warningData: res,
                    submitParams: params,
                  })
                } else {
                  this.props.billApplySave(params)
                }
              } else {
                message.error(resultMessage, 5)
                return
              }
            })
          } else {
            this.props.billApplySave(params)
          }
        }
      });
    }
  }

  handleWarningOk = () => {
    this.setState({
      showWarning: false,
    })
    let isError = false
    const values = this.props.form.getFieldsValue()
    const { billingApplicationType } = this.state.warningData
    if(billingApplicationType === 'BILLING_EXCESS') {
      if(typeof values.billingApplicantRequest === 'undefined' || values.billingApplicantRequest === '') {
        this.props.form.setFields({
          billingApplicantRequest: {
            errors: [new Error('已转为其他事项开票，请填写开票原因')]
          }
        })
        isError = true
      }
      if(typeof values.costBear === 'undefined' || values.costBear === '') {
        this.props.form.setFields({
          costBear: {
            value: '',
            errors: [new Error('已转为其他事项开票，请填费用承担者')]
          }
        })
        this.setState({
          isCostBearEdit: true,
        })
        isError = true
      }
    }
    if(!isError) {
      this.props.billApplySave({
        ...this.state.submitParams,
        billingApplicationType,
      })
    }
  }

  handleChange = (value, col, index, record) => {
    let dataSource = this.state.dataSource
    if(col === 'billingContent') {
      dataSource[index][col] = value[1]
    } else if(col === 'billingAmount') {
      //发票拆分子记录输入金额后，从新计算携带数据的金额
      const result = dataSource.filter(d => d.isParent === 1 && record.arBillingId === d.arBillingId)[0]
      let total = 0
      dataSource.map(d => {
        if(d.arBillingId === record.arBillingId && d.isParent === 0 && d.lineNo !== index){
          total += (d.billingAmount ? d.billingAmount : 0)
        }
      })
      //校验所有拆分子项的金额必须小于父级含税金额
      const childAmount = total + value
      /*if(normalTypes.includes(this.props.billType) && childAmount >= result.totalAmount) {
        message.error('拆分子项的金额合计必须小于拆分前含税金额')
        return false
      } else {
        if(result.totalAmount !== 0 && record.isParent!== 1 && childAmount >= result.totalAmount) {
          message.error('拆分子项的金额合计必须小于拆分前含税金额')
          return false
        }
      }*/
      dataSource[result.lineNo][col] = result.totalAmount - childAmount
      const parent = this.state.dataSource[result.lineNo]
      this.calBillAmountTax(dataSource, result.lineNo, parent.billingAmount, parent.billingTaxRate, parent.quantity)
      dataSource[index][col] = value
      const { billingAmount, billingTaxRate, quantity } = this.state.dataSource[index]
      this.calBillAmountTax(dataSource, index, billingAmount, billingTaxRate, quantity)
      //未大签、红冲、其他开票含税金额为0, 手动输入金额后并赋值给总金额
      if(record.isParent === 1 && !normalTypes.includes(this.props.billType)) {
        dataSource[result.lineNo].totalAmount = value
      }
    } else if (col === 'billingTaxRate') {
      const { billingAmount, quantity} = this.state.dataSource[index]
      this.calBillAmountTax(dataSource, index, billingAmount, value, quantity)
      dataSource[index][col] = value
    } else if (col === 'quantity') {
      dataSource[index][col] = value
      const { billingAmountExcludeTax } = this.state.dataSource[index]
      dataSource[index]['unitPrice'] = (billingAmountExcludeTax / (value ? value : 1)).toFixed(2)
    } else {
      dataSource[index][col] = value
    }
    this.setState({
      dataSource: dataSource
    })
  }

  billingUnify = () => {
    let { selectedRows, currentNo, dataSource } = this.state
    const groupNo = selectedRows[0].groupNo
    if(dataSource.length ===  selectedRows.length) {
      currentNo = 0
    } else {
      const selectNos = selectedRows.map(r => r.lineNo)
      const groupNos = dataSource.filter(d => !selectNos.includes(d.lineNo)).map( r => r.groupNo)
      currentNo = groupNos.length === 0 ? 1 : Math.max(...groupNos)
    }
    selectedRows.map(record => {
      dataSource[record.lineNo]['groupNo'] = currentNo + 1
    })
    this.setState({
      dataSource: dataSource,
      selectedRowKeys: [],
    })
  }

  beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('上传文件大小必须小于10MB!');
      return false
    }
    this.setState({
      file,
    })
  }

  customRequest = (file) => {
    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream;charset=UTF-8',
      },
      body: file.file,
    }
    requestJsonFetch(`/arc/file/upload/${this.state.file.name}`, option, this.handleCallback)
  }

  handleCallback = (response) => {
    if(response.resultCode === '000000') {
      const { file, fileList } = this.state
      message.success(`${file.name} 上传成功`);
      this.setState({
        fileId: response.data,
        fileList: [...fileList, {
          uid: new Date().getTime(),
          name: file.name,
          status: 'done',
          response: '', // custom error message to show
          url: '',
        }]
      })
    } else {
      message.success(`${this.state.file.name} 上传失败`);
    }
  }

  handleFileChange = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'removed') {
      this.setState({
        fileList: info.fileList,
        fileId: '',
        file: {},
      })
    }
  }

  calBillAmountTax = (dataSource, index, billingAmount, billingTaxRate, quantity) => {
    const excludeTax = billingAmount / (1 + parseFloat(billingTaxRate))
    dataSource[index]['billingAmountExcludeTax'] = (billingAmount / (1 + parseFloat(billingTaxRate))).toFixed(2)
    dataSource[index]['unitPrice'] = (excludeTax / (quantity ? quantity : 1)).toFixed(2)
    dataSource[index]['billingTaxAmount'] = (excludeTax * billingTaxRate).toFixed(2)
  }

  getWarningTableData = () => {
    const { constructionTax, constructionTaxAmount, educationTax, educationTaxAmount, incomeTax, incomeTaxAmount, totaxTaxAmount } = this.state.warningData.arcBillingTaxInfo
    return [{
      title: '城建',
      taxRate: constructionTax,
      tax: constructionTaxAmount,
    }, {
      title: '教育',
      taxRate: educationTax,
      tax: educationTaxAmount,
    }, {
      title: '所得税',
      taxRate: incomeTax,
      tax: incomeTaxAmount,
    }, {
      title: '合计',
      taxRate: '',
      tax: totaxTaxAmount,
    }]
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
    const formItemLayout2 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    }
    const columns = [
      {
      title: '操作',
      dataIndex: 'action',
      width: 60,
      fixed: 'left',
      render: (text, record, index) => (
        <div>
          {
            record.isParent === 1 ?
            <Button type="primary" ghost onClick={() => this.handleAdd(record.lineNo, record.arBillingId, record.contractItemId)}>+</Button>
            : null
          }
          {
            record.isParent === 0 ?
              <Button type="primary" ghost onClick={() => this.handleDelete(record)}>-</Button>
              : null
          }
        </div>
      )
    }, {
      title: '组号',
      dataIndex: 'groupNo',
      width: 50,
      fixed: 'left',
    }, {
      title: '开票内容',
      dataIndex: 'billingContent',
      width: 200,
      render: (text, record, index) => (
        <SelectSearch
          url="/arc/billingApplication/billingContent/search"
          columns={contentCols}
          label="开票内容"
          width="1000px"
          idKey="billingRecordId"
          valueKey="billingContentName"
          value={['', this.state.dataSource[index]['billingContent']]}
          onChange={(v) => this.handleChange(v, 'billingContent', index)}
          showSearch={true}
        />
      )
    }, {
      title: '规格型号',
      dataIndex: 'specificationType',
      width: 100,
      render: (text, record, index) => (
        <Input placeholder="规格型号" value={this.state.dataSource[index]['specificationType']} onChange={(e) => this.handleChange(e.target.value, 'specificationType', index)}/>
      )
    }, {
      title: '单位',
      dataIndex: 'unit',
      width: 80,
      render: (text, record, index) => (
        <Input placeholder="单位" value={this.state.dataSource[index]['unit']}  onChange={(e) => this.handleChange(e.target.value, 'unit', index)} />
      )
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: 70,
      render: (text, record, index) => (
        <InputNumber
          placeholder="数量"
          defaultValue="1"
          min={0}
          value={this.state.dataSource[index]['quantity']}
          onChange={(value) => this.handleChange(value, 'quantity', index)} />
      )
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      render: (text, record, index) => (
        <InputNumber
          placeholder="单价"
          min={0}
          value={this.state.dataSource[index]['unitPrice']}
          onChange={(value) => this.handleChange(value, 'unitPrice', index)}
        />
      )
    }, {
      title: '不含税金额',
      dataIndex: 'billingAmountExcludeTax',
      width: 100,
      render: (text, record, index) => (
        <InputNumber
          placeholder="不含税金额"
          min={0}
          value={this.state.dataSource[index].billingAmountExcludeTax}
          onChange={(value) => this.handleChange(value, 'billingAmountExcludeTax', index, record)}/>
      )
    }, {
      title: <span>含税金额<b style={{color:'#FF0000'}}>(*)</b></span>,
      dataIndex: 'billingAmount',
      width: 100,
      render: (text, record, index) => (
        <InputNumber
          placeholder="含税金额"
          min={0}
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
          hasEmpty={false}
          value={`${this.state.dataSource[index]['billingTaxRate']}`}
          onChange={(v) => this.handleChange(v, 'billingTaxRate', index)}
        />
      )
    }, {
      title: '税额',
      dataIndex: 'billingTaxAmount',
      width: 100,
      render: (text, record, index) => (
        <InputNumber
          placeholder="税额"
          min={0}
          value={this.state.dataSource[index]['billingTaxAmount']}
          onChange={(value) => this.handleChange(value, 'billingTaxAmount', index)}
        />
      )
    }]
    const props = {
      action: `${process.env.REACT_APP_GATEWAY}v1.0.0/arc/file/upload/${this.state.file.name}`,
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      showUploadList: { showPreviewIcon: true, showRemoveIcon: true },
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest,
      onChange: this.handleFileChange,
    };
    const { custInfo, comInfo, contractList, outcomeList } = this.props.detail
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
        width="1200px"
        style={{ top: 20 }}
        visible={true}
        wrapClassName="vertical-center-modal"
        footer={[
          <Button key="submit" type="primary" loading={this.state.loading || this.props.isLoading} onClick={this.handleOk}>
            {!(this.state.loading || this.props.isLoading) ? <Icon type="check" /> : ''}开票
          </Button>,
        ]}
        onCancel={() => this.props.onCancel()}
      >
        <Form
          className="ant-search-form"
        >
          <Row>
            <Col span={14}>
              <Button
                className="scan-document"
                type="primary"
                ghost
                onClick={() => this.setState({ showContractLink: true })}
              >合同审批表及合同扫描件</Button>
            </Col>
          </Row>
          {
            this.props.isRed ?
              <Row gutter={40}>
                <Col span={8} key={1}>
                  <FormItem {...formItemLayout} label="是否重新开票:">
                    {getFieldDecorator('isAgainInvoice',{
                      initialValue: '', rules: [{ required: this.props.isRed, message: '请选择是否重新开票' }]
                    })(
                      <Select onChange={(v) => this.setState({showDetail: v === 'true' ? true : false })}>
                        <Option value="">-请选择-</Option>
                        <Option value="true">是</Option>
                        <Option value="false">否</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row> : null
          }
          {
            (this.props.isRed && this.state.showDetail) || !this.props.isRed ?
              <div>
                <div className="arc-info">
                  <Table
                    columns={proApplyColumns}
                    bordered
                    size="small"
                    scroll={{ x: '1570px' }}
                    dataSource={contractList}
                    pagination={false}
                  />
                </div>
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
                <Row gutter={40}>
                  <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label="费用承担者">
                      {getFieldDecorator('costBear', {
                        initialValue: '', rules: [{ required: this.state.isCostBearEdit, message: '请选择费用承担着!' }]
                      })(
                        <SelectInvokeApi
                          typeCode="BILLING_APPLICATION"
                          paramCode="COST_BEAR"
                          placeholder="费用承担着"
                          hasEmpty
                          disabled={!this.state.isCostBearEdit}
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
                        getFieldDecorator('billingDate', {initialValue: moment(), rules: [{ required: true, message: '请选择开票日期!' }]})(
                          <DatePicker format="YYYY-MM-DD"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <div className="add-btns">
                  <Button type="primary" disabled={this.state.selectedRows.length === 0} style={{marginLeft: '5px'}} ghost onClick={() => this.billingUnify()}>统一开票</Button>
                </div>
                <Table
                  rowSelection={rowSelection}
                  style={{marginBottom: '10px'}}
                  rowKey="lineNo"
                  bordered
                  size="small"
                  columns={columns}
                  pagination={false}
                  dataSource={this.state.dataSource}
                  scroll={{ x: 1160 }}
                />
                <Row gutter={40}>
                  <Col span={14}>
                    <FormItem {...formItemLayout1} label="发票备注">
                      {
                        getFieldDecorator('billingApplicantRemark')(
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
                        getFieldDecorator('file', { rules: [{ required: uploadFileType.includes(this.props.billType), message: '请上传附件!' }] })(
                          <Upload {...props} fileList={this.state.fileList}>
                            <Button>
                              <Icon type="upload" />点击上传
                            </Button>
                            <span className="file-tip">说明：未大签项目需要上传合同附件</span>
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
                        getFieldDecorator('billingApplicantRequest', {rules: [
                          { required: requirementType.includes(this.props.billType), message: this.props.billType === 'BILLING_RED' ? '请在此处填写退票原因!' : '请填写开票原因' },
                          { max: 350, message: '开票要求不能超过350个字符!' }
                        ]})(
                          <TextArea placeholder="请输入开票要求" rows="2" />
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <h3 className="sent-info">寄件信息</h3>
                <Row gutter={40}>
                  <Col span={8} key={1}>
                    <FormItem {...formItemLayout2} label="收件人">
                      {getFieldDecorator('expressReceiptName')(
                        <Input placeholder="收件人"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} key={2}>
                    <FormItem {...formItemLayout2} label="收件人公司">
                      {
                        getFieldDecorator('expressReceiptCompany')(
                          <Input placeholder="收件人公司"/>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8} key={3}>
                    <FormItem {...formItemLayout2} label="收件人电话">
                      {
                        getFieldDecorator('expressReceiptPhone')(
                          <Input placeholder="收件人电话"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40}>
                  <Col span={8} key={1}>
                    <FormItem {...formItemLayout2} label="收件人城市">
                      {getFieldDecorator('expressReceiptCity')(
                        <Input placeholder="收件人城市"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} key={2}>
                    <FormItem {...formItemLayout2} label="收件人详细地址">
                      {
                        getFieldDecorator('expressReceiptAddress')(
                          <Input placeholder="收件人详细地址"/>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40}>
                  <Col span={8} key={1}>
                    <FormItem {...formItemLayout2} label="E-mail">
                      {getFieldDecorator('receiptEmail', {
                        initialValue: this.props.currentUser.email, rules: [{
                          type: 'email', message: '请输入正确的E-mail!',
                        }, { required: true, message: '请填写E-mail!' }]
                      })(
                        <Input placeholder="E-mail"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
              : null
          }
          {
            this.state.showDetail === false && this.props.isRed ?
              <div className="infoPanel">
                <h1>项目信息</h1>
                <Table
                  columns={proApplyColumns}
                  bordered
                  size="small"
                  scroll={{ x: '1570px' }}
                  dataSource={contractList}
                  pagination={false}
                />
                <div className="infoPanel">
                  <h1>退票详情</h1>
                  <Table
                    rowKey="receiptClaimId"
                    columns={billDetailColumns}
                    bordered
                    size="small"
                    scroll={{ x: '1580px' }}
                    dataSource={outcomeList}
                    pagination={false}
                  />
                </div>
                <Row gutter={40}>
                  <Col span={14}>
                    <FormItem {...formItemLayout1} label="附件">
                      {
                        getFieldDecorator('file', { rules: [{ required: this.state.showDetail === false && this.props.isRed, message: '请上传附件!' }] })(
                          <Upload {...props} fileList={this.state.fileList}>
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
                        getFieldDecorator('billingApplicantRequest', {rules: [
                          { required: this.state.showDetail === false && this.props.isRed, message: '请填写开票要求' },
                          { max: 350, message: '开票要求不能超过350个字符!' }
                        ]})(
                          <TextArea placeholder="请输入开票要求" rows="2" />
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </div> : null
          }
          {
            this.state.showWarning ?
              <Modal
                title="提示"
                visible={this.state.showWarning}
                onOk={() => this.handleWarningOk()}
                onCancel={() => this.setState({showWarning: false})}
              >
                {
                  this.state.warningData.isWarning === 'Y' ?
                    <p>{this.state.warningData.warningMessage}</p> : ''
                }
                <p className="tips">提示：以下数据将计入项目成本/部门费用</p>
                <div className="arc-info">
                  <Table
                    rowKey="id"
                    size="small"
                    bordered
                    columns={totalColumns}
                    dataSource={this.getWarningTableData()}
                    pagination={false}
                  />
                </div>
              </Modal> : null
          }
          {
            this.state.showContractLink ?
              <UrlModalCom
                closeModal={() => this.setState({showContractLink: false}) }
                contractUrl={this.props.contractUrl}
              /> : null
          }
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(BillDetail)

