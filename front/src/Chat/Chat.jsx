import React, { useState, useEffect, createRef } from "react";
import { withRouter } from "react-router-dom";
import "./Chat.css";

const Chat = ({
  correo,
  rol,
  claims
}) => {
  const [chat, setChat] = useState(false);
  const [complain, setComplain] = useState('');
  const [answer, setAnswer] = useState('');
  const [id, setId] = useState('');
  const input = createRef();

  useEffect(() => {
    if (chat) {
      claims.forEach(claim => {
        if (claim._id === id)
          if (answer !== claim.answer) setAnswer(claim.answer);
      });
    }
  });

  const handleSubmit = event => {
    const req = {
      _id: id,
      answer: input.current.value,
      teacher: correo,
      state: 'Contestado'
    };

    fetch("addanswer", {
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
          console.log("Hubo un error haciendo el post de la respuesta");
        } else {
          setAnswer(input.current.value)
        }
      });
    event.preventDefault();
  }

  const activateChat = (idParam, complainParam, answerParam) => {
    setChat(true);
    setComplain(complainParam);
    setAnswer(answerParam);
    setId(idParam);
  }

  const renderAnswer = () =>
    answer !== undefined
      ? <div className="answer">
          <p>{answer}</p>
        </div>
      : null;

  const renderInputText = () =>
    answer !== undefined ? 'Modificar respuesta al reclamo' : 'Respuesta al reclamo';

  const renderChat = () => {
    if (chat && rol !== "ESTUDIANTE") {
      return (
        <div>
          <div className="board">
            <div className="complain">
              <p>{complain}</p>
            </div>

            {renderAnswer()}
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={renderInputText()}
              aria-label={renderInputText()}
              aria-describedby="button-addon2"
              ref={input}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                id="button-addon2"
                onClick={handleSubmit}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      );
    } else if (chat) {
      return (
        <div>
          <div className="board">
            <div className="complain">
              <p>{complain}</p>
            </div>
            {renderAnswer()}
          </div>
        </div>
      );
    }
  }

  const renderButton = state => state === 'Pendiente' ? 'Responder' : 'Modificar';

  const renderEncargado = encargado => encargado !== undefined ? encargado : 'No ha sido asignado';

  const renderMessages = () =>
    rol == 'ESTUDIANTE'
      ? claims.map(d => (
          <tr key={d._id}>
            <th scope="row">{d.id_feedback}</th>
            <td>{d.state}</td>
            <td>{d.section}</td>
            <td>{renderEncargado(d.teacher)}</td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => activateChat(d._id, d.complain, d.answer)}
              >
                Detalle
              </button>
            </td>
          </tr>
        ))
      :  claims.map(d => (
          <tr key={d._id}>
            <th scope="row">{d.id_feedback}</th>
            <td>{d.state}</td>
            <td>{d.section}</td>
            <td>{d.student}</td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => activateChat(d._id, d.complain, d.answer)}
              >
                {renderButton(d.state)}
              </button>
            </td>
          </tr>
        ));

  const renderEncabezado = () =>
    rol === "ESTUDIANTE"
      ? <tr>
          <th scope="col">idFeedback</th>
          <th scope="col">Estado</th>
          <th scope="col">Seccion</th>
          <th scope="col">Encargado</th>
          <th scope="col"></th>
        </tr>
      : <tr>
          <th scope="col">idFeedback</th>
          <th scope="col">Estado</th>
          <th scope="col">Seccion</th>
          <th scope="col">Estudiante</th>
          <th scope="col"></th>
        </tr>

  return (
    <div className="row screen container-fluid">
      <div className="list col-sm-6">
        <h1>Reclamos</h1>
        <table className="table table-hover">
          <thead>{renderEncabezado()}</thead>
          <tbody>{renderMessages()}</tbody>
        </table>
      </div>
      <div className="list col-sm-1"> </div>
      <div className="list col-sm-4">{renderChat()}</div>
      <div className="list col-sm-1"> </div>
    </div>
  );
}

export default withRouter(Chat);
