// MUI Custom Styling :
const styles = theme => ({
  colorBar: {},
  colorChecked: {},
  toggleBtnSwitchBase: {
    color: '#567dbb',
    '&$colorChecked': {
      color: '#567dbb',
      '& + $colorBar': {
        backgroundColor:"#567dbb",
      },
    },
    '&$installedTrue': {
      color: theme.palette.common.white,
      '& + $toggleBtnBar': {
        backgroundColor: '#00838c',
      },
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp,
    }),
  },
  installedTrue: {
    transform: 'translateX(40px)',
    '& + $toggleBtnBar': {
      opacity: 1,
      border: 'none',
    },
  },
  toggleBtnBar: {
    borderRadius: 13,
    width: 55,
    height: 16,
    marginBottom: 3,
    marginLeft: -15,
    border: 'solid 1px',
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  toggleIcon: {
    width: 18,
    height: 17,
  },
  toggleIconChecked: {
    boxShadow: theme.shadows[1],
  },
});

export default styles;
