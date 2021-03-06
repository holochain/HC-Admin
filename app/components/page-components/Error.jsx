import * as React from 'react';
import QueueAnim from 'rc-queue-anim';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";


const NoMatch = () => (
  <div className="error-container text-center" style={{margin:"20vh"}}>
    <div className="error" style={{textAlign:'center', margin:'0 auto'}}>
      <h1 style={{justifyContent:'center', color:"#95b9ed"}}>404</h1>
      <h2 style={{justifyContent:'center', color:"#95b9ed"}}>Sorry, we couldn't locate that info.</h2>
    </div>
  </div>
);

const Error = () => (
  <div className="page-error">
    <QueueAnim type="bottom">
      <div key="1">
        <NoMatch style={{textAlign:'center', margin:'0 auto'}} />
      </div>
    </QueueAnim>
  </div>
);

export default Error;
