import React from "react"; // sguzmanm: Why not refactor with React hooks?
import { Card } from "react-bootstrap";
import "./Semana.css";
import Teamwork from "./Teamwork/Teamwork.jsx";

class Semana extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  renderNota = nota => {
    let color = "red"; // sguzmanm: These colors could be constants. It would be better this way
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
    if (
      this.props.semana.feedback.preguntasGrupales !== undefined &&
      this.props.semana.feedback.preguntasGrupales.length > 0
    ) { // sguzmanm: Refactor this if condition to a function and please avoid nested ifs by using returns
      return (
        <div>
          <div className="row text-center">
            <div className="titleGrupales"> Grupales</div>
          </div>
          {this.props.semana.feedback.preguntasGrupales.map(pregunta => {
            if (this.props.usuario.rol !== "ESTUDIANTE") {
              return (
                <div
                  className="row filaPreguntaGrupal"
                  key={this.props.semana.nombre + pregunta.pregunta}
                >
                  <div className="col-6">{pregunta.pregunta}</div>
                  <div className="col-2">{this.renderNota(pregunta.nota)}</div>
                  <div className="col-4">{pregunta.commentario}</div>
                </div>
              );
            } else {
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
                      var val = {
                        id: this.props.semana.nombre + "-" + pregunta.nombre,
                        encuestaEstudiantes: this.props.semana.feedback
                          .encuestaEstudiantes,
                        encuestaMonitor: this.props.semana.feedback
                          .encuestaMonitor
                      };
                      this.props.crearComentario("FEEDBACK", val);
                    }}
                  >
                    <i className="fas fa-comment-medical"></i>
                  </div>
                  <div className="col-1"></div>
                </div>
              );
            }
          })}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  renderIndividuales = () => {
    if (
      this.props.semana.feedback.individuales !== undefined &&
      this.props.semana.feedback.individuales.length > 0
    ) { // sguzmanm: Refactor this if condition to a function and please avoid nested ifs by using returns
      return (
        <div>
          {this.props.semana.feedback.individuales.map(individual => {
            let usuario = this.props.usuario;
            if (
              usuario.rol === "PROFESOR" ||
              usuario.rol === "MONITOR" ||
              (usuario.rol === "ESTUDIANTE" &&
                individual.correo === usuario.correo)
            ) {
              return (
                <div
                  key={
                    "INDIVIDUAL" + this.props.semana.nombre + individual.nombre
                  }
                >
                  <div className="row text-center">
                    <div className="titleIndividuales">{individual.nombre}</div>
                  </div>
                  {individual.preguntas.map(pregunta => {
                    if (usuario.rol !== "ESTUDIANTE") {
                      return (
                        <div
                          className="row filaPreguntaGrupal"
                          key={
                            "INDIVIDUAL" +
                            this.props.semana.nombre +
                            pregunta.pregunta
                          }
                        >
                          <div className="col-6">{pregunta.pregunta}</div>
                          <div className="col-2">
                            {this.renderNota(pregunta.nota)}
                          </div>
                          <div className="col-4">{pregunta.commentario}</div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="row filaPreguntaGrupal"
                          key={
                            "INDIVIDUAL" +
                            this.props.semana.nombre +
                            pregunta.pregunta
                          }
                        >
                          <div className="col-8">{pregunta.pregunta}</div>
                          <div className="col-2">
                            {this.renderNota(pregunta.nota)}
                          </div>
                          <div
                            className="col-1 addComment"
                            onClick={() => {
                              var val = {
                                id:
                                  this.props.semana.nombre +
                                  "-" +
                                  individual.correo +
                                  "-" +
                                  pregunta.nombre,
                                encuestaEstudiantes: this.props.semana.feedback
                                  .encuestaEstudiantes,
                                encuestaMonitor: this.props.semana.feedback
                                  .encuestaMonitor
                              };
                              this.props.crearComentario("FEEDBACK", val);
                            }}
                          >
                            <i className="fas fa-comment-medical"></i>
                          </div>
                          <div className="col-1"></div>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            } else {
              return (
                <div
                  key={
                    "INDIVIDUAL" + this.props.semana.nombre + individual.nombre
                  }
                ></div>
              );
            }
          })}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  renderEncuestas = () => {
    if (this.props.usuario.rol === "PROFESOR" && this.props.semana.feedback) {
      return (
        <div className="row text-center">
          <div
            className="col-6 mx-auto linkEncuesta"
            onClick={() => {
              window.location.href = this.props.semana.feedback.encuestaMonitor;
            }}
          >
            Encuesta Monitor
          </div>
          <div
            className="col-6 mx-auto linkEncuesta"
            onClick={() => {
              window.location.href = this.props.semana.feedback.encuestaEstudiantes;
            }}
          >
            Encuesta Monitor
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  renderFeedbacks = () => {
    if (this.props.semana.feedback !== undefined) {
      return (
        <div>
          {this.renderEncuestas()}
          {this.renderGrupales()}
          {this.renderIndividuales()}
        </div>
      );
    } else { // sguzmanm: Avoid these nested conditions. The else is unnecessary since you are already returning data on the previous condition
      return <div className="infoFail">No hubo Feedback</div>;
    }
  };

  renderTeamworkIndividual = (grupo, nombre) => {
    let usuario = this.props.usuario;
    return grupo.map(semanal => {
      if (
        usuario.rol === "PROFESOR" ||
        usuario.rol === "MONITOR" ||
        (usuario.rol === "ESTUDIANTE" && semanal.correo === usuario.correo)
      ) { // sguzmanm: Refactor this if condition to a function and please avoid nested ifs by using returns
        return (
          <Teamwork
            key={
              "TEAMWORKINDIVIDUAL" +
              nombre +
              this.props.semana.nombre +
              this.nombre +
              semanal.nombre
            }
            usuario={this.props.usuario}
            teamwork={semanal}
            crearComentario={this.props.crearComentario}
          />
        );
      } else {
        return (
          <div
            key={
              "TEAMWORKINDIVIDUAL" +
              nombre +
              this.props.semana.nombre +
              this.nombre +
              semanal.nombre
            }
          ></div>
        );
      }
    });
  };

  renderTeamworkTarde = () => {
    if (
      this.props.semana.teamwork.creadasTarde &&
      this.props.semana.teamwork.creadasTarde.length > 0
    ) {
      return (
        <div>
          <div className="row text-center">
            <div className="titleIndividuales">Creadas Tarde</div>
          </div>
          {this.renderTeamworkIndividual(
            this.props.semana.teamwork.creadasTarde,
            "CREADASTARDE"
          )}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  renderTeamwork = () => {
    if (this.props.semana.teamwork !== undefined) {
      return (
        <div>
          {this.renderTeamworkIndividual(
            this.props.semana.teamwork.semanal,
            "INDIVIDUAL"
          )}
          {this.renderTeamworkTarde()}
        </div>
      );
    } else {
      return <div className="infoFail">No hubo Teamwork</div>;
    }
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
              <div className="titlesSemana titleTeamwork">Teamwork:</div>
            </div>
            {this.renderTeamwork()}
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  render() { // sguzmanm: This is too much code for one component, find a way to refactor or modularize this
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
