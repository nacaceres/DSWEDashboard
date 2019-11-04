import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./Grupo.css";
import { withRouter } from "react-router-dom";

function Grupo(props) {
  const [modalShow, setModalShow] = React.useState(false);

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
        console.log("ok");
        fetch(
          "/grupo?seccion=" +
            props.match.params.seccion +
            "&grupo=" +
            props.match.params.grupo
        )
          .then(res => res.json())
          .then(data => {
            console.log("ahhh");
            console.log(data);
          });
      }
    }
    //Revisar permisos
  });

  console.log(props);
  return (
    <div className="container-fluid">
      {props.usuario.rol}
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
}

export default withRouter(Grupo);
