import React, { useState } from "react";
import { Card } from "react-bootstrap";
import "./Semana.css";
import Teamwork from "./Teamwork/Teamwork.jsx";

const Semana = ({
  semana,
  usuario,
  crearComentario
}) => {
  const [open, setOpen] = useState(false);

  const renderNota = nota => {
    let color = "red";
    if (nota > 2) color = "orange";
    if (nota > 3) color = "yellow";
    if (nota > 4) color = "green";
    return <div style={{ backgroundColor: color }} className="notaCont"></div>;
  }

  const renderGrupales = () => {
    if (
      semana.feedback.preguntasGrupales !== undefined &&
      semana.feedback.preguntasGrupales.length > 0
    ) {
      return (
        <div>
          <div className="row text-center">
            <div className="titleGrupales"> Grupales</div>
          </div>
          {semana.feedback.preguntasGrupales.map(pregunta => {
            if (usuario.rol !== "ESTUDIANTE") {
              return (
                <div
                  className="row filaPreguntaGrupal"
                  key={semana.nombre + pregunta.pregunta}
                >
                  <div className="col-6">{pregunta.pregunta}</div>
                  <div className="col-2">{renderNota(pregunta.nota)}</div>
                  <div className="col-4">{pregunta.commentario}</div>
                </div>
              );
            } else {
              return (
                <div
                  className="row filaPreguntaGrupal"
                  key={semana.nombre + pregunta.pregunta}
                >
                  <div className="col-8">{pregunta.pregunta}</div>
                  <div className="col-2">{renderNota(pregunta.nota)}</div>
                  <div
                    className="col-1 addComment"
                    onClick={() => {
                      var val = {
                        id: semana.nombre + "-" + pregunta.nombre,
                        encuestaEstudiantes: semana.feedback
                          .encuestaEstudiantes,
                        encuestaMonitor: semana.feedback
                          .encuestaMonitor
                      };
                      crearComentario("FEEDBACK", val);
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

  const renderIndividuales = () => {
    if (
      semana.feedback.individuales !== undefined &&
      semana.feedback.individuales.length > 0
    ) {
      return (
        <div>
          {semana.feedback.individuales.map(individual => {
            if (
              usuario.rol === "PROFESOR" ||
              usuario.rol === "MONITOR" ||
              (usuario.rol === "ESTUDIANTE" &&
                individual.correo === usuario.correo)
            ) {
              return (
                <div
                  key={
                    "INDIVIDUAL" + semana.nombre + individual.nombre
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
                            semana.nombre +
                            pregunta.pregunta
                          }
                        >
                          <div className="col-6">{pregunta.pregunta}</div>
                          <div className="col-2">
                            {renderNota(pregunta.nota)}
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
                            semana.nombre +
                            pregunta.pregunta
                          }
                        >
                          <div className="col-8">{pregunta.pregunta}</div>
                          <div className="col-2">
                            {renderNota(pregunta.nota)}
                          </div>
                          <div
                            className="col-1 addComment"
                            onClick={() => {
                              var val = {
                                id:
                                  semana.nombre +
                                  "-" +
                                  individual.correo +
                                  "-" +
                                  pregunta.nombre,
                                encuestaEstudiantes: semana.feedback
                                  .encuestaEstudiantes,
                                encuestaMonitor: semana.feedback
                                  .encuestaMonitor
                              };
                              crearComentario("FEEDBACK", val);
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
                    "INDIVIDUAL" + semana.nombre + individual.nombre
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

  const renderEncuestas = () => {
    if (usuario.rol === "PROFESOR" && semana.feedback) {
      return (
        <div className="row text-center">
          <div
            className="col-6 mx-auto linkEncuesta"
            onClick={() => {
              window.location.href = semana.feedback.encuestaMonitor;
            }}
          >
            Encuesta Monitor
          </div>
          <div
            className="col-6 mx-auto linkEncuesta"
            onClick={() => {
              window.location.href = semana.feedback.encuestaEstudiantes;
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

  const renderFeedbacks = () => {
    if (semana.feedback !== undefined) {
      return (
        <div>
          {renderEncuestas()}
          {renderGrupales()}
          {renderIndividuales()}
        </div>
      );
    } else {
      return <div className="infoFail">No hubo Feedback</div>;
    }
  };

  const renderTeamworkIndividual = (grupo, nombre) => {
    return grupo.map(semanal => {
      if (
        usuario.rol === "PROFESOR" ||
        usuario.rol === "MONITOR" ||
        (usuario.rol === "ESTUDIANTE" && semanal.correo === usuario.correo)
      ) {
        return (
          <Teamwork
            key={
              "TEAMWORKINDIVIDUAL" +
              nombre +
              semana.nombre +
              nombre +
              semanal.nombre
            }
            usuario={usuario}
            teamwork={semanal}
            crearComentario={crearComentario}
          />
        );
      } else {
        return (
          <div
            key={
              "TEAMWORKINDIVIDUAL" +
              nombre +
              semana.nombre +
              nombre +
              semanal.nombre
            }
          ></div>
        );
      }
    });
  };

  const renderTeamworkTarde = () => {
    if (
      semana.teamwork.creadasTarde &&
      semana.teamwork.creadasTarde.length > 0
    ) {
      return (
        <div>
          <div className="row text-center">
            <div className="titleIndividuales">Creadas Tarde</div>
          </div>
          {renderTeamworkIndividual(
            semana.teamwork.creadasTarde,
            "CREADASTARDE"
          )}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const renderTeamwork = () => {
    if (semana.teamwork !== undefined) {
      return (
        <div>
          {renderTeamworkIndividual(
            semana.teamwork.semanal,
            "INDIVIDUAL"
          )}
          {renderTeamworkTarde()}
        </div>
      );
    } else {
      return <div className="infoFail">No hubo Teamwork</div>;
    }
  };

  const renderBody = () => {
    if (open) {
      return (
        <div className="bodySemana">
          <div className="feedback">
            <div className="row">
              <div className="titlesSemana">Feedback:</div>
            </div>
            {renderFeedbacks()}
          </div>
          <hr className="hrSemana" />
          <div className="teamwork">
            <div className="row">
              <div className="titlesSemana titleTeamwork">Teamwork:</div>
            </div>
            {renderTeamwork()}
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <Card className="cardSemana" border="dark" text="white">
      <Card.Header
        className="cardHeader "
        onClick={() => setOpen(!open)}
      >
        <Card.Title>
          <div className="row filaTitleSemana noselect">
            <div className="col-6 text-center nombreSemana">
              {semana.nombre}
            </div>
            <div className="col-6 fechaSemana">
              {semana.inicio + " - " + semana.fin}
            </div>
          </div>
        </Card.Title>
      </Card.Header>
      {renderBody()}
    </Card>
  );
}

export default Semana;
