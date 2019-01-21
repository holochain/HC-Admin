import React from 'react';
import Loader from './Loader';

function Loading(props) {
  if (props.error) {
    return <div className="loader-container">You have an Error. Please refresh the page.</div>;
  } else if (props.pastDelay) {
    return <div className="loader-container"> <Loader /> </div>;
  } else {
    return null;
  }
}

export default Loading;
