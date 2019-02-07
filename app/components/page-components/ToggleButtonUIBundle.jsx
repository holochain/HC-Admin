import React from 'react';
import { makeStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { handleRefreshApp, getHomePath } from "../../utils/helper-functions";
import styles from '../styles/component-styles/ToggleButtonMuiStyles';


class ToggleButtonUIBundle extends React.Component {
  constructor(props: any) {
    super(props);
  };

  handleChange = name => event => {
    const home = getHomePath();
    if (this.props.installed === 'Installed'){
      this.props.uninstallUIBundle({ id : this.props.values.ui_id}).then(res=>{
        handleRefreshApp();
      });
    }
    else if(this.props.installed === 'Uninstalled') {
      this.props.installUIBundle({ id : this.props.values.ui_id , root_dir:this.props.values.root_dir }).then(res => {
        handleRefreshApp();
      });
    }
  };

  render() {
    const { classes, running, installed, downloaded } = this.props;
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
        checked={ this.props.installed === "Installed" ? true : false }
        onChange={this.handleChange()}
        value={this.props.installed}
        />
      }
    />
  )}
}


export default withStyles(styles)(ToggleButtonUIBundle);
