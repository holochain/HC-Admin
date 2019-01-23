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
import { handleRefreshApp } from "../../utils/helper-functions";
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
      message: "",
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
     const filePath = input.path;
     console.log("UPLOADED FILE INPUT : ", input);

     this.setState({file_path:filePath});
     const uploadFile = confirm(`Would you like to upload this file?\n File Name: ${ fileName }\n File Path: ${filePath} ?`);
     if (uploadFile === true) {
       const dna_file = {
          id: fileName,
          path: filePath
        };

        this.props.install_dna_from_file(dna_file).then(res => {
          this.setState({message: "Your app was successfully installed.." })
          console.log("YOUR APP SHOULD BE INSTALLED..");
          handleRefreshApp(); // this should send an IPC call to electron and request a Reload of the MainWindow (...and thus the entire app).
        });
     }
     else {
       //dismiss the dialog box... ?? and give an confimation message of dismissal ??
       console.log("APP WAS DISMISSED, AND NOT INSTALLED..");
     }
  };


  render () {
    // console.log("PROPS inside the MAIN-NAVV--LIST-ITEMS file...", this.props);

    return (
      <div>
        <br />
        <ListItem style={{paddingTop: "10px"}} button={button}>
          <Link to={routes.UI}>
            <ListItemIcon style={{color:"#0e88efde"}}>
              <DashboardIcon />
            </ListItemIcon>
            <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline-block", marginLeft: "15px" }} gutterBottom={gutterBottom}>
              UI Overview
            </Typography>
          </Link>
        </ListItem>
        <ListItem style={{paddingTop: "45px"}} button={button}>
          <Link to={routes.DNA}>
            <ListItemIcon style={{color:"#0e88efde"}}>
              <LayersIcon />
            </ListItemIcon>
            <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline-block", marginLeft: "15px" }} gutterBottom={gutterBottom}>
              DNA Overview
            </Typography>
          </Link>
        </ListItem>
        <ListItem style={{paddingTop: "45px"}} button={button}>
          <Link to={routes.INSTANCE}>
          <ListItemIcon style={{color:"#0e88efde"}}>
            <PeopleIcon />
          </ListItemIcon>
          <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline-block", marginLeft: "15px" }} gutterBottom={gutterBottom}>
            Instances Overview
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
          <input id="linkUpload" type="file" accept=".hcpkg" name="fileInput" onChange={this.handleUpload} ref="fileInput" style={{display:"none"}}/>
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
