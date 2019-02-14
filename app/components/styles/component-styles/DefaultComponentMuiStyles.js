// MUI Custom Styling :
const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    fontWeight: 'bolder'
  },
  modalContainer:{
    border: '3px solid #072dc3', // #95b9ed
    margin: '0 auto',
    justifyContent: 'center'
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: 140,
    width: 100,
    margin: '0 auto',
    justifyContent: 'center'
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
  sectionSubmit: {
    margin: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
  iconImg: {
    width: 110,
    marginTop: 10,
    marginBottom: 10
  },
  whiteText: {
    color: "#eee",
    textAlign: 'center'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

export default styles;
