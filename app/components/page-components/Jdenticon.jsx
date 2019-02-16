import * as React from 'react';
// MUI CUSTOM style imports
import { withStyles } from '@material-ui/core/styles';
// local imports
import styles from '../styles/page-styles/DefaultPageMuiStyles'
import jdenticon from 'jdenticon'

class Jdenticon extends React.Component{

  render () {
    const size = 50;
    const __html = jdenticon.toSvg(this.props.hash, size);
    return <div dangerouslySetInnerHTML={{__html}} />
  }
}

export default withStyles(styles)(Jdenticon);
