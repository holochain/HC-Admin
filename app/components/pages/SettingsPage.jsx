import * as React from 'react';
import classNames from 'classnames';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Typography from '@material-ui/core/Typography';
import QueueAnim from 'rc-queue-anim';

import Dashboard from "../Dashboard"
import Settings from "../Settings";
import styles from '../styles/page-styles/DefaultPageMuiStyles';


class SettingsCanvasDetail extends React.Component<WithStyles<typeof styles>, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: true,
    }
  };
  render() {
    const { classes } = this.props;
    const gutterBottom : boolean = true;

    return (
      <Dashboard>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />

          <Typography className={classes.mainHeader} style={{color:"#e4e4e4"}} variant="display1" gutterBottom={gutterBottom} component="h2" >
            Administrator Settings
          </Typography>
          <br/>
          <div className={classes.tableContainer}>
            <Settings/>
          </div>
        </main>
      </Dashboard>
    );
  }
}

export default withStyles(styles)(SettingsCanvasDetail);
