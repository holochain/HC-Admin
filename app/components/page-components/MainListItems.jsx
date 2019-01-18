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
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      file_path: "",
      errorMessage: "",
    };
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleClick() {
    this.refs.fileInput.click();
  }

  handleUpload = (event) => {
    console.log("YOU CLICKED >>> event.target :", event.target);

     const input = event.target.files[0]
     const fileName = input.name;
     const filePath = input.path
     console.log("UPLOADED FILE INPUT : ", input);
     this.setState({file_path:filePath});
     const uploadFile = confirm(`Would you like to upload this file? File Name: ${ fileName } File Path: ${filePath} ?`);
     if (uploadFile === true) {
       // make Container API call to uplaod the file with the given path..
       // Inform User that file will be uploaded...
     }
     else {
       //dismiss the dialog box... ?? and give an confimation message of dismissal ??
     }
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
        <ListItem style={{paddingTop: "45px"}} button={button} onClick={() => this.handleClick()}>
          <input id="linkUpload" type="file" accept=".zip" name="fileInput" onChange={this.handleUpload} ref="fileInput" style={{display:"none"}}/>
            <Button variant="contained" color="default" style={{ marginRight: "5px", background:"#95b9ed" }} autoFocus>
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