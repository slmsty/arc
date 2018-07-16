/**
 * Created by liangshuang on 18/3/23.
 */
/**
 * Created by liangshuang on 17/11/10.
 */
import React from 'react'
import { Table, Button, message, Modal } from 'antd'
import requestJsonFetch from '../../http/requestJsonFecth'
const advanceTypes = ['BILLING_CONTRACT', 'BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT']
const urlColumns = [{
    title: '是否已大签',
    dataIndex: 'isContractedName',
    width: 150,
  }, {
    title: '合同审批状态',
    dataIndex: 'approvalStatusName',
    width: 150,
  }, {
    title: '合同审批表链接',
    dataIndex: 'approvalSite',
    width: 300,
    render: (text) => (
      <a href={text} target="_blank">text</a>
    )
  }
]
class UrlModalCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      result: []
    }
  }
  componentDidMount() {
    if(advanceTypes.includes(this.props.billType)) {
      requestJsonFetch(`/arc/billingApplication/searchContractApproveAddress/{${this.props.approvalNo}`, {
        method: 'GET',
      }, (res) => {
        if(res && res.response && res.response.resultCode === '000000') {
          this.setState({
            result: res.response.data
          })
        }
      });
    }
  }
  render() {
    return (
      <Modal
        width={800}
        visible={true}
        onOk={this.props.closeModal}
        onCancel={this.props.closeModal}
        title=""
        footer={false}
      >
        {
          advanceTypes.includes(this.props.billType) ?
            <div>
              <h3 style={{padding: '10px 0'}}>未大签合同审批表</h3>
              <Table
                columns={urlColumns}
                bordered
                size="small"
                dataSource={this.state.result}
                pagination={false}
              />
            </div>
             :
            <div>
              <h3>{`该合同有${this.state.result.length}条审批记录:`}</h3>
              <ul style={{minHeight:'150px',marginTop:'20px'}}>
                {this.props.contractUrl.map(item=>{
                  return(
                    <li><a href={item.url} target="_blank">{item.contractName}</a></li>
                  )
                })}
              </ul>
            </div>
        }
      </Modal>
    )
  }
}

export default UrlModalCom
