import * as React from 'react';
import QueueAnim from 'rc-queue-anim';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";


const NoMatch = () => (
  <div className="err-container text-center" style={{margin:"20vh"}} >
    <div className="err">
      <h1>404</h1>
      <h2>Sorry, we couldn't locate that info.</h2>
    </div>

    <div className="err-button">
      <Link to="/main/dashboard">
        <Button style={{background:"#88b6b5", marginTop:"50px"}}>Go Back to Main Table Overview</Button>
      </Link>
    </div>
  </div>
);

const Error = () => (
  <div className="page-err">
    <QueueAnim type="bottom">
      <div key="1">
        <NoMatch />
      </div>
    </QueueAnim>
  </div>
);

export default Error;
