import * as React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import * as ProfileApiActions from '../actions/containerApi.js';


type AvatarPicProps = {
  current_agent: { agent: { Hash: Hash, Name: string } },
  profile_avatar: string,
  fetch_profile: () => Promise,
  fetch_state: () => void,
}

class AvatarPageContainer extends React.Component<AvatarPicProps, {}> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchProfile();
  }

  render () {
    const { profile } = this.props;
    console.log("profile_avatar: ", profile_avatar);

    if (!profile.profile_avatar || !profile ){
      return <div/>
    }
    else {
      const image : any = profile.profile_avatar
      return (
        <Avatar
          {...this.props}
          alt="Avatar Image"
          src={image}
        />
      )
    }
  }
}


  function mapStateToProps({profileApiActions}) {
    return {
      profile:profileApiActions,
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators(ProfileApiActions, dispatch);
  }

export default connect(mapStateToProps, mapDispatchToProps)(AvatarPageContainer);
