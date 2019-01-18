import * as  React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
    padding: "3px",
  },
  avatarLarge: {
    width: 60,
    height: 60,
    padding: "4px",
    border: "solid 4px #3f51b5"
  }
}

const AvatarImage = (props) => {
  const { classes, avatarType } = props;
  const classType = avatarType === "avatarLarge" ? classes.avatarLarge : classes.avatar;
  return (
    <div className={classes.row}>
      {/* <Avatar
        alt={props.alt}
        src={props.image}
        className={classes.avatarLarge}
      /> */}
      <Avatar
        alt="Image"
        src="/assets/avatar2.png"
        className={classes.avatarLarge}
      />
      <br/>
      <br/>
    </div>
  );
}

export default withStyles(styles)(AvatarImage);
