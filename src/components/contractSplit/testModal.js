/**
 * Created by liangshuang on 17/12/12.
 */
/**
 * Created by liangshuang on 17/12/8.
 */
import React from 'react'
import PropTypes from 'prop-types'
import SelectSbu from '../common/SelectSbu'
import ContractType from '../common/contractType1'
import ProductLine from '../common/productLine'
import MyDtatePicker from '../common/myDatePicker'
import SelectInvokeApi from '../common/selectInvokeApi'
import currency from '../../util/currency'
import percent from '../../util/percent'
import './contract.less'
import { Modal, Form, Table, Row, Col, Button, Input, Checkbox, DatePicker, Select, message, InputNumber } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

class TestModal extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      proSource: [],
    }
  }
componentDidMount(){

  const {tableDetail} = this.props
  const dataSource = tableDetail.slice(0)[0]

  this.setState({
    dataSource: dataSource,
    proSource:dataSource
  })
}
  inputChangge = (e) => {
  
    const value = e.target.value
    //const dataSource = {...this.state.dataSource}
    //console.log('this.props.tableDetail4.slice(0)[0]',this.props.tableDetail2.slice(0)[0])
    //dataSource.discount = e.target.value

    this.setState((old)=>(
      {dataSource:{...old.dataSource},discount:value}
    ))


/*    this.setState({
      dataSource
    },()=> {
      console.log('discount',dataSource.discount)
    })*/
}
  handleReturn = () => {
 
    const proSources = this.state.proSource
   
    this.setState({
      dataSource:proSources
    })
  }
  render() {
    
    return (
      <div>
        <Modal
          width={1024}
          maskClosable={false}
          title="合同拆分"
          visible={this.props.visible}
          onCancel={this.props.testClose}
          footer={[<Button onClick={this.handleReturn}>
            还原
          </Button>]}
        >
          <textarea onChange={(e)=>this.inputChangge(e)} value={this.state.dataSource.discount ? this.state.dataSource.discount : 0} />
        </Modal>
      </div>
    )
  }
}
const TestModalWithForm = Form.create()(TestModal)

export default TestModalWithForm
