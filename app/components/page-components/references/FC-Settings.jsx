import * as React from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom';
import { fetchPOST } from '../utils';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputLabel from "@material-ui/core/InputLabel";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar';;

import GridItem from "./gridComponents/item";
import GridContainer from "./gridComponents/container";
import CustomInput from "./inputComponents/Custom";
import CardFooter from "./cardComponents/CardFooter";
import SettingsForm from "./SettingsForm";
import "../style/SettingsForm.css";
// import avatar from "/assets/avatar2.png";

const styles = (theme: Theme) =>
  createStyles({
  root: {
    ...theme.mixins.gutters(),
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    background: "radial-gradient(#c4bebe, #eee)"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: 300,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  profileCard: {
    paddingLeft: "5px",
    paddingRight: "5px",
    marginTop: "15px",
  },
  bodyCard: {
    padding: "0.9375rem 20px",
    flex: "1 1 auto",
    WebkitBoxFlex: 1,
    position: "relative"
  }
})


class Settings extends React.Component<any, any> {
  constructor(props) {
    super(props);
  };
  render(){
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <br/>
          <SettingsForm/>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(Settings);
