import * as React from 'react';
// MUI CUSTOM style imports
import { withStyles } from '@material-ui/core/styles';
// local imports
import styles from '../styles/page-styles/DefaultPageMuiStyles';

export interface Props {
  // These are props the component has received from its parent component
  classes: any,
  hash: string,
}
export interface State { /* The components optional internal state */ };

class Jdenticon extends React.Component<Props, State> {
  el = null;

  componentDidMount() {
    window.jdenticon.update(this.el)
  };

  componentDidUpdate() {
    window.jdenticon.update(this.el)
  };

  handleRef (el: any) { // tslint:disable-line
    this.el = el
  }

  render () {
    const { hash } = this.props; // style ===> (..if wish to concat styles with parent styles)
    return (
      <svg
        { ...this.props }
        style={{verticalAlign: 'middle', maxWidth:'100%'}} // style={...styles} style ===> (..if wish to concat styles with parent styles)
        ref={(el) => this.handleRef(el)} // tslint:disable-line
        data-jdenticon-value={hash}
        />
    );
  }
}

export default withStyles(styles)(Jdenticon);
