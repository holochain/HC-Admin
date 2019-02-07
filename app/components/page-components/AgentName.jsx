import * as React from 'react';
// custom mui styles :
import { withStyles } from '@material-ui/core/styles';
import styles from '../styles/page-styles/DefaultPageMuiStyles';
import Typography from '@material-ui/core/Typography';

export interfac Props {
  // These are props the component has received from its parent component
  classes: any,
  agentString: string,
  fetchAgent: () => void,
}
export interface State { /* The components optional internal state */ };

class AgentName extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this.props.fetchAgent();
  }

  render () {
    const {agentString} = this.props;

    if (!agentString){
      return <div/>
    }
    else {
      const truncatedName : string = `${agentString.substring(0,15)}...`;
      return (
        <Typography
          style={{textAlign: "center", flexGrow: 1, paddingTop:"8px", color: "#00838d"}}
          variant="display2">
          {agentString.length >= 10 ? truncatedName : agentString}
        </Typography>
      )
    }
  }
}

export default withStyles(styles)(AgentName);
