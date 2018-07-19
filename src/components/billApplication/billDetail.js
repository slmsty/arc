import React from 'react'
import { Form, Button, Input, Row, Col, Select, DatePicker, Table, Modal, Upload, message, Icon, InputNumber, Checkbox } from 'antd'
import './billDetail.less'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSearch from './selectSearch'
import InputSearch from './inputSearch'
import requestJsonFetch from '../../http/requestJsonFecth'
import moment from 'moment'
import { totalColumns, normalTypes, proApplyColumns, billDetailColumns, clientCols, comCols, contentOnlyCols } from './billColumns'
import UrlModalCom from '../common/getUrlModal'
import MultipleInput from '../common/multipleInput'
import { toThousands } from '../../util/currency'
import {checkEmail} from "../../util/common";
const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
const uploadFileType = ['BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT', 'BILLING_OTHER']
const requirementType = ['BILLING_RED', 'BILLING_RED_OTHER', 'BILLING_EXCESS']
const hideContractUrl = ['BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT', 'BILLING_OTHER']
const advanceTypes = ['BILLING_CONTRACT', 'BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT']
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 },
}
const formItemLayout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const formItemLayout2 = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
}
class BillDetail extends React.Component {
  constructor(props) {
    super(props)
    const { custInfo, comInfo } = props.detail
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
      taxData: {},
      submitParams: {},
      showContractLink: false,
      isRequireRate: false,
      isLost: false,
      custInfo: custInfo,
      comInfo: comInfo,
      proItems: [],
    }
    this.isAdvance = advanceTypes.includes(props.billType)
  }

  componentDidMount() {
    let data = []
    const { appLineList, appLineItems, contractList, fileName, filePath } = this.props.detail
    const items = this.props.type === 'myApply' ? appLineList : appLineItems
    items.map((item, index) => {
      data.push({
        lineNo: index,
        billingAppLineId: item.billingAppLineId ? item.billingAppLineId : '',
        sourceAppLineId: item.sourceAppLineId ? item.sourceAppLineId : '',
        groupNo: item.groupNo ? parseInt(item.groupNo) : 1,
        isParent: '1',
        arBillingId: item.arBillingId,
        contractItemId: item.contractItemId,
        billingRecordId: item.billingRecordId ? item.billingRecordId : '',
        billingContent: item.billingContent ? item.billingContent : '',
        specificationType: item.specificationType ? item.specificationType : '',
        unit: item.unit ? item.unit : this.getInvoiceUnit(item.billingTaxRate ? item.billingTaxRate : 0),
        quantity: item.quantity ? item.quantity : 1,
        unitPrice: item.unitPrice  ? item.unitPrice : item.billingAmountExcludeTax,
        billingAmountExcludeTax: item.billingAmountExcludeTax ? item.billingAmountExcludeTax : 0,
        billingAmount: item.billingAmount ? item.billingAmount : 0,
        billingTaxRate: item.billingTaxRate ? item.billingTaxRate : 0,
        billingTaxAmount: item.billingTaxAmount ? item.billingTaxAmount : 0,
        totalAmount: item.billingAmount ? item.billingAmount : 0,
      })
    })
    let proItems = []
    contractList.map((record) => {
      proItems.push({
        arBillingId: record.arBillingId,
        advanceBillingReason: record.advanceBillingReason,
        receiptReturnDate: record.receiptReturnDate ? moment(record.receiptReturnDate) : '',
      })
    })

    const fileList = filePath ? [{
      uid: new Date().getTime(),
      name: fileName,
      status: 'done',
      response: '', // custom error message to show
      url: '',
      }] : []
    this.setState({
      dataSource: data,
      count: data.length,
      proItems: proItems,
      fileList: fileList
    })
  }

  handleAdd = (lineNo, arBillingId, contractItemId) => {
    let { count, dataSource } = this.state;
    const newData = {
      lineNo: count,
      groupNo: 1,
      isParent: '0',
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
    let parentIndex = 0
    this.state.dataSource.map((item, index) => {
      if(record.arBillingId === item.arBillingId && item.isParent === '1') {
        parentIndex = item.lineNo
        const amount = dataSource[item.lineNo]['billingAmount']
        dataSource[item.lineNo]['billingAmount'] = parseFloat(record.billingAmount) + parseFloat(amount)
      }
    })
    const { billingTaxRate, quantity, billingAmount } = dataSource[parentIndex]
    this.calBillAmountTax(dataSource, parentIndex, billingAmount, billingTaxRate, quantity)
    dataSource.splice(record.lineNo, 1)
    const newSource = dataSource.map((record, index) => ({
      ...record,
      lineNo: index,
    }))
    this.setState({ dataSource: newSource });
  }

  handleOk = (e) => {
    e.preventDefault();
    const { isRed, billingOutcomeIds, type, detail } = this.props
    //红冲发票不重新开票
    if(isRed && this.props.form.getFieldValue('isAgainInvoice') === 'false') {
      this.props.form.validateFields((err, values) => {
        if(!err) {
          this.setState({loading: true})
          const params = {
            ...values,
            billingOutcomeIds,
            billingApplicationType: this.props.billType,
            objectId: this.state.fileId,
            objectName: this.state.file.name,
            billingApplicantRequest: values.billingApplicantRequest ? values.billingApplicantRequest.trim() : '',
            isAgainInvoice: 'false',
          }
          this.props.billApplySave(params).then(res => {
            this.setState({loading: false})
          })
        }
      })
    } else {
      this.props.form.validateFields((err, values) => {
        const groupNos = this.state.dataSource.filter(r => typeof r.groupNo !== 'undefined')
        if (!err && !this.submitCheck(values)) {
          this.setState({loading: true})
          const appLineItems = this.state.dataSource.map(record => ({
            ...record,
            lineNo: record.lineNo + 1,
            groupNo: groupNos.length > 0 ? record.groupNo : 1,
          }))
          const params = {
            ...values,
            billingOutcomeIds,
            billingCustInfoId: this.state.custInfo.billingCustInfoId,
            billingComInfoId: this.state.comInfo.billingComInfoId,
            billingApplicationType: this.state.isRequireRate ? 'BILLING_EXCESS' : this.props.billType,
            billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
            billingApplicantRemark: values.billingApplicantRemark ? values.billingApplicantRemark.trim() : '',
            billingApplicantRequest: values.billingApplicantRequest ? values.billingApplicantRequest.trim() : '',
            appLineItems: appLineItems,
            arBillingItems: this.state.proItems.map(pro => {
              return {
                ...pro,
                receiptReturnDate: pro.receiptReturnDate ? pro.receiptReturnDate.format('YYYY-MM-DD') : '',
              }
            }),
            objectId: this.state.fileId,
            objectName: this.state.file.name,
            isAgainInvoice: 'true',
            billingApplicationId: type === 'myApply' ? detail.billingApplicationId : '',
            startWorkFlow: type === 'myApply' ? 'Y' : '',
            receiptEmail: values.receiptEmail.length > 0 ? values.receiptEmail.join(',') : '',
            specialTaxRate: this.state.isRequireRate ? 'Y' : 'N',
          }
          if(this.props.billType === 'BILLING_EXCESS' || this.state.isRequireRate) {
            const checkParams = {
              appLineItems: appLineItems,
            }
            this.props.getTaxInfo(checkParams).then(res => {
              if(res && res.response && res.response.resultCode === '000000') {
                this.setState({
                  showWarning: true,
                  taxData: res.response.data,
                  submitParams: params,
                })
              }
            })
          } else {
            this.props.billApplySave(params).then(res => {
              this.setState({loading: false})
            })
          }
        }
      });
    }
  }

  submitCheck = (values) => {
    let err = false
    for(let i = 0; i< this.state.dataSource.length; i++) {
      const record = this.state.dataSource[i]
      if(record.billingAmount <= 0) {
        message.warning(`第${i + 1}行【开票含税金额】必须大于0`)
        err = true
        break
      }
      if(this.state.isRequireRate && (record.billingTaxRate === '' || typeof record.billingTaxRate === 'undefined')) {
        message.warning(`第${i + 1}行【开票税率】不能为空!`)
        err = true
        break
      }
    }
    if(this.isAdvance) {
      for(let i = 0; i< this.state.proItems.length; i++) {
        const r  = this.state.proItems[i]
        if(r.advanceBillingReason === '' || typeof r.advanceBillingReason === 'undefined') {
          message.warning('【提前开票原因】不能为空!')
          err = true
          break
        } else if (!r.receiptReturnDate || (r.receiptReturnDate && r.receiptReturnDate.format('YYYY-MM-DD') === 'Invalid date')) {
          message.warning('【预计回款日期】不能为空!')
          err = true
          break
        }
      }
    }
    if(!this.state.custInfo) {
      message.warning('请选择购买方的客户信息!')
      err = true
    }
    if(!this.state.comInfo) {
      message.warning('请选择销售方的客户信息!')
      err = true
    }
    if(this.props.type === 'billApply' && uploadFileType.includes(this.props.billType) && !this.state.fileId) {
      message.warning('请上传完附件，再提交开票申请')
      err = true
    }

    let invalidEmail = []
    values.receiptEmail.map(email => {
      if(!checkEmail(email)) {
        invalidEmail.push(email)
      }
    })
    if(invalidEmail.length > 0) {
      this.props.form.setFields({
        receiptEmail: {
          value: values.receiptEmail,
          errors: [new Error(`邮箱${invalidEmail.join(',')}格式有误，请重新输入`)],
        },
      });
      err = true
    }
    if(values.receiptEmail.length > 0  && values.receiptEmail.join(',').length > 500) {
      this.props.form.setFields({
        receiptEmail: {
          value: values.receiptEmail,
          errors: [new Error('收件人邮件不能超过500个字符')]
        }
      })
    }
    return err
  }

  handleWarningOk = () => {
    this.setState({showWarning: false})
    this.props.billApplySave(this.state.submitParams).then(res => {
      this.setState({loading: false})
    })
  }

  handleChange = (value, col, index, record) => {
    let dataSource = this.state.dataSource
    if(col === 'billingContent') {
      dataSource[index]['billingRecordId'] = value[0]
      dataSource[index][col] = value[1]
    } else if(col === 'billingAmount') {
      const { billingAmount, billingTaxRate, quantity } = this.state.dataSource[index]
      if(record.isParent === '1') {//操作的记录为父节点
        dataSource[index]['billingAmount'] = value
        dataSource[index]['totalAmount'] = value
        this.calBillAmountTax(dataSource, index, value, billingTaxRate, quantity)
      } else {
        const result = dataSource.filter(d => d.isParent === '1' && record.arBillingId === d.arBillingId)[0]
        let total = 0
        //1、计算子节点金额总和
        dataSource.map(d => {
          if(d.arBillingId === record.arBillingId && d.isParent === '0' && d.lineNo !== index){
            total += (d.billingAmount ? d.billingAmount : 0)
          }
        })
        const childAmount = total + value
        //2、父节点金额重新计算
        dataSource[result.lineNo]['billingAmount'] = result.totalAmount - childAmount
        const parent = this.state.dataSource[result.lineNo]
        this.calBillAmountTax(dataSource, result.lineNo, parent.billingAmount, parent.billingTaxRate, parent.quantity)
        //3、子节点金额重新计算
        dataSource[index]['billingAmount'] = value
        this.calBillAmountTax(dataSource, index, value, billingTaxRate, quantity)
      }
    } else if (col === 'billingTaxRate') {
      const { billingAmount, quantity} = this.state.dataSource[index]
      this.calBillAmountTax(dataSource, index, billingAmount, value, quantity)
      dataSource[index][col] = value
      dataSource[index]['unit'] = this.getInvoiceUnit(value)
    } else if (col === 'quantity') {
      dataSource[index][col] = value
      const { billingAmount,  billingTaxRate } = this.state.dataSource[index]
      this.calBillAmountTax(dataSource, index, billingAmount, billingTaxRate, value)
    } else if (col === 'billingTaxAmount') {
      dataSource[index][col] = value
      const { billingAmount, quantity } = this.state.dataSource[index]
      dataSource[index].billingAmountExcludeTax = billingAmount - value
      dataSource[index].unitPrice = ((billingAmount - value) / quantity).toFixed(2)
    } else {
      dataSource[index][col] = value
    }
    this.setState({
      dataSource: dataSource
    })
  }

  getInvoiceUnit = (v) => {
    const rate = parseFloat(v)
    if(rate === 0 || rate === 0.06) {
      return '项'
    } else if (rate === 0.16 || rate === 0.17) {
      return '套'
    }
  }

  beforeUpload = (file) => {
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('上传文件大小必须小于20MB!');
      return false
    }
    if(file.name.length > 40) {
      message.error('上传的文件名必须小于40个中文')
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
      console.log(response, response.data)
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
      message.error(`${this.state.file.name} 上传失败`);
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
    //不含税金额
    const excludeTax = billingAmount / (1 + parseFloat(billingTaxRate))
    dataSource[index]['billingAmountExcludeTax'] = excludeTax.toFixed(2)
    //单价
    dataSource[index]['unitPrice'] = (excludeTax / (quantity ? quantity : 1)).toFixed(2)
    //含税金额
    dataSource[index]['billingTaxAmount'] = (excludeTax * billingTaxRate).toFixed(2)
  }

  getWarningTableData = () => {
    const { constructionTax, constructionTaxAmount, educationTax, educationTaxAmount, incomeTax, incomeTaxAmount, addTaxAmount, totalTaxAmount } = this.state.taxData
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
      title: '增值税',
      taxRate: '',
      tax: addTaxAmount,
    }, {
      title: '合计',
      taxRate: '',
      tax: totalTaxAmount,
    }]
  }

  getCustInfoColumns = () => {
    return [{
      title: '',
      dataIndex: 'title',
      width: 50,
      float: 'left',
    }, {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 200,
      float: 'left',
      render: (text, record, index) => (
        index === 0 ?
          <InputSearch
            width='700px'
            url="/arc/billingApplication/custom/search"
            columns={clientCols}
            label="客户名称"
            idKey="billingCustInfoId"
            valueKey="custName"
            showSearch={true}
            value={this.state.custInfo}
            onChange={(v) => this.setState({custInfo: v})}
          /> :
          <InputSearch
            width='800px'
            url="/arc/billingApplication/company/search"
            columns={comCols}
            label="公司名称"
            idKey="billingComInfoId"
            valueKey="comName"
            showSearch={true}
            value={this.state.comInfo}
            onChange={(v) => this.setState({comInfo: v})}
          />
      )
    }, {
      title: '纳税人识别码',
      dataIndex: 'taxPayer',
      width: 100,
    }, {
      title: '地址电话',
      dataIndex: 'address',
      width: 200,
    }, {
      title: '开户行及账号',
      dataIndex: 'bankAccount',
      width: 180,
    }]
  }

  getEditColumns = () => {
    return [
      {
        title: '操作',
        dataIndex: 'action',
        width: 60,
        render: (text, record, index) => (
          <div>
            {
              record.isParent === '1' ?
                <Button type="primary" ghost onClick={() => this.handleAdd(record.lineNo, record.arBillingId, record.contractItemId)}>+</Button>
                : null
            }
            {
              record.isParent === '0' ?
                <Button type="primary" ghost onClick={() => this.handleDelete(record)}>-</Button>
                : null
            }
          </div>
        )
      }, {
        title: <span>含税金额<b style={{color:'#FF0000'}}>*</b></span>,
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
            disabled={!this.state.isRequireRate && normalTypes.includes(this.props.billType)}
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
      }, {
        title: '开票内容',
        dataIndex: 'billingContent',
        width: 200,
        render: (text, record, index) => (
          <SelectSearch
            url="/arc/billingApplication/billingContent/search"
            columns={contentOnlyCols}
            label="开票内容"
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
      }]
  }

  proItemChange = (index, columns, value) => {
    let proData = this.state.proItems
    if(columns === 'receiptReturnDate') {
      proData[index][columns] = value
    } else {
      proData[index][columns] = value
    }
    this.setState({proItems: proData})
  }

  getProInfoColumns = () => {
    const { billType } = this.props
    return [{
      title: '项目编码',
      dataIndex: 'projectCode',
      width: 120,
    }, {
      title: '签约公司',
      dataIndex: 'company',
      width: 240,
    }, {
      title: '合同编码',
      dataIndex: 'contractCode',
      width: 300,
    }, {
      title: '提前开票原因',
      dataIndex: 'advanceBillingReason',
      width: 300,
      render: (text, record, index) => (
        this.isAdvance ?
          <SelectInvokeApi
            typeCode="BILLING_APPLICATION"
            paramCode="ADVANCE_BILLING_REASON"
            placeholder="提前开票原因"
            hasEmpty
            value={this.state.proItems.length > 0 ? this.state.proItems[index]['advanceBillingReason'] : ''}
            onChange={(value) => this.proItemChange(index, 'advanceBillingReason', value)}
          /> : record.advanceBillingReasonName
      )
    }, {
      title: '预计回款日期',
      dataIndex: 'receiptReturnDate',
      width: 150,
      render: (text, record, index) => (
        this.isAdvance ?
          <DatePicker
            value={this.state.proItems.length > 0 ? this.state.proItems[index]['receiptReturnDate'] : ''}
            onChange={(value, str) => this.proItemChange(index, 'receiptReturnDate', value)}
          /> : text
      )
    }, {
      title: '付款条件',
      dataIndex: 'paymentTerm',
      width: 200,
    }, {
      title: '款项名称',
      dataIndex: 'paymentName',
      width: 150,
    }, {
      title: '付款阶段',
      dataIndex: 'paymentPhrases',
      width: 150,
    }, {
      title: '款项金额',
      dataIndex: 'paymentAmount',
      width: 80,
    }, {
      title: '已申请金额',
      dataIndex: 'applyIngAmount',
      width: 100,
    }, {
      title: '已开票金额',
      dataIndex: 'outcomeAmount',
      width: 100,
    }]
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { contractList, outcomeList, billingType, billingApplicantRequest, costBear, billingDate,
      billingApplicantRemark, taxRateRequest, fileName, filePath } = this.props.detail
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
    const { custInfo, comInfo } = this.state
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
        title="开票申请详情"
        width="1200px"
        style={{ top: 20 }}
        visible={true}
        wrapClassName="vertical-center-modal"
        footer={[
          <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
            {!this.state.loading ? <Icon type="check" /> : ''}申请
          </Button>,
        ]}
        onCancel={() => this.props.onCancel()}
        maskClosable={false}
      >
        <Form
          className="ant-search-form"
        >
          {
            !hideContractUrl.includes(this.props.billType) ?
              <Row>
                <Col span={14}>
                  <Button
                    className="scan-document"
                    type="primary"
                    ghost
                    onClick={() => this.setState({ showContractLink: true })}
                  >合同审批表及合同扫描件</Button>
                </Col>
              </Row> : null
          }
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
                <Col span={8} key={2}>
                  <FormItem {...formItemLayout} label="发票是否丢失">
                    {getFieldDecorator('isLose', {initialValue: ''} )(
                      <Select onChange={(v) => this.setState({isLost: v === 'Y'})}>
                        <Option value="">请选择</Option>
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                {
                  this.state.isLost ?
                    <Col span={8} key={3}>
                      <FormItem {...formItemLayout} label="丢失类型">
                        {
                          getFieldDecorator('loseType',{
                            initialValue: '',
                          })(
                            <SelectInvokeApi
                              typeCode="BILLING_APPLICATION"
                              paramCode="LOSE_TYPE"
                              placeholder="请选择丢失类型"
                              hasEmpty
                            />)
                        }
                      </FormItem>
                    </Col> : null
                }
              </Row> : null
          }
          {
            (this.props.isRed && this.state.showDetail) || !this.props.isRed ?
              <div>
                <div className="arc-info">
                  <Table
                    columns={this.getProInfoColumns()}
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
                    scroll={{ x: '1350px' }}
                    columns={this.getCustInfoColumns()}
                    dataSource={detailData}
                    pagination={false}
                  />
                </div>
                <Row gutter={40}>
                  <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label="费用承担者">
                      {getFieldDecorator('costBear', {
                        initialValue: costBear, rules: [{ required: this.props.billType === 'BILLING_EXCESS' || this.state.isRequireRate, message: '请选择费用承担着!' }]
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
                          initialValue: billingType, rules: [{ required: true, message: '请选择开票类型!' }]
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
                        getFieldDecorator('billingDate', {initialValue: moment(billingDate), rules: [{ required: true, message: '请选择开票日期!' }]})(
                          <DatePicker format="YYYY-MM-DD"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                {
                  normalTypes.includes(this.props.billType) ?
                    <Row>
                      <Col span={8} key={3}>
                        <FormItem {...formItemLayout} label="是否对税率要求">
                          {
                            getFieldDecorator('taxRateRequest', {initialValue: taxRateRequest})(
                              <Checkbox
                                onChange={(e) => {
                                  this.setState({isRequireRate: e.target.checked, isCostBearEdit: e.target.checked})
                                  if(!e.target.checked) {
                                    this.props.form.setFieldsValue({'costBear': ''})
                                  }
                                }}
                              >
                              </Checkbox>
                            )
                          }
                        </FormItem>
                      </Col>
                    </Row> : null
                }
                <Table
                  style={{margin: '10px 0'}}
                  rowKey="lineNo"
                  bordered
                  size="small"
                  columns={this.getEditColumns()}
                  pagination={false}
                  dataSource={this.state.dataSource}
                  footer={(currentPageData) => {
                    let totalAmount = 0
                    let totalTaxAmount = 0
                    currentPageData.map(item => {
                      totalAmount = totalAmount + parseFloat(item.billingAmount)
                      totalTaxAmount = totalTaxAmount + parseFloat(item.billingTaxAmount)
                    })
                    return <div className="totalAmount">
                      <span>合计</span>
                      <span>{toThousands(parseFloat(totalAmount.toFixed(2)))}</span>
                      <span>{toThousands(parseFloat(totalTaxAmount.toFixed(2)))}</span>
                    </div>
                  }}
                />
                <Row gutter={40}>
                  <Col span={14}>
                    <FormItem {...formItemLayout1} label="发票备注">
                      {
                        getFieldDecorator('billingApplicantRemark', {initialValue: billingApplicantRemark, rules:[{ max: 75, message: '发票备注不能超过75个汉字!' }]})(
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
                        getFieldDecorator('file', {initialValue: fileName, rules: [{ required: uploadFileType.includes(this.props.billType), message: '请上传附件!' }] })(
                            <div>
                              <div style={{float: 'left'}}>
                                <Upload {...props} fileList={this.state.fileList}>
                                  <Button disabled={this.state.fileList.length === 1}>
                                    <Icon type="upload" />点击上传
                                  </Button>
                                </Upload>
                              </div>
                              <span className="file-tip" style={{float: 'left'}}>说明：未大签、其他开票项目需要上传合同附件</span>
                            </div>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40}>
                  <Col span={14}>
                    <FormItem {...formItemLayout1} label="开票原因及要求">
                      {
                        getFieldDecorator('billingApplicantRequest', {initialValue: billingApplicantRequest, rules: [
                          { required: requirementType.includes(this.props.billType) || this.state.isRequireRate, message: this.props.billType === 'BILLING_RED' ? '请在此处填写退票原因!' : '请填写开票原因' },
                          { max: 350, message: '开票原因及要求不能超过350个字符!' }
                        ]})(
                          <TextArea placeholder="请输入开票原因及要求" rows="2" />
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <h3 className="sent-info">寄件信息</h3>
                <Row gutter={40}>
                  <Col span={8} key={1}>
                    <FormItem {...formItemLayout2} label="收件人">
                      {getFieldDecorator('expressReceiptName', {rules:[{ max: 10, message: '收件人不能超过10个汉字!' }]})(
                        <Input placeholder="收件人"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} key={2}>
                    <FormItem {...formItemLayout2} label="收件人公司">
                      {
                        getFieldDecorator('expressReceiptCompany', {rules:[{ max: 16, message: '收件人公司不能超过20个汉字!' }]})(
                          <Input placeholder="收件人公司"/>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={8} key={3}>
                    <FormItem {...formItemLayout2} label="收件人电话">
                      {
                        getFieldDecorator('expressReceiptPhone', {rules:[{ max: 16, message: '收件人电话不能超过20个字符!' }]})(
                          <Input placeholder="收件人电话"/>,
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40}>
                  <Col span={8} key={1}>
                    <FormItem {...formItemLayout2} label="收件人城市">
                      {getFieldDecorator('expressReceiptCity', {rules:[{ max: 16, message: '收件人城市不能超过20个汉字!' }]})(
                        <Input placeholder="收件人城市"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} key={2}>
                    <FormItem {...formItemLayout2} label="收件人详细地址">
                      {
                        getFieldDecorator('expressReceiptAddress', {rules:[{ max: 32, message: '收件人详细地址不能超过30个汉字!' }]})(
                          <Input placeholder="收件人详细地址"/>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40}>
                  <Col span={14} key={1}>
                    <FormItem {...formItemLayout1} label="E-mail">
                      {getFieldDecorator('receiptEmail', {
                        initialValue: [this.props.currentUser.email], rules: [{ required: true, message: '请填写E-mail!' }]
                      })(
                        <MultipleInput placeholder="填写多个E-mail请用英文逗号分隔" />
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
                        filePath ?
                          <a href="javascript:void(0)" onClick={() => this.props.fileDown({objectId: filePath, objectName: fileName})}>{fileName}</a>
                          :
                          getFieldDecorator('file', { rules: [{ required: false, message: '请上传附件!' }] })(
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
                    <FormItem {...formItemLayout1} label="开票原因及要求">
                      {
                        getFieldDecorator('billingApplicantRequest', {initialValue: billingApplicantRequest, rules: [
                          { required: this.state.showDetail === false && this.props.isRed, message: '请填写开票原因及要求' },
                          { max: 350, message: '开票原因及要求不能超过350个字符!' }
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
                onCancel={() => this.setState({showWarning: false, loading: false})}
              >
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
                billType={this.props.billType}
                approvalNo={contractList.length > 0 ? contractList[0].contractApprovalNo : ''}
              /> : null
          }
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(BillDetail)

