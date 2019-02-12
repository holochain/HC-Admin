import * as React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
// MUI Imports:
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Send from '@material-ui/icons/Send';
import routes from '../../constants/routes';
import { styles } from "../styles/component-styles//DefaultComponentMuiStyles";


function ModalTransition(props) {
  return <Slide direction="down" {...props} />;
}

class AddInstance extends React.Component<AddInstanceProps, AddInstanceState>{
  constructor(props:WelcomeProps){
    super(props);
    this.state = {
      expanded: false,
      customAgentId: "",
      customInstanceId: "",
      newInstanceInterfaceId: "",
      handleAddInstanceModal: false,
      message: "",
    };
    this.handleSubmitNewInstance = this.handleSubmitNewInstance.bind(this);
    this.sendFormData = this.sendFormData.bind(this);
  };

  handleAddInstanceModalOpen = () => {
    this.setState({ handleAddInstanceModal: true });
  };
  handleAddInstanceModalClose = () => {
    this.setState({ handleAddInstanceModal: false });
  };
  handleAddInstanceModalCloseAndSubmit = () => {
    event.preventDefault();
    this.sendFormData();;
  }

  handleSubmitNewInstance = name => event => {
    this.setState({ [name]: event.target.value });
  };

  sendFormData() {
    // calls parent props to create obj bundle and complete API call...
    this.props.handleAddInstance(this.state.customAgentId, this.state.customInstanceId, this.state.newInstanceInterfaceId);
    // setTimeout(() => {
    //   this.setState({ handleAddInstanceModal: false });
    // }, 1000);
  }

// NB: Use the following method if choose to keep setTimeout fn within the sendFormData().
  componentWillUnmount(){};

  render() {
    const { classes, fullScreen, availableAgentList, assignInstanceNewInterface } = this.props;
    const availableAgentListAsArray = Object.values(availableAgentList).map(option => option.id);
    return (
      <Grid item xs={12} elevation={1}>
        <div className={classes.modal} className={classes.root}  >
          <Fab style={{ marginTop:"-50px", width:"30px", background:"#4e5aa6", border:"#eee", color: "#eee"}} variant="extended" aria-label="next" className={classes.nextBtn} onClick={this.handleAddInstanceModalOpen}>
            <AddIcon/>
          </Fab>
         <Dialog
            fullScreen={fullScreen}
            open={this.state.handleAddInstanceModal}
            onClose={this.handleAddInstanceModalClose}
            aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Create a DNA Instance"}</DialogTitle>
            <DialogContent>
                <div className={classes.sectionPassphrase}>
                  <form>
                    <div style={{ marginTop:"5px" }}>
                      <TextField
                         id="custom_instance_id"
                         name="custom_instance_id"
                         className={classnames(classes.margin, classes.textField)}
                         helperText="Please create your custom Instance ID"
                         variant="outlined"
                         type={`text`}
                         label="Custom Instance ID"
                         aria-label="custom_instance_id"
                         value={this.state.custom_instance_id}
                         onChange={this.handleSubmitNewInstance("customInstanceId")}
                       />
                    </div>

                    <div style={{ marginTop:"5px", width :"100%" }}>
                    <TextField
                      id="custom_agent_id"
                      name="custom_agent_id"
                      className={classnames(classes.margin, classes.textField)}
                      select
                      label="Custom Agent ID"
                      aria-label="custom_agent_id"
                      value={this.state.customAgentId}
                      onChange={this.handleSubmitNewInstance("customAgentId")}
                      SelectProps={{
                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        helperText="Please select your Agent ID"
                        margin="normal"
                        variant="outlined"
                     >
                        {availableAgentList.map(option => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name} : {option.id}
                          </MenuItem>
                        ))}
                     </TextField>
                    </div>

                    <div style={{ marginTop:"5px", width :"100%", display:"flex", flexWrap:"wrap" }}>
                      <TextField
                        id="interface_id"
                        name="interface_id"
                        className={classnames(classes.margin, classes.textField)}
                        select
                        label="Interface ID"
                        aria-label="interface_id"
                        value={this.state.newInstanceInterfaceId}
                        onChange={this.handleSubmitNewInstance("newInstanceInterfaceId")}
                        SelectProps={{
                            MenuProps: {
                              className: classes.menu,
                            },
                          }}
                          helperText="Please select your Interface Type"
                          margin="normal"
                          variant="outlined"
                       >
                          {assignInstanceNewInterface.map(option => (
                            <MenuItem key={option.id + [option]} value={option.id}>
                              {option.id}
                            </MenuItem>
                          ))}
                       </TextField>
                    </div>
                  </form>
                </div>
            </DialogContent>
          <DialogActions>
          <Button onClick={this.handleAddInstanceModalClose} color="primary">
            Close
          </Button>
          <Button type="submit" onClick={this.handleAddInstanceModalCloseAndSubmit} color="primary" autoFocus>
            Add Instance
          </Button>
      </DialogActions>
      </Dialog>
    </div>
  </Grid>
)}}

export default withStyles(styles)(AddInstance);
