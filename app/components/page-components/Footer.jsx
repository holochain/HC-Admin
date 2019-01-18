import * as React from 'react';
import { SETTINGS_CONFIG } from '../constants/index';

class Footer extends React.Component {
  public render() {
    return (
      <section className="app-footer" style={{ color:"#405756", backgroundColor: "#282a2f", textAlign: "center", position: "relative", top: "35vh", left:"1vw", wordSpacing: "3px", fontSize:"10px" }} >
        <div className="container-fluid">
          <span>
            <span><em>Copyright © <a className="brand" target="_blank" style={{color:"#3f5e5c"}} href={SETTINGS_CONFIG.productLink}>{SETTINGS_CONFIG.brand}</a> {SETTINGS_CONFIG.year}</em></span>
          </span>
        </div>
      </section>
    );
  }
}

export default Footer;
