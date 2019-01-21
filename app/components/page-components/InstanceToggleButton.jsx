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
    // call the api to change the status for either installed or running here..
    console.log("ABOUT TO CALL THE ACTION EVENT FOR >> EVENT NAME:", name);
    if (name === "installed") {
      const { instance, dna , agent_id } = this.props.installed;
      const instance_id = { id : instance};
      // const add_instance = { id : instance , dna_id: dna.dna_id, agent_id}
      // console.log("INSTANCEID for uninstall_dna_by_id", instance);
      if (this.props.installed.status === 'installed'){
        this.props.removeInstance(instance_id).then(res=>{
          // console.log("List INSTANCES:: *****",this.props)
        });
      }else{
        // this.addInstance()
        this.props.addInstance({ id : instance , dna_id: dna.dna_id, agent_id}).then(res=>{
          // console.log("Added List INSTANCES:: *****",this.props)
        });
      }
    }

    else if (this.props.stopInstance && name === "running"){
      const { instance } = this.props.running;
      const instance_id = { id : instance};
      console.log("STATUS::",this.props.running.running);
      if (this.props.running.running){
      this.props.stopInstance(instance_id)
      }else{
          this.props.startInstance(instance_id);
      }
    }
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes, running, installed, downloaded } = this.props;
    console.log("InstanceToggleButton props", this.props);
    console.log("InstanceToggleButton state", this.state);
    console.log("installed state", this.props.installed );
    console.log("running state", this.props.running );

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
