import React from 'react';
import { makeStyles } from '@material-ui/styles';
// import purple from '@material-ui/core/colors/purple';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  colorBar: {},
  colorChecked: {},
  toggleBtnSwitchBase: {
    color: '#567dbb',
    '&$colorChecked': {
      color: '#567dbb',
      '& + $colorBar': {
        backgroundColor:"#567dbb",
      },
    },
    '&$installedTrue': {
      color: theme.palette.common.white,
      '& + $toggleBtnBar': {
        backgroundColor: '#00838c',
      },
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp,
    }),
  },
  installedTrue: {
    transform: 'translateX(40px)',
    '& + $toggleBtnBar': {
      opacity: 1,
      border: 'none',
    },
  },
  toggleBtnBar: {
    borderRadius: 13,
    width: 55,
    height: 16,
    marginBottom: 3,
    marginLeft: -15,
    border: 'solid 1px',
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  toggleIcon: {
    width: 18,
    height: 17,
  },
  toggleIconChecked: {
    boxShadow: theme.shadows[1],
  },
});

class ToggleButton extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      row: this.props.uninstallInstance ? `installed` : `running`,
      installed: false,
      running: false
    }
  };

  handleChange = name => event => {
    // call the api to change the status for either installed or running here..
    console.log("ABOUT TO CALL THE ACTION EVENT FOR >> EVENT NAME:", name);
    if (this.props.uninstallInstance && name === "installed") {
      const { instance } = this.props.installed;
      const instance_id = { id : instance};
      // console.log("INSTANCEID for uninstall_dna_by_id", instance);

      this.props.listInstances().then(res => {
        console.log("INFO INSTATANCES RES: ", res);
        for(resInstance of res) {
          if (resInstance.id === instance){
            this.props.uninstallInstance(instance_id);
          }
          else {
            const path_of_file = '~/.hcadmin/holochain-download/'
            this.props.installInstance({...instance_id, path:path_of_file});
          }
        }
     })

    }
    else if (this.props.stopInstance && name === "running"){
      const { instance } = this.props.running;
      const instance_id = { id : instance};

      this.props.runningInstances().then(res => {
        console.log("RUNNING INSTATANCES RES: ", res);
        if (resInstance.id === instance){
          this.props.stopInstance(instance_id)
        }
        else {
          this.props.startInstance(instance_id);
        }
     })
    }
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes, running, installed } = this.props;
    console.log("togglebutton props", this.props);
    console.log("ToggleButton state", this.state);

    console.log("CHECKED? : ", this.props.uninstallInstance ?
      this.props.installed.status === "installed" ? true : false
      : this.props.running.running);

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
        checked={ this.props.uninstallInstance ?
          this.props.installed.status === "installed" ? true : false
          : this.props.running.running
        }
        onChange={this.handleChange(`${this.props.uninstallInstance ? `installed` : `running`}`)}
        value={this.props.uninstallInstance ? this.state.installed : this.state.running}
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
