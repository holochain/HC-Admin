import * as React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import AgentName from './AgentName';

const styles = (theme: Theme) =>
  createStyles({
    layout: {
      width: 'auto',
      display: 'block',
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
      border: "solid 5px #29a19e",

    },
    icon: {
      margin: theme.spacing.unit,
      backgroundColor: "#29a19e"
    },
    form: {
      width: '100%',
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
      position: "relative",
      left: "70px",
      background: "#29a19e",
    },
    password : {
      marginTop: "2px",
    }
  });


class NoCertsErrorMessage extends React.Component<WithStyles<typeof styles>, any> {
  render() {
    const required : boolean = true;
    const autoFocus : boolean = true;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={this.props.classes.layout}>
          <Paper className={this.props.classes.paper}>
            <h3 style={{ textAlign: "center", marginTop: "8vh", color: "#00838d" }}>Oops... looks like tthere was an error processing that request.</h3>
            <form className={this.props.classes.form}>
              <h5 style={{ textAlign: "center", marginTop: "8vh", color: "#00838d" }}>Please head back over to the Main Table.</h5>
              <Link to="/fuelgenerator/newcertificate">
                <Button
                  type="submit"
                  variant="raised"
                  color="primary"
                  className={this.props.classes.submit}
                >
                  Main Table
                </Button>
              </Link>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NoCertsErrorMessage);
