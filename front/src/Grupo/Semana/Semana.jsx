import React from "react";
import { Card } from "react-bootstrap";
import "./Semana.css";

class Semana extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  renderBody = () => {
    if (this.state.open) {
      return (
        <div className="bodySemana">
          <div className="feedback">
            <div className="row">
              <div className="titlesSemana">Feedback:</div>
            </div>
            <div className="row"></div>
          </div>
          <hr className="hrSemana" />
          <div className="teamwork">
            <div className="row">
              <div className="titlesSemana">Teamwork:</div>
            </div>
            <div className="row"></div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  render() {
    return (
      <Card className="cardSemana" border="dark" text="white">
        <Card.Header
          className="cardHeader "
          onClick={() => this.setState({ open: !this.state.open })}
        >
          <Card.Title>
            <div className="row filaTitleSemana noselect">
              <div className="col-6 text-center nombreSemana">
                {this.props.semana.nombre}
              </div>
              <div className="col-6 fechaSemana">
                {this.props.semana.inicio + " - " + this.props.semana.fin}
              </div>
            </div>
          </Card.Title>
        </Card.Header>
        {this.renderBody()}
      </Card>
    );
  }
}
export default Semana;
