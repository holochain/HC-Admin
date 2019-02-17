import * as React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { handleRefreshApp } from "../../utils/helper-functions";
import styles from '../styles/component-styles/DashboardMuiStyles';
import { TextField } from '@material-ui/core';

class UploadBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      fileName: "",
      filePath: "",
      message: "",
      errorMessage: "",
    };
    this.handlePicker = this.handlePicker.bind(this);
    this.handleIdInput = this.handleIdInput.bind(this);
    this.handleClickInstall = this.handleClickInstall.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleClick() {
    this.refs.fileInput.click();
  }

  handlePicker = (event) => {
     const input = event.target.files[0] // can be a file or a folder (in the case of UI)
     const fileName = input.name;
     const filePath = input.path;
     console.log('input', input)
     this.setState({
       id: fileName,
       fileName,
       filePath
      });
  }

  reset = () => {
    this.refs.fileInput.value = ""
    this.setState({
      id: "",
      filePath: "",
      fileName: ""
    })
  }

  handleIdInput = (e) => {
    this.setState({
      id: e.target.value
    })
  }

  handleClickInstall = () => {
    const isDna = this.props.text === "DNA"
    const isUI = this.props.text === "UI"
    if(isDna){
      this.props.install_dna_from_file({
        id: this.state.id,
        path: this.state.filePath
      }).then(this.reset)
    }
    else if (isUI) {
      this.props.install_ui({
        id: this.state.id,
        root_dir: this.state.filePath
      }).then(this.reset)
    }
  }


  render () {
    const extraProps = this.props.directory ? { webkitdirectory: "true", directory: "true", multiple: "multiple" } : {}
    return (
      <div>
        <ListItem style={{ display: 'inline' }} button onClick={() => this.handleClick()}>
          <input id="linkUpload" type="file" {...extraProps} accept={this.props.accept} name="fileInput" onChange={this.handlePicker} ref="fileInput" style={{display:"none"}}/>
          <Button disableRipple variant="contained" color="default" style={{ marginRight: "5px", background:"#072dc3de", marginBottom:"3px" }} autoFocus>
            <CloudDownloadIcon style={{ background:"#072dc3de", color:"#95b9ed" }}  />
            <Typography style={{ margin: "0 auto !important"}}  variant="subheading">
              <span style={{ marginLeft: "3px", color:"#95b9ed" }}>Install {this.props.text}</span>
            </Typography>
          </Button>

        </ListItem>
        {this.state.filePath ?
          <div>
            <ListItem>
              <Typography variant="subheading">
                <span style={{ marginLeft: "3px", color:"#95b9ed" }}>"{this.state.filePath}" selected</span>
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="subheading">
                <span style={{ marginLeft: "3px", color:"#95b9ed" }}>{`Provide a name/id for this ${this.props.text}`}</span>
              </Typography>
            </ListItem>
            <ListItem>
              <TextField name="upload_button_id"
                         autoFocus
                         variant="outlined"
                         type={`text`}
                         value={this.state.id}
                         onChange={this.handleIdInput}
                         InputProps={{
                          className: this.props.classes.uploadBtnIdInput
                        }}></TextField>
            </ListItem>
            <ListItem>
              <Button disableRipple variant="contained" color="default" style={{ marginRight: "5px", background:"#072dc3de", marginBottom:"3px" }} onClick={this.reset}>
                <Typography style={{ margin: "0 auto !important"}}  variant="subheading">
                  <span style={{ marginLeft: "3px", color:"#95b9ed" }}>Cancel</span>
                </Typography>
              </Button>
              <Button disableRipple variant="contained" color="default" style={{ marginRight: "5px", background:"#072dc3de", marginBottom:"3px" }} onClick={this.handleClickInstall}>
                <Typography style={{ margin: "0 auto !important"}}  variant="subheading">
                  <span style={{ marginLeft: "3px", color:"#95b9ed" }}>Install</span>
                </Typography>
              </Button>
            </ListItem>
          </div> : null }
      </div>
    )
  }
}

export default withStyles(styles)(UploadBtn);
