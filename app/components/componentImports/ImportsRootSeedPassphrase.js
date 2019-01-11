// MUI Custom Styling :
export const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
  },
  passRoot: {
   marginTop: -25,
   width: '100%',
   maxWidth: 360,
   margin: 10,
   backgroundColor: theme.palette.background.paper,
   color: 'white',
   borderRadius: 8
 },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: 140,
    width: 100,
  },
  header1: {
    marginTop: 45,
    marginLeft: 88,
  },
  header2: {
    margin: 45,
    fontFamily: 'Raleway',
    fontWeight: 500,
    letterSpacing: 3
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  typography: {
    fontFamily: 'Raleway',
    fontWeight: theme.typography.fontWeightRegular,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  button: {
    margin: theme.spacing.unit,
    color: '#eee',
    backgroundColor: "#00A6AE"
  },
  fab: {
    // margin: theme.spacing.unit,
    margin: 54,
    // marginTop:-10,
    color: '#eee',
    background: '#3d65d6',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover, &$focusVisible': {
      border: '3px solid #6600ff',
      background: 'rgba(0, 1, 127, 0.7)'
    },
  },
  nextIcon: {
    marginRight: theme.spacing.unit,
  },
  nextBtn: {
    position:'relative',
    left:'51.25%',
    bottom:0,
    width: 350,
    color: '#eee',
    fontSize: 20,
    display:'flex',
    background: '#6600ff',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover, &$focusVisible': {
      fontSize: 18,
      border: '2px solid #10d6a9',
      background: 'rgba(0, 1, 127, 0.7)'
    },
  },
  modalButton: {
    marginTop:30,
    color: '#eee', // #a3b0d7
    border: '2px solid #6600ff',
    background: 'rgba(0, 1, 127, 0.7)',
    '&:hover, &$focusVisible': {
      marginTop:16,
      width: 300,
      height: 50,
      color: '#eee',
      background: 'transparent',
      border: '3px solid #10d6a9',
    },
  },
  modal: {
    marginTop: 33,
  },
   margin: {
     margin: theme.spacing.unit,
   },
   textField: {
     flexBasis: 200,
   },
  focusVisible: {},
  hcLogo: {
    height: '15%',
    position: 'fixed',
    left: 2,
    top: 2
  },
  closeIcon: {
    margin: theme.spacing.unit,
    position: 'fixed',
    top: 0,
    right: 0,
    fontSize: 10,
    color: '#70a297',
    border: '1px solid #70a297',
    background: 'transparent',
    '&:hover, &$focusVisible': {
      border: '2px solid red',
      color: 'red',
      background: 'transparent',
    },
  },
  sectionInstructions: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
  },
  sectionPassphrase: {
    margin: theme.spacing.unit * 2,
  },
  sectionSubmit: {
    margin: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
  iconImg: {
    width: 110,
    marginTop: 10,
    marginBottom: 10
  },
  instructions: {
    color: '#eee',
    marginTop: 10,
    maxHeight: 450,
    background: '#4f83a4',
    border: '3px solid #00017fb3'
  },
  whiteText: {
    color: "#eee",
    textAlign: 'center'
  },
  pinPad: {
    margin: 50,
    maxHeight: 150,
    display: 'flex',
    flexFlow: 'row wrap',
    padding: 1,
    justifyContent: 'space-around',
    aligncontent: 'flex-start',
    overflow: 'auto',
  }
});

// export default importFn = () => {
//   import * as React from 'react';
//   import PropTypes from 'prop-types';
//   import { Link } from 'react-router-dom';
//   import classnames from 'classnames';
//   // MUI Imports:
//   import Grid from '@material-ui/core/Grid';
//   import ButtonBase from '@material-ui/core/ButtonBase';
//   import Button from '@material-ui/core/Button';
//   import Typography from '@material-ui/core/Typography';
//   import Card from '@material-ui/core/Card';
//   import CardHeader from '@material-ui/core/CardHeader';
//   import CardMedia from '@material-ui/core/CardMedia';
//   import CardContent from '@material-ui/core/CardContent';
//   import CardActions from '@material-ui/core/CardActions';
//   import Collapse from '@material-ui/core/Collapse';
//   import Divider from '@material-ui/core/Divider';
//   import Paper from '@material-ui/core/Paper';
//   import Dialog from '@material-ui/core/Dialog';
//   import DialogActions from '@material-ui/core/DialogActions';
//   import DialogContent from '@material-ui/core/DialogContent';
//   import DialogContentText from '@material-ui/core/DialogContentText';
//   import DialogTitle from '@material-ui/core/DialogTitle';
//   import Slide from '@material-ui/core/Slide';
//   import IconButton from '@material-ui/core/IconButton';
//   import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//   import Fab from '@material-ui/core/Fab';
//   import Icon from '@material-ui/core/Icon';
//   import InputAdornment from '@material-ui/core/InputAdornment';
//   import TextField from '@material-ui/core/TextField';
//   import Visibility from '@material-ui/icons/Visibility';
//   import VisibilityOff from '@material-ui/icons/VisibilityOff';
//   import { withStyles } from '@material-ui/core/styles';
//   import Send from '@material-ui/icons/Send';
//   // local imports:
//   import routes from '../constants/routes';
//   // import handleCloseWindow from '../utils/helper-functions';
//   import logo from '../assets/icons/HC-logo.svg';
//   import customStyle from './Welcome.css';
// }
