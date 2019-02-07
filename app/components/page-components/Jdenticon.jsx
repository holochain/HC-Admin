import React from 'react';

const el = null
export default class Jdenticon extends React.Component {
  componentDidUpdate() {
    window.jdenticon.update(this.el)
  }

  componentDidMount() {
    window.jdenticon.update(this.el)
  }

  render () {
    const { hash } = this.props
    return <svg
      { ...this.props }
      style={{verticalAlign: 'middle', maxWidth:'100%'}} // style={...styles} style ===> (..if wish to concat styles with parent styles)
      ref={(el) => this.handleRef(el)} // tslint:disable-line
      width="60px"
      height="60px"
      data-jdenticon-value={hash}
      />
  }

  handleRef (el: any) { // tslint:disable-line
    this.el = el
  }
}
