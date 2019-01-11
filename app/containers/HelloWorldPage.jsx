import * as React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HelloWorld from '../components/HelloWorld';

// to trigger the action for the ICP call
import makeActions from '../actions/helloWorld'
import makeService from '../actions/services'
export const helloWorldActions = makeActions(makeService())

type HelloWorldProps = {
  message: string,
  sayHello: () => void
}


class HelloWorldPage extends React.Component<HelloWorldProps> {
  props: Props;

  render() {
    console.log("You're on the HelloWorldPage!!");
    return (
      <HelloWorld
        message={this.props.message}
        sayHello={this.props.sayHello}
      />
    )
  }
}

function mapStateToProps(state: any) {
  return {
    message: state.helloWorld.message
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    sayHello: () => dispatch(helloWorldActions.sayHello())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(HelloWorldPage);
