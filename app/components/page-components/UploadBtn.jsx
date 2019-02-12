import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { handleRefreshApp } from "../../utils/helper-functions";
import styles from '../styles/component-styles/DashboardMuiStyles';

class UploadBtn extends React.Component {
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
    return (
      <ListItem style={{ display: 'inline' }} button onClick={() => this.handleClick()}>
        <input id="linkUpload" type="file" accept=".hcpkg, .json" name="fileInput" onChange={this.handleUpload} ref="fileInput" style={{display:"none"}}/>

        <Button disableRipple variant="contained" color="default" style={{ marginRight: "5px", background:"#072dc3de", marginBottom:"3px" }} autoFocus>
          <CloudDownloadIcon style={{ background:"#072dc3de", color:"#95b9ed" }}  />
          <Typography style={{ margin: "0 auto !important"}}  variant="subheading">
            <span style={{ marginLeft: "3px", color:"#95b9ed" }}>Install {this.props.text}</span>
          </Typography>
        </Button>

      </ListItem>
    )
  }
}

export default withStyles(styles)(UploadBtn);
