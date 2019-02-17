import * as React from 'react';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';

import './Loader.css';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 28,
      background: "radial-gradient(white, #eee)",
      border: "10px double #29a19e",
      width: "100%",
      height: "100vh",
      boxSizing: "border-box",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
    },
    header: {
      color: "#29a19e",
      textShadow: ".4px .4px #111113"
    },
    title: {
      color: "white", // 29a19e 9c27b0
      textShadow: "1.5px 1.5px #111113",
    }
  });

const Loader = (props) => (
  <div className={props.classes.root}>
    <img className="loader" src="/HC-logo.svg" alt="holochain Logo" />
  </div>
)
export default withStyles(styles)(Loader);
