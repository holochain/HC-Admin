import * as React from 'react';
import { Link } from 'react-router-dom';
// MUI Imports:
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// Local Imports
import routes from '../../constants/routes';
import Avatar from './references/FC-AvatarImage';
import AgentName from './references/FC-AgentName';
import styles from '../styles/component-styles/DashboardMuiStyles';

const button : boolean = true;
const inset : boolean = true;
const gutterBottom : boolean = true;


class MainListItems extends React.Component {

  handleUpload = (event) => {
    console.log("event :", event);
    console.log("file :", file);

     const input = event.target.files[0]
     const fileName = input.name;

     let fileUrl = "";
     const reader = new FileReader();
     reader.onload = () => {
       fileUrl = reader.result;
       console.log("fileURL : ", fileUrl);
     };
  };


  render () {
    return (
      <div>
        <br />
        <ListItem style={{paddingTop: "10px"}} button={button}>
          <Link to={routes.UITABLE}>
            <ListItemIcon style={{color:"#0e88efde"}}>
              <DashboardIcon />
            </ListItemIcon>
            <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline-block", marginLeft: "15px" }} gutterBottom={gutterBottom}>
              UI Overview
            </Typography>
          </Link>
        </ListItem>
        <ListItem style={{paddingTop: "45px"}} button={button}>
          <Link to={routes.DNATABLE}>
            <ListItemIcon style={{color:"#0e88efde"}}>
              <LayersIcon />
            </ListItemIcon>
            <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline-block", marginLeft: "15px" }} gutterBottom={gutterBottom}>
              DNA Overview
            </Typography>
          </Link>
        </ListItem>
        <ListItem style={{paddingTop: "45px"}} button={button}>
          <Link to={routes.HELP}>
          <ListItemIcon style={{color:"#0e88efde"}}>
            <PeopleIcon />
          </ListItemIcon>
          <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline-block", marginLeft: "15px" }} gutterBottom={gutterBottom}>
            Help
          </Typography>
        </Link>
        </ListItem>
        <ListItem style={{paddingTop: "45px"}} button={button}>
          <Button variant="contained" color="default" style={{ marginRight: "5px", background:"#95b9ed" }} autoFocus onClick={() => this.handleUpload()}>
            <CloudUploadIcon style={{ background:"#95b9ed" }}  />
            <Typography style={{ marginRight: "5px"}}  variant="subheading">
              Install
            </Typography>
          </Button>
        </ListItem>
      <Divider />
    </div>
    )
  }
}

export default MainListItems;
