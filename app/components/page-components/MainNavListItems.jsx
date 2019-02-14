import * as React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import PeopleIcon from '@material-ui/icons/People';
import LayersIcon from '@material-ui/icons/Layers';
import routes from '../../constants/routes';
import { handleRefreshApp } from "../../utils/helper-functions";
import UploadBtn from '../page-components/UploadBtn';
import styles from '../styles/component-styles/DashboardMuiStyles';

class MainListItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLink:"",
      uiUploaded: "",
      dnaUploaded: ""
    };
  }

  render () {
    const { classes } = this.props;
    const location = this.props.history ? this.props.history.location.pathname : "";
    console.log("location: ", location);

    return (
      <div>
        <br />
        <Link to={routes.UI}>
          <ListItem style={{display: 'inline', paddingTop: "10px"}} className={classnames(location === routes.UI ? classes.highlight : classes.reset)} button>
            <ListItemIcon style={{color:"#0e88efde"}}>
              <DashboardIcon />
            </ListItemIcon>
            <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline", marginLeft: "5px" }} gutterBottom>
              UI Overview
            </Typography>
          </ListItem>
        </Link>
        <Link to={routes.DNA}>
          <ListItem style={{display: 'inline'}} className={classnames(location === routes.DNA ? classes.highlight : classes.reset)} button>
            <ListItemIcon style={{color:"#0e88efde"}}>
              <LayersIcon />
            </ListItemIcon>
            <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline", marginLeft: "5px" }} gutterBottom>
              DNA Overview
            </Typography>
          </ListItem>
        </Link>
        <Link to={routes.INSTANCE}>
          <ListItem style={{display: 'inline'}} className={classnames(location === routes.INSTANCE ? classes.highlight : classes.reset)} button>
            <ListItemIcon style={{color:"#0e88efde"}}>
              <PeopleIcon />
            </ListItemIcon>
            <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline", marginLeft: "5px" }} gutterBottom>
              Instances Overview
            </Typography>
          </ListItem>
        </Link>

        { location === routes.UI ?
            <UploadBtn text="UI" accept=".html" install_ui={this.props.install_ui} fileUploaded={(file) => this.setState({uiUploaded: file})} />
        :
          location === routes.DNA ?
            <UploadBtn text="DNA" accept=".hcpkg, .json" install_dna_from_file={this.props.install_dna_from_file} fileUploaded={(file) => this.setState({dnaUploaded: file})} />
        :
          <div />
        }
{/* // TODO: Reenable once the Help page is complete :
        // <Link to={routes.HELP}>
        //   <ListItem style={{display: 'inline'}} button className={classnames(location === routes.HELP ? classes.highlight : classes.reset)}>
        //     <ListItemIcon style={{color:"#0e88efde"}}>
        //       <InfoIcon />
        //     </ListItemIcon>
        //     <Typography variant="subheading" style={{color:"#95b9ed", textDecoration: "none", display: "inline", marginLeft: "5px" }} gutterBottom>
        //       Help
        //     </Typography>
        //   </ListItem>
        // </Link> */}
        <Divider/>
      </div>
    )
  }
}

export default withStyles(styles)(MainListItems);

<UploadBtn fileUploaded={(file) => this.setState({uiUploaded: file})} />
