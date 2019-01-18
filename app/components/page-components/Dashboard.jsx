import * as React from 'react';
import classnames from 'classnames';
import QueueAnim from 'rc-queue-anim';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import TopNav from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import logo from '../../assets/icons/HC_Logo.svg';
import styles from '../styles/component-styles/DashboardMuiStyles';
import MainListItems from './MainListItems';

class Dashboard extends React.Component<WithStyles<typeof styles>, any> {
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
    const { classes } = this.props;
    const noWrap : boolean = true;
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <TopNav
            position="absolute"
            className={classnames(classes.topNav)}
          >
            <Typography className={classes.title} style={{color: "#e4e4e4", textAlign: "center", marginTop:"20px"}} noWrap={noWrap} variant="display1" component="h3" >
              <span><img src={logo} className={classnames(classes.navAppLogo, "App-logo")} alt="logo" /></span>
              HC Admin
            </Typography>

            <List className={classnames(classes.navMenuItemsWrapper, "nav-links")}>
              <MainListItems className={classnames(classes.navMenuItems, "nav-links")}/>
            </List>

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
          </TopNav>
            {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
