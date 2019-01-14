import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
// electron:
import * as electron from "electron";
// MUI Imports:
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
// local imports:
import routes from '../../constants/routes';
import logo from '../../assets/icons/HC-logo.svg';
import customStyle from '../component-styles/Default.css';
import styles from "../component-styles/CoreAppSelectionMuiStyles";
// import handleCloseWindow from '../utils/helper-functions';


type CoreAppSelectionProps = {
  fetch_state: () => void,
  update_core_apps: () => void,
  coreHapps: array
}

function ModalTransition(props) {
  return <Slide direction="down" {...props} />;
}

const coreHapps = [
  {
    type: "Administrator Interface",
    options: ["HC Admin"]
  },{
    type: "Key Manager",
    options: ["Deep Key"]
  },{
    type: "App Store",
    options: ["hApps Store"]
  },{
    type: "File Storage",
    options: ["HC Filer"]
  },{
    type: "System Notifier",
    options: ["HC Admin"]
  },{
    type: "Backup App",
    options: ["HC Backup"]
  },{
    type: "Personal Data Vault",
    options: ["HoloVault"]
  },
]

 class CoreAppSelection extends React.Component<CoreAppSelectionProps, {}>{
  constructor(props: CoreAppSelectionProps){
    super(props);
    this.state = {
      coreHapps, // Reset to : [{}]
      expanded: false,
      HCmodalOpen: false,
      installationNotice: false,
      affirm: false
    };
  };

  componentDidMount = () => {
    this.setState({
      coreHapps
    })
  }

  handleChange = key => event => {
    setState({[key]: event.target.value });
  };

  handleInstallationNoticeOpen = () => {
    this.setState({ installationNotice: true });
  };

  handleInstallationNoticeClose = () => {
    this.setState({ installationNotice: false });
  };

  handleInstallationNoticeCloseAffirm = () => {
    this.setState({
      installationNotice: false,
      affirm: true
    });
  };

  handleCloseWindow = () => {
    const { ipcRenderer } = electron;
    const quit = 'quit'
    ipcRenderer.send("window:close", quit);
  };

  render() {
    const { classes, fullScreen } = this.props;

    console.log("coreHapps : ",this.state.coreHapps.map(hApp => (hApp)));

    return (
      <Grid container className={classes.root} spacing={16}>
        <Fab aria-label="primary" className={classes.closeIcon} onClick={this.handleCloseWindow}>
          <Icon>X</Icon>
        </Fab>
        <div className={customStyle.container} data-tid="container">
          <h2 className={classes.header1}>Select your Core hApps</h2>
          <img src={logo} className={classnames("App-Logo", classes.hcLogo)} alt="logo" />
          <h3 className={classes.header2}>Let us welcome you into the community by introducing ourselves a bit more and offering you some additional resources.</h3>

          <Grid className="viewDetails" item xs={12} className={classes.checkboxSection}>
            <Grid className="viewDetails" container justify="center" spacing={16}>
              {this.state.coreHapps.map(hApp => (
                <TextField
                  key={hApp.type}
                  id={`standard-select-${hApp.type}`}
                  className="viewDetails"
                  select
                  label="Select"
                  className={classes.textField}
                  value={this.state.coreHapps.type}
                  onChange={this.handleChange}
                  SelectPWWrops={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  helperText={`Please select your ${hApp.type} hApp`}
                  margin="normal"
                >
                  {hApp.options.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              ))}
            </Grid>
          </Grid>

      {/* Install hApp Button and prompt */}
          <Grid item xs={12}>
            <div className={classes.modal}>
              <div className={classes.modal}>
                <Fab variant="extended" aria-label="next" className={classes.nextBtn} onClick={this.handleInstallationNoticeOpen}>
                   Begin hApp Installation
                </Fab>
                 <Dialog
                  fullScreen={fullScreen}
                  open={this.state.installationNotice}
                  onClose={this.handleInstallationNoticeClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">{"Ready to install your hApps?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Request to install hApps(grouping of services/UIs)...
                    </DialogContentText>
                    <br/>
                    <DialogContentText>
                      ...more text about installing hApps(grouping of services/UIs).
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleInstallationNoticeClose} color="primary">
                      Close
                    </Button>
                    <Link to={routes.HAPPINSTALLATION}>
                      <Button onClick={this.handleInstallationNoticeCloseAffirm} color="primary" autoFocus>
                        Install hApps
                      </Button>
                    </Link>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </Grid>
          {/**/}

        </div>
      </Grid>
    )
  }
}

CoreAppSelection.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CoreAppSelection);
