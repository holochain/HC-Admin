import React from 'react';
// MUI Imports
import { makeStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
// Local Imports
import { handleRefreshApp } from "../../utils/helper-functions";
import styles from '../styles/component-styles/ToggleButtonMuiStyles';

class InstanceToggleButton extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      row: this.props.removeInstance ? `installed` : `running`,
      installed: false,
      running: false
    }
  };

  handleChange = name => event => {
    if (name === "installed") {
      const { instance, dna , agent_id } = this.props.installed;

      if (this.props.installed.status === 'installed'){
        this.props.removeInstance({ id : instance}).then(res=>{
          // console.log("List INSTANCES:: *****",this.props)
          handleRefreshApp();
        });
      }
      else {
        console.log("Props Add INSTANCES:: *****",this.props);

          this.props.addInstance({ id : instance , dna_id: dna.dna_id, agent_id}).then(res => {
            handleRefreshApp();
          })

      }
    }

    else if (this.props.stopInstance && name === "running"){
      const { instance } = this.props.running;
      const instance_id = { id : instance};
      console.log("STATUS::",this.props.running.running);
      if (this.props.running.running){
        this.props.stopInstance(instance_id).then(res => {
            handleRefreshApp();
        })
      }
      else{
        console.log(this.props);
        // this.props.getInstances(instance_id).then(res => {
        //   this.props.startInstance(instance_id)
        // })
        this.props.addInterface({ interface_id:"websocket interface", instance_id:instance })
        this.props.startInstance(instance_id).then(res => {
            handleRefreshApp();
          })
      }
    }
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes, running, installed, downloaded } = this.props;
    // console.log("InstanceToggleButton props", this.props);
    // console.log("InstanceToggleButton state", this.state);
    // console.log("installed state", this.props.installed );
    // console.log("running state", this.props.running );

    let checkedStatus = this.props.removeInstance ? this.props.installed.status === "installed" ? true : false : this.props.running.running;

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
        checked={ checkedStatus }
        onChange={this.handleChange(`${this.props.removeInstance ? `installed` : `running`}`)}
        value={this.props.removeInstance ? this.state.installed : this.state.running}
        />
      }
    />
  )}
}


export default withStyles(styles)(InstanceToggleButton);
