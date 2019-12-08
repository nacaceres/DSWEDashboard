import React, { useEffect } from "react";
import { Card, Form, Modal, Nav } from "react-bootstrap";
import "./Grupo.css";
import { withRouter } from "react-router-dom";

function Grupo(props) {
  const [modalShow, setModalShow] = React.useState(false);
  const [infoGrupo, setInfoGrupo] = React.useState(null);
  const [commentario, setCommentario] = React.useState("");
  const [id, setId] = React.useState("");
  const [semanaActual, setSemanaActual] = React.useState(null);
  const [showEstadoActual, setShowEstadoActual] = React.useState(false);

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
    return <div style={{ backgroundColor: color }} className="notaCont"></div>;
  }

  function renderGrupales() {
    if (
      semanaActual.feedback.preguntasGrupales !== undefined &&
      semanaActual.feedback.preguntasGrupales.length > 0
    ) {
      return (
        <div>
          {semanaActual.feedback.preguntasGrupales.map(pregunta => {
            if (props.usuario.rol !== "ESTUDIANTE") {
              return (
                <div
                  className="row filaPreguntaGrupal"
                  key={semanaActual.nombre + pregunta.pregunta}
                >
                  <div className="col-6">{pregunta.pregunta}</div>
                  <div className="col-1">{renderNota(pregunta.nota)}</div>
                  <div className="col-4">{pregunta.commentario}</div>
                </div>
              );
            } else {
              return (
                <div
                  className="row filaPreguntaGrupal"
                  key={semanaActual.nombre + pregunta.pregunta}
                >
                  <div className="col-8">{pregunta.pregunta}</div>
                  <div className="col-2">{renderNota(pregunta.nota)}</div>
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
          })}
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  function renderFeedbacks() {
    if (semanaActual !== null && semanaActual.feedback !== undefined) {
      return <div>{renderGrupales()}</div>;
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
                class="btn btn-outline-dark mx-auto btnSemana"
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
                class="btn btn-dark mx-auto btnSemana"
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

  function renderEstadoActual() {
    if (showEstadoActual) {
      return <div className="row filaClpsEstadoActual">ESTADOOO</div>;
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

  function renderInfoSemana() {
    let classStr = "row ";
    if (showEstadoActual) {
      classStr += "infoSemanaCon";
    } else {
      classStr += "infoSemanaSin";
    }
    return (
      <div className={classStr}>
        <div className="col-lg-6 colGrupal">
          <div className="row titleInfoSemana">
            <div className="mx-auto">Grupal</div>
          </div>
          <hr className="hrTitleInfo"></hr>
          <div className="row">
            <div className="titlesSemana">Feedback:</div>
          </div>
          {renderFeedbacks()}
        </div>
        <div className="col-lg-6 colIndividual">
          <div className="row titleInfoSemana text-center">
            <div className="mx-auto">Indivudual</div>
          </div>
          <hr className="hrTitleInfo"></hr>
        </div>
      </div>
    );
  }

  if (infoGrupo !== null) {
    return (
      <div className="container-fluid contGrupo">
        <div className="row">
          <div className="col-lg-2 colSemanas">{renderSemanas()}</div>
          <div className="col-lg-10">
            <div className="row row filaNombre">
              <div className="col-sm-8">
                <div className="mx-auto ">
                  <h1 className="lblNombreGrupo">{infoGrupo.grupo.nombre}</h1>
                </div>
              </div>
              <div className="col-sm-2 colEstadoActual">
                {renderBtnEstadoActual()}
              </div>
              <div className="col-sm-2"></div>
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
              className="botonRojo"
              onClick={() => {
                handleCancel();
                setModalShow(false);
              }}
            >
              Cancelar
            </button>
            <button
              className="botonVerde2 align-bottom"
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
