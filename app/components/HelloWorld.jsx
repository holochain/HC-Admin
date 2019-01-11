import * as React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import logo from '../assets/icons/HC-logo.svg'
import styles from './Welcome.css';

type HelloWorldProps = {
  message: string,
  sayHello: () => void
}

// stateless functional component >> therefore no TypedState to pass in...
export default function HelloWorld(props) {
  return (
    <div className={styles.container} data-tid="container">
      <img src={logo} className="App-Logo" alt="logo" />
      <h2>Hello Electron World</h2>

      <button onClick={() => props.sayHello()}> Say hello to Electron</button>
      <h1>MESSAGE: { props.message }</h1>

      <Link to={routes.WELCOME}>
        <button>Go to Welcome Page</button>
      </Link>
    </div>
  )
}

HelloWorld.defaultProps = {
  message: "Hello There ELectron... !!"
}
