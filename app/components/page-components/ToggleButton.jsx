import React from 'react';
import { makeStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { handleRefreshApp, getHomePath } from "../../utils/helper-functions";
import styles from '../styles/component-styles/ToggleButtonMuiStyles';


class ToggleButton extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      row: `installed`,
    }
  };


  handleChange = name => event => {
    const dna_id = this.props.installed.col_dna_id
    const home = getHomePath();
    if (this.props.installed.status === 'installed'){
      this.props.uninstallDna({ id : dna_id}).then(res=>{
        // handleRefreshApp();
        this.props.handleRefreshTable;
      });
    }
    else {
      this.props.installDna({ id : dna_id , path: home+"/.hcadmin/holochain-download/"+dna_id}).then(res => {
        // handleRefreshApp();
        this.props.handleRefreshTable;
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
        checked={ this.props.installed.status === "installed" ? true : false }
        onChange={this.handleChange(`installed`)}
        value={this.props.installed.status}
        />
      }
    />
  )}
}

export default withStyles(styles)(ToggleButton);
