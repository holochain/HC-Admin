import * as React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

type SettingsProps = {
  currentAgent: { Hash: Hash, Name: string },
  fetchAgent: () => void,
}

export default class AgentName extends React.Component<SettingsProps, {}> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchAgent();
  }

  render () {
    const {currentAgent} = this.props;
    // console.log("currentAgent >>> ", currentAgent);

    if (!currentAgent){
      return <div/>
    }
    else {
      const truncatedName : string = `${currentAgent.Name.substring(0,10)}...`;
      return (
        <Typography
          style={{textAlign: "center", flexGrow: 1, paddingTop:"8px", color: "#00838d"}}
          variant="subheading">
          {`Welcome ${currentAgent.Name.length >= 10 ? truncatedName : currentAgent.Name}`}
        </Typography>
      )
    }
  }
}
//
// const mapStateToProps = ({ currentAgent }) => ({ currentAgent });
// const mapDispatchToProps = dispatch => ({
//   fetchAgent: () => {
//     fetchPOST('/fn/identity/getAgent')
//       .then(agent => {
//         // console.log("agent after api call action: ", agent);
//         dispatch({ type: 'FETCH_CURRENT_AGENT', agent })
//       })
//   }
// });

// export default connect(mapStateToProps, mapDispatchToProps)(AgentName);
