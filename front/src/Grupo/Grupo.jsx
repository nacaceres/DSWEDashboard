import React, { useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import "./Grupo.css";
import { withRouter } from "react-router-dom";

function Grupo(props) {
  const [modalShow, setModalShow] = React.useState(false);
  const [infoGrupo, setInfoGrupo] = React.useState(null);

  function crearComentario() {
    setModalShow(true);
  }

  function handleCancel() {}

  function handelConfirm() {}

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
        if (!(encontrado && encontrado)) {
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
              console.log(data);
              setInfoGrupo(data);
            });
        }
      }
    }
    //Revisar permisos
  });

  if (infoGrupo !== null) {
    return (
      <div className="container contGrupo">
        <div className="row">
          <div className="col-lg-8">
            <div className="mx-auto text-center lblNombreGrupo">
              {infoGrupo.grupo.nombre}
            </div>
          </div>
          <div className="col-lg-4"></div>
        </div>

        <Modal
          show={modalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmar
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Temp</h4>
          </Modal.Body>
          <Modal.Footer>
            {/* <button
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
                </button> */}
          </Modal.Footer>
        </Modal>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default withRouter(Grupo);
