// MUI Custom Styling :
const styles = theme => ({
  colorBar: {},
  colorChecked: {},
  toggleBtnSwitchBase: {
    color: '#8b3e96',
    '&$colorChecked': {
      '& + $colorBar': {
        backgroundColor:"#567dbb",
      },
    },
    '&$installedTrue': {
      // color: theme.palette.common.white,
      color: '#05edff', //alt color:  #567dbb, #17e4e1de ,#016b72 , #8b3e96
      '& + $toggleBtnBar': {
        backgroundColor: '#05a2b2',
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
      borderColor: '#152739',
    },
  },
  toggleBtnBar: {
    borderRadius: 13,
    width: 55,
    height: 16,
    marginBottom: 3,
    marginLeft: -15,
    border: 'solid 1px',
    borderColor: '#1a0b27',
    backgroundColor: '#4c1568',
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
