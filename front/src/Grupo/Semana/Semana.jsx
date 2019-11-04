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
  renderNota = nota => {
    let color = "red";
    if (nota > 2) {
      color = "orange";
    }
    if (nota > 3) {
      color = "yellow";
    }
    if (nota > 4) {
      color = "green";
    }
    return <div style={{ backgroundColor: color }} className="notaCont"></div>;
  };

  renderGrupales = () => {
    return this.props.semana.feedback.preguntasGrupales.map(pregunta => {
      return (
        <div
          className="row filaPreguntaGrupal"
          key={this.props.semana.nombre + pregunta.pregunta}
        >
          <div className="col-8">{pregunta.pregunta}</div>
          <div className="col-2">{this.renderNota(pregunta.nota)}</div>
          <div
            className="col-1 addComment"
            onClick={() => {
              this.props.crearComentario("FEEDBACK", pregunta);
            }}
          >
            <i className="fas fa-comment-medical"></i>
          </div>
          <div className="col-1"></div>
        </div>
      );
    });
  };
  ss;

  renderFeedbacks = () => {
    if (this.props.semana.feedback.preguntasGrupales.length > 0) {
      return (
        <div>
          <div className="row text-center">
            <div className="titleGrupales"> Grupales</div>
          </div>
          {this.renderGrupales()}
        </div>
      );
    } else {
      return <div className="infoFail">No hubo Feedback</div>;
    }
  };

  renderTeamwork = () => {
    return <div></div>;
  };

  renderBody = () => {
    if (this.state.open) {
      return (
        <div className="bodySemana">
          <div className="feedback">
            <div className="row">
              <div className="titlesSemana">Feedback:</div>
            </div>
            {this.renderFeedbacks()}
          </div>
          <hr className="hrSemana" />
          <div className="teamwork">
            <div className="row">
              <div className="titlesSemana">Teamwork:</div>
            </div>
            <div className="row text-center">{this.renderTeamwork()}</div>
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
