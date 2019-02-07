import * as React from 'react';
import classnames from 'classnames';
import QueueAnim from 'rc-queue-anim';
// MUI Imports:
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TopNav from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
// local imports :
import logo from '../../assets/icons/HC_Logo.svg';
import styles from '../styles/component-styles/DashboardMuiStyles';
import MainNavListItems from './MainNavListItems';
import SearchBar from './SearchBar';


// !! TODO !! : ADD A `X` CANCEL/EXIT Button to top right corner...

class Dashboard extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      open: true,
    }
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };


  render() {
    const { classes, tableData } = this.props;
    const noWrap : boolean = true;
    // <img src={logo} className={classnames(classes.navAppLogo, "App-logo")} alt="logo" />
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <TopNav
            position="absolute"
            className={classnames(classes.topNav)}
          >
            <Typography className={classes.title} style={{color: "#e4e4e4", textAlign: "center", marginTop:"45px"}} noWrap={noWrap} variant="display1" component="h3" >
              HC Admin
            </Typography>

            <List className={classnames(classes.navMenuItemsWrapper, "nav-links")}>
              <MainNavListItems className={classnames(classes.navMenuItems, "nav-links")} {...this.props}/>
            </List>

            {/* <SearchBar tableData={tableData}/> */}

          </TopNav>
            {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
