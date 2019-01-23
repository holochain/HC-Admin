import React from 'react';
// MUI Imports
import { makeStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';
// Local Imports
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
        handleRefreshApp();
      });
    }
    else {
      this.props.installDna({ id : dna_id , path: home+"/.hcadmin/holochain-download/"+dna_id}).then(res => {
        handleRefreshApp();
      });
    }
  };

  render() {
    const { classes, running, installed, downloaded } = this.props;
    // console.log("togglebutton props", this.props);
    // console.log("ToggleButton state", this.state);
    //
    // console.log("CHECKED? : ", this.props.installed.status === "installed" ? true : false );

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
// label={this.state.row === "installed" ?
//     this.state.installed === true ? `Installed`: `Uninstalled`
//   : this.state.running === true ? `Running`: `Stopped`
// }


// menu >> toggle button
// <h5>
// {
//   row.value === true ? `Installed`
//   : row.value === false ? `Uninstalled`
//   : 'Unknown'
// }
// </h5>

// <h5>
// {
//    row.value === true ? `Running`
//   : row.value === false ? `Stopped`
//   : 'Unknown'
// }
// }
// </h5>
