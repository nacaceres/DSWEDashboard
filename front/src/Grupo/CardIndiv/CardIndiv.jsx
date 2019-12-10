import React from "react";
import { Card } from "react-bootstrap";
import "./CardIndiv.css";
import Teamwork from "../Teamwork/Teamwork.jsx";

class CardIndiv extends React.Component {
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
    return (
      <div
        style={{ backgroundColor: color }}
        className="notaCont mx-auto"
      ></div>
    );
  };

  renderFeedBackIndiv = () => {
    if (
      this.props.semana !== null &&
      this.props.semana.feedback !== undefined &&
      this.props.semana.feedback.individuales !== undefined &&
      this.props.semana.feedback.individuales.length > 0
    ) {
      let pregIndiv = null;
      this.props.semana.feedback.individuales.forEach(usr => {
        if (
          usr.correo === this.props.estudiante.correo &&
          usr.preguntas !== undefined &&
          usr.preguntas.length > 0
        ) {
          pregIndiv = usr.preguntas;
        }
      });
      if (pregIndiv !== null) {
        return pregIndiv.map(pregunta => {
          return (
            <div
              className="row filaPreguntaGrupal"
              key={this.props.semana.nombre + pregunta.pregunta}
            >
              <div className="col-6">{pregunta.pregunta}</div>
              <div className="col-md-1 colEstadoActual">
                {this.renderNota(pregunta.nota)}
              </div>
              <div className="col-5">{pregunta.commentario}</div>
            </div>
          );
        });
      } else {
        return <div className="infoFail">No hubo Feedback Individual</div>;
      }
    } else {
      return <div className="infoFail">No hubo Feedback</div>;
    }
  };

  renderTeamwork = (nombre, semanal) => {
    return (
      <Teamwork
        key={
          "TEAMWORKGRUP" +
          nombre +
          this.props.semana.nombre +
          nombre +
          semanal.nombre
        }
        usuario={null}
        teamwork={semanal}
      />
    );
  };

  renderTeamworkIndivTarde = () => {
    if (
      this.props.semana !== null &&
      this.props.semana.teamwork !== undefined &&
      this.props.semana.teamwork.creadasTarde.length > 0
    ) {
      let sem = null;
      this.props.semana.teamwork.creadasTarde.forEach(semanal => {
        if (semanal.correo === this.props.estudiante.correo) {
          sem = semanal;
        }
      });
      if (sem !== null) {
        return (
          <div>
            <div className="row">
              <div className="titlesSemana">Creadas Tarde:</div>
            </div>
            {this.renderTeamwork("INDIVIDUAL", sem)}
          </div>
        );
      } else {
        return <div></div>;
      }
    } else {
      return <div></div>;
    }
  };

  renderTeamworkIndiv = () => {
    if (
      this.props.semana !== null &&
      this.props.semana.teamwork !== undefined &&
      this.props.semana.teamwork.semanal.length > 0
    ) {
      let sem = null;
      this.props.semana.teamwork.semanal.forEach(semanal => {
        if (semanal.correo === this.props.estudiante.correo) {
          sem = semanal;
        }
      });
      if (sem !== null) {
        return this.renderTeamwork("INDIVIDUAL", sem);
      } else {
        return <div className="row infoFail">No se encontraron tareas</div>;
      }
    } else {
      return <div className="row infoFail">No se encontraron tareas</div>;
    }
  };

  renderBody = () => {
    if (this.state.open) {
      return (
        <div className="bodyCardIndiv">
          <div>
            <div className="row">
              <div className="titlesSemana">Feedback:</div>
            </div>
            {this.renderFeedBackIndiv()}
            <div className="row">
              <div className="titlesSemana">Teamwork:</div>
            </div>
            {this.renderTeamworkIndiv()}
            {this.renderTeamworkIndivTarde()}
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  render() {
    return (
      <div className="row">
        <Card className="cardIndiv" border="dark" text="dark">
          <Card.Header
            className="cardHeaderIndiv "
            onClick={() => this.setState({ open: !this.state.open })}
          >
            <Card.Title>
              <div className="row filaTitleIndiv noselect">
                <div className="mx-auto">
                  {this.props.estudiante.nombres +
                    " " +
                    this.props.estudiante.apellidos}
                </div>
              </div>
            </Card.Title>
          </Card.Header>
          {this.renderBody()}
        </Card>
      </div>
    );
  }
}
export default CardIndiv;
