import React from "react";
import Modal from "react-bootstrap/Modal";
import "./Home.css";
import { withRouter } from "react-router-dom";

class  Home extends React.Component{

  render() { 
    return (
      <div className="container-fluid home">
        HOME
      </div>
    );
  }
}

export default withRouter(Home);
