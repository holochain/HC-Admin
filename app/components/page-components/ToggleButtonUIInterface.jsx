import React from 'react';
import { makeStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { handleRefreshApp, getHomePath } from "../../utils/helper-functions";
import styles from '../styles/component-styles/ToggleButtonMuiStyles';


class ToggleButtonUIInterface extends React.Component {
  constructor(props: any) {
    super(props);
  };

  handleChange = name => event => {
    const home = getHomePath();
      if (this.props.running){
      this.props.stop_ui_interface({ id : this.props.values.ui_interface_id}).then(res=>{
        // handleRefreshApp();
      });
    }
    else if(this.props.running === false) {
      this.props.start_ui_interface({ id : this.props.values.ui_interface_id}).then(res => {
        // handleRefreshApp();
      });
    }
  };

  render() {
    const { classes, running } = this.props;

    console.log(" !_!_!_! this.props inside ToggleButtonUIInterface !_!_!_! ", this.props )
    return (
      <FormControlLabel
      control={
        <Switch
        classes={{
          switchBase: classes.toggleBtnSwitchBase,
          bar: classes.toggleBtnBar,
          icon: classes.toggleIcon,
          iconChecked: classes.toggleIconChecked,
          checked: classes.installedTrue,
        }}
        disableRipple
        checked={ this.props.running }
        onChange={this.handleChange()}
        value={this.props.running}
        />
      }
    />
  )}
}


export default withStyles(styles)(ToggleButtonUIInterface);
