import * as React from 'react';
// MUI CUSTOM style imports
import { withStyles } from '@material-ui/core/styles';
// local imports
import styles from '../styles/page-styles/DefaultPageMuiStyles'

class Jdenticon extends React.Component{
  el = null
  componentDidUpdate() {
    window.jdenticon.update(this.el)
  }

  componentDidMount() {
    window.jdenticon.update(this.el)
  }

  render () {
    const { hash } = this.props
    return <svg
      {...this.props}
      style={{ verticalAlign: 'middle' }}
      ref={el => this.handleRef(el)}
      width="105px"
      height="105px"
      data-jdenticon-value={hash}
      />
  }

  handleRef (el: any) {
    this.el = el
  }
}

export default withStyles(styles)(Jdenticon);
