import React from 'react'

//  eslint-disable-next-line react/prefer-stateless-function
export default class Root extends React.Component {

  render() {
    return (
      <div>
        欢迎访问应收结算系统（ARC），如果需要使用帮助，请点击右上角的“ARC系统帮助” 。
        <div className="notice">
          <p>通知：</p>
          <p>从2018.07.23起，1BG下所有公司的收据申请，移至“应收结算”系统申请，功能入口如下：开票管理--->收据申请；
            如有疑问，请点击右上角ARC系统帮助或者联系AR管理员。
          </p>
        </div>
      </div>
    )
  }
}
