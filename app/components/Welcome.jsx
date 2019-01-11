import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
// electron:
import * as electron from "electron";
// MUI Imports:
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
// local imports:
import routes from '../constants/routes';
// import handleCloseWindow from '../utils/helper-functions'
import logo from '../assets/icons/HC-logo.svg';
import customStyle from './Welcome.css';

// MUI Custom Styling :
const styles = theme => ({
  root: {
    marginTop: '3%',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: 140,
    width: 100,
  },
  header: {
    // Add main header styling here...
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  typography: {
    fontFamily: 'Raleway',
    fontWeight: theme.typography.fontWeightRegular,
  },
  buttonBackground: {
    marginTop:20,
    position: 'relative',
    margin: 10,
    width: 10,
    height: 50,
    border: '4px solid #21acba',
    '&:hover, &$focusVisible': {
      marginTop:16,
      height: 54,
      zIndex: 1,
      border: '4px solid #6600ff',
      // color: "#21acba",
      '& $buttonTitle': {
        color: "#10d6a9",
        fontWeight: '500',
      },
      '& $buttonBackdrop': {
        opacity: 0.8,
        backgroundColor: "#2e03a2b3",
        transition: theme.transitions.create('opacity'),
      },
      '& $buttonSelected': {
        opacity: 0,
      }
    },
  },
  buttonTitle: {
    color: "#fff",
    fontSize: '1.5rem',
    letterSpacing: 3,
    fontFamily: 'Raleway',
    fontWeight:'lighter',
    position: 'relative',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
  },
  buttonSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  buttonBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#130738',
    opacity: 0.6,
    transition: theme.transitions.create('opacity'),
  },
  buttonSelected: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  modal: {
    display: 'inline',
  },
  modalButton: {
    marginTop:40,
    color: '#21acba',
    background: 'rgba(0, 1, 127, 0.7)',
    opacity:0.8,
    transition: theme.transitions.create('opacity'),
    border: '2px solid #10d6a9',
    '&:hover, &$focusVisible': {
      border: '3px solid #6600ff',
      background: '#2526cbb3',
      color: '#eee',
      height: 30,
      marginTop:38,
    },
  },
  h3: {
    fontFamily: 'Raleway',
    marginTop: -10,
    fontSize: '1.25rem',
    letterSpacing: '-0.015em',
    color: '#fff',
  },
  focusVisible: {},
  questionBlock: {
    marginTop:45,
  },
  hcLogo: {
    height: '65%',
    marginTop: '-.1%'
  },
  closeIcon: {
    margin: theme.spacing.unit,
    position: 'fixed',
    top: 0,
    right: 0,
    fontSize: 10,
    color: '#70a297',
    border: '1px solid #70a297',
    background: 'transparent',
    '&:hover, &$focusVisible': {
      border: '2px solid red',
      color: 'red',
      background: 'transparent',
    },
  }
});

// typing :
type WelcomeProps = {
  fetch_state: () => void,
  call_holochain_instance_func: () => void,
  call_zome_instance_func: ()=> void
}

type WelcomeState = {
  HCmodalOpen: boolean,
  installationNotice: boolean,
}

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class Welcome extends React.Component<WelcomeProps, WelcomeState>{
  constructor(props:WelcomeProps){
    super(props);
    this.state = {
      HCmodalOpen: false,
      installationNotice:false,
    };
  };

  componentDidMount = () => {
    this.triggerWebClientCall();
    this.triggerZomeCall();
  }

  triggerWebClientCall = () => {
    console.log("Welcome.js WS Call",this.props);
    this.props.call_holochain_instance_func();
  }

  triggerZomeCall = () => {
    console.log("Welcome.js ZOME WS Call",this.props);
    this.props.call_zome_instance_func();
  }

  handleClickHCinfoOpen = () => {
    this.setState({ HCmodalOpen: true });
  };

  handleHCinfoClose = () => {
    this.setState({ HCmodalOpen: false });
  };

  handleInstallationNoticeOpen = () => {
    this.setState({ installationNotice: true });
  };

  handleInstallationNoticeClose = () => {
    this.setState({ installationNotice: false });
  };

  handleCloseWindow = () => {
    console.log("TRYING TO CLOSE APP...")
    const { ipcRenderer, app } = electron;
    console.log("ELECTRON OBJ param >>>APP", app);
    const quit = 'quit'
    ipcRenderer.send("window:close", quit);
  };

  render() {
    const { classes, fullScreen } = this.props;
    return (
      <Grid id="holoMotion" container className={classes.root} spacing={16}>
        <Fab aria-label="primary" className={classes.closeIcon} onClick={this.handleCloseWindow}>
          <Icon>X</Icon>
        </Fab>
        <div className={classnames('container', customStyle.container)} data-tid="container">
          <h2 className={classes.header}>Welcome to Holochain</h2>
          <img src={logo} className={classnames('app-logo', classes.hcLogo)} alt="logo" />

          <Grid item xs={12} className={classes.questionBlock}>
            <Typography className={classes.h3} component="h3">
              Is this your first time installing Holochain?
            </Typography>

            <div className={classes.control}>
              <div className={classes.modal}>
                <ButtonBase
                  focusRipple
                  aria-label="next"
                  className={classes.buttonBackground}
                  focusVisibleClassName={classes.focusVisible}
                  style={{
                    width: '30%',
                  }}
                  onClick={this.handleInstallationNoticeOpen}
                  >
                    <span
                    className={classes.buttonSrc}
                    style={{
                      backgroundImage: 'transparent',
                    }}
                    />
                    <span className={classes.buttonBackdrop} />
                    <span className={classes.imageButton}>
                        <Typography
                        component="span"
                        variant="subtitle1"
                        color="inherit"
                        className={classes.buttonTitle}
                        >
                        No
                      <span className={classes.buttonSelected} />
                    </Typography>
                   </span>
                </ButtonBase>
                <Dialog
                  fullScreen={fullScreen}
                  open={this.state.installationNotice}
                  onClose={this.handleInstallationNoticeClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">{"Ready to Install Holochain?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Hold on tight. You are about to enter into installation process for Holochain!
                      <br/>
                      <br/>
                      Please keep in mind that Holochain is built with a few other software products and will require their installation prior to that of Holochain.
                      <br/>
                      <br/>
                      Don't worry, though we have your back! If any of the required software required does not yet exist on your device, we will install it for you.
                    </DialogContentText>
                    <br/>
                    <DialogContentText>
                      All we need from you is to read over the following list of softare products, and affirm that you agree and are ready to begin their installation.
                        <br/>
                        <br/>
                        - Node (>8v : JavaScript Engine)
                        <br/>
                        - Rustup (>1.1 : Rust Toolchain Installer)
                        <br/>
                        - Cargo (>1.3 nightly build : Rust Package Manager)
                        <br/>
                        - ZeroMQ (>4v : Distributed Messaging Library )
                        <br/>
                        ... AND
                        <br/>
                        - Holochain Rust (latest version)
                        <br/>
                        <br/>
                        ...and don't forget to bring your device key bundle!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleInstallationNoticeClose} color="primary">
                      Close
                    </Button>
                    <Link to={routes.INSTALLATION}>
                      <Button onClick={this.handleInstallationNoticeClose} color="primary" autoFocus>
                        Let's Begin Installing!
                      </Button>
                    </Link>
                  </DialogActions>
                </Dialog>
              </div>

              <Link to={routes.WELCOMENEWUSER}>
                <ButtonBase
                focusRipple
                className={classes.buttonBackground}
                focusVisibleClassName={classes.focusVisible}
                style={{
                  width: '30%',
                }}
                >
                  <span
                    className={classes.buttonSrc}
                    style={{
                      backgroundImage: 'transparent',
                    }}
                  />
                  <span className={classes.buttonBackdrop} />
                  <span className={classes.imageButton}>
                    <Typography
                      component="span"
                      variant="subtitle1"
                      color="inherit"
                      className={classes.buttonTitle}
                    >
                      Yes
                      <span className={classes.buttonSelected} />
                  </Typography>
                 </span>
                </ButtonBase>
              </Link>
            </div>
          </Grid>

          <Grid item xs={12}>
             <div className={classes.modal}>
                <Button variant="outlined" className={classnames('learn-more',classes.modalButton)} onClick={this.handleClickHCinfoOpen}>
                 Learn more about Holochain
                </Button>
                <Dialog
                  open={this.state.HCmodalOpen}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={this.handleHCinfoClose}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle id="alert-dialog-slide-title">
                    {"What is Holochain?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      <strong>Well, we like to call it a more human internet!</strong>
                      <br/>
                      <br/>
                      Each of us wants to have control over how and with whom we interact. In order to evolve and thrive, our communities must support everyone's uniqueness. Yet today, our online relationships are dominated by centralized corporate web sites.
                      <br/>
                      <br/>
                      Holochain enables a distributed web with user autonomy built directly into its architecture and protocols. Data is about remembering our lived and shared experiences. Distributing the storage and processing of that data can change how we coordinate and interact. With digital integration under user control, Holochain liberates our online lives from corporate control over our choices and information.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleHCinfoClose} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
          </Grid>
        </div>
      </Grid>
    )
  }
}

Welcome.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Welcome);
