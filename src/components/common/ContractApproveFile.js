import React from 'react'
import { Table, Button, message, Modal, Row, Col } from 'antd'
import requestJsonFetch from '../../http/requestJsonFecth'
import { hideContractUrl } from '../billApplication/billColumns'
const advanceTypes = ['BILLING_UN_CONTRACT', 'BILLING_UN_CONTRACT_PROJECT', 'BILLING_UN_CONTRACT_UN_PROJECT']
const urlColumns = [{
    title: '是否已大签',
    dataIndex: 'isContractedName',
    width: 100,
  }, {
    title: '合同审批状态',
    dataIndex: 'approvalStatusName',
    width: 100,
  }, {
    title: '合同审批表链接',
    dataIndex: 'approvalSite',
    width: 300,
    render: (text) => (
      <a href={text} target="_blank">{text}</a>
    )
  }
]
class ContractApproveFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      result: [],
      showContractLink: false,
    }
  }
  componentDidMount() {
    if(advanceTypes.includes(this.props.billType)) {
      requestJsonFetch(`/arc/billingApplication/searchContractApproveAddress/${this.props.approvalNo}`, {
        method: 'GET',
      }, (res) => {
        if(res && res.resultCode === '000000') {
          this.setState({
            result: res.data ? [res.data] : []
          })
        }
      });
    }
  }

  handleCloseModal = () => {
    this.setState({ showContractLink: false })
  }

  render() {
    const { billType, contractUrl=[] } = this.props
    return (
      <div>
        {
          !hideContractUrl.includes(billType) &&
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
        }
        <Modal
          width={800}
          visible={this.state.showContractLink}
          onOk={this.handleCloseModal}
          onCancel={this.handleCloseModal}
          title="合同审批表"
          footer={false}
        >
          {
            advanceTypes.includes(billType) ?
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
                <h3>{`该合同有${contractUrl.length}条审批记录:`}</h3>
                <ul style={{minHeight:'150px',marginTop:'20px'}}>
                  {contractUrl.map(item=>{
                    return(
                      <li><a href={item.url} target="_blank">{item.contractName}</a></li>
                    )
                  })}
                </ul>
              </div>
          }
        </Modal>
      </div>
    )
  }
}

export default ContractApproveFile
