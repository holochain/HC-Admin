import { createMuiTheme } from '@material-ui/core/styles';
import { cyan, green } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      contrastText: '#fff',
      dark: cyan[700],
      main: cyan[500],
    },
    secondary: {
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#fff',
      main: green[400],
    },
    type: 'light',
  }
});

export default theme;
