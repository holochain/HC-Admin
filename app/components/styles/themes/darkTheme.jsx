import { createMuiTheme } from '@material-ui/core/styles';
import { cyan, green } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: calculated from palette.primary.main,
      contrastText: 'rgba(255,255,255,.7)',
      main: cyan[700],
    },
    secondary: {
      // dark: calculated from palette.secondary.main,
      contrastText: 'rgba(255,255,255,.7)',
      main: green[600],
    },
    type: 'dark',
  },
});

export default theme;
