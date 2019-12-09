import React, { useEffect } from "react";
import { Form, Modal, Card } from "react-bootstrap";
import "./Grupo.css";
import { withRouter } from "react-router-dom";
import Teamwork from "./Teamwork/Teamwork.jsx";

function Grupo(props) {
  const [modalShow, setModalShow] = React.useState(false);
  const [infoGrupo, setInfoGrupo] = React.useState(null);
  const [commentario, setCommentario] = React.useState("");
  const [id, setId] = React.useState("");
  const [semanaActual, setSemanaActual] = React.useState(null);
  const [showEstadoActual, setShowEstadoActual] = React.useState(false);
  const [pgActual, setPgActual] = React.useState("Back");

  function crearComentario(tipo, val) {
    if (tipo === "FEEDBACK") {
      val.id = infoGrupo.numero + "-" + infoGrupo.grupo.nombre + "" + val.id;
    }
    setId(val.id);
    setModalShow(true);
  }

  function handleCancel() {
    setModalShow(false);
  }

  function handelConfirm() {
    let req = {};
    req["id_feedback"] = id;
    let lista = [];
    lista.push({
      role: "ESTUDIANTE",
      date: Date(),
      message: commentario
    });
    req["messages"] = lista;
    req["student"] = props.usuario.correo;
    req["section"] = props.usuario.secciones[0].numero;
    console.log(req);
    fetch("/addclaim", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.err) {
          console.log("Hubo un error haciendo el post del reclamo");
        } else {
          //alert("Tu comentario ha sido enviado exitosamente!");
        }
      });
    setModalShow(false);
  }

  useEffect(() => {
    if (
      props.match.params.length === 0 ||
      props.match.params.seccion === undefined ||
      props.match.params.seccion === 0 ||
      props.match.params.grupo === undefined ||
      props.match.params.grupo === null
    ) {
      props.history.push("/");
    } else {
      if (
        infoGrupo == null ||
        props.match.params.grupo !== infoGrupo.grupo.nombre
      ) {
        let encontrado = false;
        props.usuario.secciones.forEach(seccion => {
          if (seccion.numero === parseInt(props.match.params.seccion)) {
            encontrado = true;
          }
        });
        let encontrado2 = false;
        props.usuario.secciones.forEach(seccion => {
          seccion.grupos.forEach(grupo => {
            if (grupo === props.match.params.grupo) {
              encontrado2 = true;
            }
          });
        });
        if (!(encontrado && encontrado2) && false) {
          //TODO QUITAR FALSE
          props.history.push("/");
        } else {
          fetch(
            "/grupo?seccion=" +
              props.match.params.seccion +
              "&grupo=" +
              props.match.params.grupo
          )
            .then(res => res.json())
            .then(data => {
              setInfoGrupo(data);
              if (
                data !== null &&
                data.grupo &&
                data.grupo.semanas &&
                data.grupo.semanas.length > 0
              ) {
                setSemanaActual(data.grupo.semanas[0]);
              }
            });
        }
      }
    }
    //Revisar permisos
  });

  function renderNota(nota) {
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
  }

  function renderGrupales() {
    if (semanaActual !== null && semanaActual.feedback !== undefined) {
      if (
        semanaActual.feedback.preguntasGrupales !== undefined &&
        semanaActual.feedback.preguntasGrupales.length > 0
      ) {
        return semanaActual.feedback.preguntasGrupales.map(pregunta => {
          if (props.usuario.rol !== "ESTUDIANTE") {
            return (
              <div
                className="row filaPreguntaGrupal"
                key={semanaActual.nombre + pregunta.pregunta}
              >
                <div className="col-6">{pregunta.pregunta}</div>
                <div className="col-md-1 colEstadoActual">
                  {renderNota(pregunta.nota)}
                </div>
                <div className="col-5">{pregunta.commentario}</div>
              </div>
            );
          } else {
            return (
              <div
                className="row filaPreguntaGrupal"
                key={semanaActual.nombre + pregunta.pregunta}
              >
                <div className="col-8">{pregunta.pregunta}</div>
                <div className="col-md-2 colEstadoActual">
                  {renderNota(pregunta.nota)}
                </div>
                <div
                  className="col-1 addComment"
                  onClick={() => {
                    var val = {
                      id: semanaActual.nombre + "-" + pregunta.nombre,
                      encuestaEstudiantes:
                        semanaActual.feedback.encuestaEstudiantes,
                      encuestaMonitor: semanaActual.feedback.encuestaMonitor
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
        });
      } else {
        return <div className="infoFail">No Hubo Preguntas Grupales</div>;
      }
    } else {
      return <div className="infoFail">No hubo Feedback</div>;
    }
  }

  function renderSemanas() {
    if (semanaActual !== null) {
      return infoGrupo.grupo.semanas.map(semana => {
        if (semanaActual.nombre !== semana.nombre) {
          return (
            <div
              className="row filaSemana"
              key={
                infoGrupo.numero +
                "-" +
                infoGrupo.grupo.nombre +
                "-" +
                semana.nombre
              }
            >
              <button
                type="button"
                className="btn btn-outline-dark mx-auto btnSemana"
                onClick={() => {
                  setSemanaActual(semana);
                }}
              >
                {semana.nombre}
              </button>
            </div>
          );
        } else {
          return (
            <div
              className="row filaSemana"
              key={
                infoGrupo.numero +
                "-" +
                infoGrupo.grupo.nombre +
                "-" +
                semana.nombre
              }
            >
              <button
                type="button"
                className="btn btn-dark mx-auto btnSemana"
                onClick={() => {
                  setSemanaActual(semana);
                }}
              >
                {semana.nombre}
              </button>
            </div>
          );
        }
      });
    } else {
      return <div></div>;
    }
  }

  function renderFechaSemana() {
    if (semanaActual !== null) {
      if (props.usuario.rol === "PROFESOR" && semanaActual.feedback) {
        return (
          <div className="row">
            <div className="col-sm-7">
              <div className="row text-center">
                <div className="mx-auto nombreFechaLbl">
                  {semanaActual.nombre +
                    " " +
                    semanaActual.inicio +
                    " - " +
                    semanaActual.fin}
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="row text-center">
                <div
                  className="col-6 mx-auto linkEncuesta"
                  onClick={() => {
                    window.location.href =
                      semanaActual.feedback.encuestaMonitor;
                  }}
                >
                  Encuesta Monitor
                </div>
                <div
                  className="col-6 mx-auto linkEncuesta"
                  onClick={() => {
                    window.location.href =
                      semanaActual.feedback.encuestaEstudiantes;
                  }}
                >
                  Encuesta Estudiantes
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="row text-center">
            <div className="mx-auto nombreFechaLbl">
              {semanaActual.nombre +
                " " +
                semanaActual.inicio +
                " - " +
                semanaActual.fin}
            </div>
          </div>
        );
      }
    } else {
      return <div></div>;
    }
  }

  function renderBtnsActual() {
    if (pgActual === "Back") {
      return (
        <div className="col">
          <div className="row text-center">
            <div className="mx-auto">
              <button
                type="button"
                className="btn btn-dark btnEstadoActual"
                onClick={() => {
                  setPgActual("Back");
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-outline-dark  btnEstadoActual"
                onClick={() => {
                  setPgActual("Front");
                }}
              >
                Front
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col">
          <div className="row text-center">
            <div className="mx-auto">
              <button
                type="button"
                className="btn btn-outline-dark btnEstadoActual"
                onClick={() => {
                  setPgActual("Back");
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-dark  btnEstadoActual"
                onClick={() => {
                  setPgActual("Front");
                }}
              >
                Front
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  function renderInfoAPIs() {
    let current_date = new Date();
    let semestre =
      current_date.getFullYear() +
      (current_date.getMonth() < 8 ? "1" : "2") +
      "0";
    return (
      <div className="row">
        <div className="row mx-auto rowInfoApis">
          <div className="col-4 colInfo colInfoCenter">
            <a
              className="sonar text-center"
              target="_blank"
              rel="noopener noreferrer"
              href={
                pgActual === "Back"
                  ? "http://jenkins-" +
                    infoGrupo.numero +
                    ".sis.virtual.uniandes.edu.co:9000/dashboard?id=co.edu.uniandes.csw%3As" +
                    infoGrupo.numero +
                    "_" +
                    infoGrupo.grupo.nombre.toLowerCase()
                  : "http://jenkins-" +
                    infoGrupo.numero +
                    ".sis.virtual.uniandes.edu.co:9000/dashboard?id=" +
                    infoGrupo.grupo.nombre.toLowerCase() +
                    "-front%3Asonar"
              }
            >
              <img
                src={
                  pgActual === "Back"
                    ? "http://157.253.238.75:8080/sonar" +
                      infoGrupo.numero +
                      "/project_badges/quality_gate?project=%20co.edu.uniandes.csw:s" +
                      infoGrupo.numero +
                      "_" +
                      infoGrupo.grupo.nombre.toLowerCase()
                    : "http://157.253.238.75:8080/sonar" +
                      infoGrupo.numero +
                      "/project_badges/quality_gate?project=%20" +
                      infoGrupo.grupo.nombre.toLowerCase() +
                      "-front%3Asonar"
                }
                className=" contImg img-fluid"
                alt="SonarStatus"
              />
            </a>
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={
              "http://jenkins-" +
              infoGrupo.numero +
              ".sis.virtual.uniandes.edu.co/job/" +
              infoGrupo.grupo.nombre +
              (pgActual === "Back" ? "/" : "_Front/")
            }
            className="col-4 text-center colInfo"
          >
            <div className="row text-center">
              <div className="contImg mx-auto">
                <img
                  src="/images/jenkins.png"
                  className=" contImg img-fluid"
                  alt="JenkinsLogo"
                />
              </div>
            </div>
            <div className="row">
              <div className="contBallImg mx-auto">
                <img
                  src={
                    "http://157.253.238.75:8080/jenkins" +
                    infoGrupo.numero +
                    "ic/?style=ball-48x48&job=" +
                    infoGrupo.grupo.nombre +
                    (pgActual === "Back" ? "" : "_Front")
                  }
                  className="img-fluid"
                  alt="JenkinsState"
                />
              </div>
            </div>
          </a>
          <div className="col-4 colInfoCenter colInfo">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="analisis text-center"
              href={
                "https://uniandes-isis2603.github.io/Analisis/" +
                semestre +
                "/s" +
                infoGrupo.numero +
                "/" +
                infoGrupo.grupo.nombre +
                (pgActual === "Back" ? "/back/" : "/front/")
              }
            >
              <img
                src="data:image/png;base64,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jLWufKctGoWnIw4AcGOjWN/y1tdsx6GxKtsJ7HPao0+f886GAQBQtmmvw4RQvUhb7HjaWFiBVcalOXiYHvK3AWhLOm5ICXL8QpQ9tVQOjkDQst3kjljKgheKswFgxfJHApMnVFxNgF8wAMqfusPPawTJ4Lcx9PdmlFLG72y/fs8UtE6wPpJ5rHMWn6z9yyKsZNk/gDMeMJhiEvVN0fR/wouoJzEUz7x8dUdqxVlH3rspmvJ3xoqHOIVkUgC+esbU4b2wmn7vso5tt332juTE8AP+aHqnz7Srh6oE2Qs7D09dHikMB4ihlaGYUkwoCCRoBhzLhhxayA/GqfK9hSMoMEDu1IjDb9/4StNyeNnEeK7Mond3vTGetu7ZNfLHjhQAHPPgX5dt/dZn25Jh9yfJgDgOJG2wNgCG1iVqnB2XA4asMOKOC8+OjHw2rcHsfjNeG5KO4xzQGOC4kZ0sRHAc7Wqt9e40/fILyzc8AyCBMqdAx4ti5NA718yf35exjaRjKrcEgXABSGB520DL0qaOGEbODWP395dMi/X0TG0diAciSbPk32f5pPBBW6ztV03t/fD6Z2K8hxj/Hwcf/wvPBJZ+9MswgwAAADt0RVh0QXV0aG9yAEFkYW0gV2FsZGVuYmVyZywgYmFzZWQgb24gdGhlIEdpdCBMb2dvIGJ5IEphc29uIExvbmdbAluwAAAAJWlUWHRDb3B5cmlnaHQAAAAAAMKpIDIwMTUgQWRhbSBXYWxkZW5iZXJn6lGO2AAAAsJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCA5LjI3Jz4KPHJkZjpSREYgeG1sbnM6cmRmPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjJz4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOmNjPSdodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMnPgogIDxjYzpsaWNlbnNlPkNyZWF0aXZlIENvbW1vbnMgQXR0cmlidXRpb24gMy4wIFVucG9ydGVkIExpY2Vuc2UuIFRoaXMgbGljZW5zZSBsZXRzIG90aGVycyBkaXN0cmlidXRlLCByZW1peCwgdHdlYWssIGFuZCBidWlsZCB1cG9uIHlvdXIgd29yaywgZXZlbiBjb21tZXJjaWFsbHksIGFzIGxvbmcgYXMgdGhleSBjcmVkaXQgeW91IGZvciB0aGUgb3JpZ2luYWwgY3JlYXRpb24uIFRoaXMgaXMgdGhlIG1vc3QgYWNjb21tb2RhdGluZyBvZiB0aGUgQ0MgbGljZW5zZXMgb2ZmZXJlZC4gUmVjb21tZW5kZWQgZm9yIG1heGltdW0gZGlzc2VtaW5hdGlvbiBhbmQgdXNlIG9mIGxpY2Vuc2VkIG1hdGVyaWFscy48L2NjOmxpY2Vuc2U+CiA8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/PtC9Q+UAAAAASUVORK5CYII="
                className=" analisisImg img-fluid"
                alt="Analisis"
              />
            </a>
          </div>
        </div>
      </div>
    );
  }

  function renderEstadoActual() {
    if (showEstadoActual) {
      return (
        <div className="row filaClpsEstadoActual">
          <Card className="cardEstadoActual" border="dark">
            <Card.Body>
              {renderInfoAPIs()}
              {renderBtnsActual()}
            </Card.Body>
          </Card>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  function renderBtnEstadoActual() {
    if (showEstadoActual) {
      return (
        <button
          type="button"
          className="btn btn-dark mx-auto btnEstadoActual"
          onClick={() => {
            setShowEstadoActual(false);
          }}
        >
          Estado Actual
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="btn btn-outline-dark mx-auto btnEstadoActual"
          onClick={() => {
            setShowEstadoActual(true);
          }}
        >
          Estado Actual
        </button>
      );
    }
  }

  function renderFeedBackIndiv() {
    if (
      semanaActual !== null &&
      semanaActual.feedback !== undefined &&
      semanaActual.feedback.individuales !== undefined &&
      semanaActual.feedback.individuales.length > 0
    ) {
      let pregIndiv = null;
      semanaActual.feedback.individuales.forEach(usr => {
        if (
          usr.correo === props.usuario.correo &&
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
              key={semanaActual.nombre + pregunta.pregunta}
            >
              <div className="col-8">{pregunta.pregunta}</div>
              <div className="col-md-2 colEstadoActual">
                {renderNota(pregunta.nota)}
              </div>
              <div
                className="col-1 addComment"
                onClick={() => {
                  var val = {
                    id: semanaActual.nombre + "-" + pregunta.nombre,
                    encuestaEstudiantes:
                      semanaActual.feedback.encuestaEstudiantes,
                    encuestaMonitor: semanaActual.feedback.encuestaMonitor
                  };
                  crearComentario("FEEDBACK", val);
                }}
              >
                <i className="fas fa-comment-medical"></i>
              </div>
              <div className="col-1"></div>
            </div>
          );
        });
      } else {
        return <div className="infoFail">No hubo Feedback Individual</div>;
      }
    } else {
      return <div className="infoFail">No hubo Feedback</div>;
    }
  }

  function renderTeamwork(nombre, semanal) {
    return (
      <Teamwork
        key={
          "TEAMWORK" + nombre + semanaActual.nombre + nombre + semanal.nombre
        }
        usuario={props.usuario}
        teamwork={semanal}
        crearComentario={crearComentario}
      />
    );
  }

  function renderTeamworkIndiv() {
    if (
      semanaActual !== null &&
      semanaActual.teamwork !== undefined &&
      semanaActual.teamwork.semanal.length > 0
    ) {
      let sem = null;
      semanaActual.teamwork.semanal.forEach(semanal => {
        if ((semanal.correo = props.usuario.correo)) {
          sem = semanal;
        }
      });
      if (sem !== null) {
        return renderTeamwork("INDIVIDUAL", sem);
      } else {
        return <div className="row infoFail">No se encontraron tareas</div>;
      }
    } else {
      return <div className="row infoFail">No se encontraron tareas</div>;
    }
  }

  function renderInfoIndividual() {
    console.log(semanaActual);
    if (props.usuario.rol === "ESTUDIANTE") {
      return (
        <div>
          <div className="row">
            <div className="titlesSemana">Feedback:</div>
          </div>
          {renderFeedBackIndiv()}
          <div className="row">
            <div className="titlesSemana">Teamwork:</div>
          </div>
          {renderTeamworkIndiv()}
        </div>
      );
    } else {
      return <div></div>;
    }

    // return grupo.map(semanal => {
    //   if (
    //     usuario.rol === "PROFESOR" ||
    //     usuario.rol === "MONITOR" ||
    //     (usuario.rol === "ESTUDIANTE" && semanal.correo === usuario.correo)
    //   ) {
    //     return (
    //       <Teamwork
    //         key={
    //           "TEAMWORKINDIVIDUAL" +
    //           nombre +
    //           this.props.semana.nombre +
    //           this.nombre +
    //           semanal.nombre
    //         }
    //         usuario={this.props.usuario}
    //         teamwork={semanal}
    //         crearComentario={this.props.crearComentario}
    //       />
    //     );
    //   } else {
    //     return (
    //       <div
    //         key={
    //           "TEAMWORKINDIVIDUAL" +
    //           nombre +
    //           this.props.semana.nombre +
    //           this.nombre +
    //           semanal.nombre
    //         }
    //       ></div>
    //     );
    //   }
    // });
  }

  function renderInfoSemana() {
    let classStr = " ";
    if (showEstadoActual === true) {
      classStr += "infoSemanaCon";
    } else {
      classStr += "infoSemanaSin";
    }
    return (
      <div className="row">
        <div className={"col-lg-6 colGrupal" + classStr}>
          <div className="row titleInfoSemana">
            <div className="mx-auto">Grupal</div>
          </div>
          <hr className="hrTitleInfo"></hr>
          <div className="row">
            <div className="titlesSemana">Feedback:</div>
          </div>
          {renderGrupales()}
        </div>
        <div className={"col-lg-6 colIndividual" + classStr}>
          <div className="row titleInfoSemana text-center">
            <div className="mx-auto">Individual</div>
          </div>
          <hr className="hrTitleInfo"></hr>
          {renderInfoIndividual()}
        </div>
      </div>
    );
  }

  if (infoGrupo !== null) {
    return (
      <div className="container-fluid contGrupo">
        <div className="row">
          <div className="col-lg-2 colSemanas">{renderSemanas()}</div>
          <div className="col-lg-10 colInfoGrupo">
            <div className="row filaNombre">
              <div className="col-8">
                <div className="mx-auto ">
                  <h1 className="lblNombreGrupo">{infoGrupo.grupo.nombre}</h1>
                </div>
              </div>
              <div className="col-2 colEstadoActual">
                {renderBtnEstadoActual()}
              </div>
              <div className="col-2"></div>
            </div>

            {renderEstadoActual()}
            {renderFechaSemana()}
            {renderInfoSemana()}
          </div>
        </div>

        <Modal
          onHide={() => {
            setModalShow(false);
          }}
          show={modalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Comentar
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Ingrese su comentario:</Form.Label>
              <Form.Control
                value={commentario}
                onChange={event => {
                  setCommentario(event.target.value);
                }}
                as="textarea"
                rows="6"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-danger"
              onClick={() => {
                handleCancel();
                setModalShow(false);
              }}
            >
              Cancelar
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                handelConfirm();
              }}
            >
              Confirmar
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default withRouter(Grupo);
