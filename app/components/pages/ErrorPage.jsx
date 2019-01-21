import * as React from 'react';
import classNames from 'classnames';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Typography from '@material-ui/core/Typography';
import QueueAnim from 'rc-queue-anim';
import Error from "../page-components/Error";
import Dashboard from "../page-components/Dashboard"
import styles from '../styles/page-styles/DefaultPageMuiStyles'

class NoMatchCanvas extends React.Component<WithStyles<typeof styles>, any> {
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
          <div className={classes.tableContainer}>
            <Error/>
          </div>
        </main>
      </Dashboard>
    );
  }
}


export default withStyles(styles)(NoMatchCanvas);
