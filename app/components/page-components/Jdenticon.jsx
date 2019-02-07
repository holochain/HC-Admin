import * as React from 'react';

export default class Jdenticon extends React.Component {
  el = null;
  componentDidUpdate() {
    window.jdenticon.update(this.el)
  }

  componentDidMount() {
    window.jdenticon.update(this.el)
  }

  render () {
    const {hash} = this.props
    return <svg
        {...this.props}
        style={{verticalAlign: 'middle'}}
        ref={el => this.handleRef(el)}
        width="25px"
        height="25px"
        data-jdenticon-value={hash}
      />
  }

  handleRef (el: any) {
    this.el = el
  }
}
