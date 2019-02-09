import * as React from 'react';
import classnames from 'classnames';
// MUI Imports:
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import routes from '../../constants/routes';
import { handleRefreshApp} from "../../utils/helper-functions";
import { styles } from "../styles/component-styles//DefaultComponentMuiStyles";


function ModalTransition(props) {
  return <Slide direction="down" {...props} />;
}

class AddUIInterface extends React.Component<AddUIInterfaceProps, AddUIInterfaceState>{
  constructor(props:WelcomeProps){
    super(props);
    this.state = {
      expanded: false,
      customInstanceId: "",
      newInstanceInterfaceId: "",
      handleAddUIInterfaceModal: false,
    };
    this.handleSubmitNewInstance = this.handleSubmitNewInstance.bind(this);
    this.sendFormData = this.sendFormData.bind(this);
  };

  handleAddUIInterfaceModalOpen = () => {
    this.setState({ handleAddUIInterfaceModal: true });
  };
  handleAddUIInterfaceModalClose = () => {
    this.setState({ handleAddUIInterfaceModal: false });
  };
  handleAddUIInterfaceModalCloseAndSubmit = () => {
    event.preventDefault();
    this.sendFormData();;
  }

  handleSubmitNewInstance = name => event => {
    this.setState({ [name]: event.target.value });
  };

  sendFormData() {
    this.props.handleAddUIInterface(this.state.customInstanceId, this.state.portNumber, this.state.newInstanceInterfaceId).then((_)=>{
      handleRefreshApp();
    });
  }

  componentWillUnmount(){};

  render() {
    const { classes, fullScreen, availableAgentList, assignInstanceNewInterface } = this.props;
    const availableAgentListAsArray = Object.values(availableAgentList).map(option => option.id);
  return (
      <Grid item xs={12} elevation={1}>
        <div className={classes.modal} className={classes.root}  >
          <Fab variant="extended" aria-label="next" className={classes.nextBtn} onClick={this.handleAddUIInterfaceModalOpen}>
            Create UI Interface
          </Fab>
         <Dialog
            fullScreen={fullScreen}
            open={this.state.handleAddUIInterfaceModal}
            onClose={this.handleAddUIInterfaceModalClose}
            aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Create a DNA Instance"}</DialogTitle>
            <DialogContent>
                <div className={classes.sectionPassphrase}>
                  <form>
                    <div style={{ marginTop:"5px" }}>
                      <TextField
                         id="custom_interface_id"
                         name="custom_interface_id"
                         className={classnames(classes.margin, classes.textField)}
                         helperText="Please create your custom Interface ID"
                         variant="outlined"
                         type={`text`}
                         label="Custom Interface ID"
                         aria-label="custom_interface_id"
                         value={this.state.custom_interface_id}
                         onChange={this.handleSubmitNewInstance("customInstanceId")}
                       />
                    </div>

                    <div style={{ marginTop:"5px" }}>
                      <TextField
                         id="port_number"
                         name="port_number"
                         className={classnames(classes.margin, classes.textField)}
                         helperText="Please create your custom Port Number"
                         variant="outlined"
                         type={`text`}
                         label="Custom Port Number"
                         aria-label="port_number"
                         value={this.state.port_number}
                         onChange={this.handleSubmitNewInstance("portNumber")}
                       />
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
                          helperText="Please select your DNA Interface "
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
          <Button onClick={this.handleAddUIInterfaceModalClose} color="primary">
            Close
          </Button>
          <Button type="submit" onClick={this.handleAddUIInterfaceModalCloseAndSubmit} color="primary" autoFocus>
            Add Interface
          </Button>
      </DialogActions>
      </Dialog>
    </div>
  </Grid>
)}}

export default withStyles(styles)(AddUIInterface);
