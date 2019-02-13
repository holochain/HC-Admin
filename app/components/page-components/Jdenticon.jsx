import * as React from 'react';
// MUI CUSTOM style imports
import { withStyles } from '@material-ui/core/styles';
// local imports
import styles from '../styles/page-styles/DefaultPageMuiStyles'
import jdenticon from 'jdenticon'

class Jdenticon extends React.Component{
  el = null
  componentDidUpdate() {
    // window.jdenticon.update(this.el)
  }

  componentDidMount() {
    const size = 50;
    const value = this.props.hash;
    const image = jdenticon(value, size);
  }

  render () {
    const { hash } = this.props
    return <svg
      {...this.props}
      style={{ verticalAlign: 'middle' }}
      ref={el => this.handleRef(el)}
      width="50px"
      height="50px"
      data-jdenticon-value={hash}
      />
  }

  handleRef (el) {
    this.el = el
  }
}

export default withStyles(styles)(Jdenticon);
