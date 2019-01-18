import React from 'react';
import { makeStyles } from '@material-ui/styles';
import purple from '@material-ui/core/colors/purple';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  colorBar: {},
  colorChecked: {},
  toggleBtnSwitchBase: {
    color: purple[300],
    '&$colorChecked': {
      color: purple[500],
      '& + $colorBar': {
        backgroundColor: purple[500],
      },
    },
    '&$installedTrue': {
      color: theme.palette.common.white,
      '& + $toggleBtnBar': {
        backgroundColor: '#52d869',
      },
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp,
    }),
  },
  installedTrue: {
    transform: 'translateX(15px)',
    '& + $toggleBtnBar': {
      opacity: 1,
      border: 'none',
    },
  },
  toggleBtnBar: {
    borderRadius: 13,
    width: 55,
    height: 26,
    marginTop: -13,
    marginLeft: -29,
    border: 'solid 1px',
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  toggleIcon: {
    width: 30,
    height: 24,
  },
  toggleIconChecked: {
    boxShadow: theme.shadows[1],
  },
});

class ToggleButton extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      row: "installed",
      installed: false,
      running: false,
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;

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
        checked={this.state.installed}
        onChange={this.handleChange('installed')}
        value="installed"
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
