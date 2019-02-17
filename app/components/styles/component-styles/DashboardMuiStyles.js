// MUI Custom Styling :
import { StyleRulesCallback } from '@material-ui/core/';
import { Theme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
// MUI Custom Styling :
const drawerWidth = 180;

const styles: StyleRulesCallback  = (theme: Theme) => ({
    root: {
      display: 'flex',
      background: "#00017fb3"
    },
    title: {
     flexGrow: 1,
     display: 'none',
     [theme.breakpoints.up('sm')]: {
        display: 'block',
     },
     color: "#eee", // #303341
     fontWeight: "lighter",
     fontFamily: 'Raleway'
    },
    grow: {
      flexGrow: 1,
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    mainHeader: {
      textAlign: "center",
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 3px',
      color: "#0e88efde",
      ...theme.mixins.toolbar,
    },
    topNav: {
      zIndex: theme.zIndex.drawer + 1,
      background: 'linear-gradient(45deg, #1a0231f2, #00017f)',
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    topNavShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginLeft: 0,
      marginRight: 0
    },
    menuButtonHidden: {
      display: 'none',
    },
    highlight:{
      filter: 'brightness(3.5)',
      color: "#072dc3de", // #072dc3de #e4e4e4 #48497cb3
      borderBottom: '1px solid #072dc3de',
    },
    reset: {
      filter: 'brightness(1)',
      padding: 'default',
      border: 'none',
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      background: 'linear-gradient(45deg, #00017fb3, #1a0231eb)',
      color: "white",
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing.unit * 7,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing.unit * 9,
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
      height: '100vh',
      overflow: 'auto',
    },
    mainHeader: {
      textAlign: "center",
    },
    tableContainer: {
      height: 800,
      overflowY: 'scroll',
    },
     navAppLogo : {
      margin: '0 auto',
      width: 105,
      height: 70,
      flex:"0 1 auto",
      marginTop: 15,
      padding: 0
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit,
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
  },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create('width'),
      width: '160%',
      [theme.breakpoints.up('sm')]: {
        maxWidth: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
    navMenuItemsWrapper : {
      textAlign: 'center',
      justifyContent: 'center',
    },
    navMenuItems : {
      marginBottom: 2,
      display: 'inline',
    },
    formControl : {
      fontSize: '2rem',
      padding: '25px 15px',
    },
    formGroupFieldset: {
      borderColor: '#95b9ed',
    },
    searchBtnInput : {
      width: '100%',
      background: 'transparent',
      border: 'none',
      color: '#95b9ed'
    },
    uploadBtnIdInput: {
      color: "rgb(149, 185, 237)",
      borderColor: "rgb(149, 185, 237) !important"
    }
  });

  export default styles;
