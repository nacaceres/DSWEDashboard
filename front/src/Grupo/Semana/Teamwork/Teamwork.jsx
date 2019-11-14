import React, { useState } from "react";
import { Card } from "react-bootstrap";
import "./Teamwork.css";

const Teamwork = ({
  teamwork,
  usuario
}) => {
  const [open, setOpen] = useState(false);

  const renderList = () => {
    console.log(teamwork.tasks);
    return teamwork.tasks.map(task => {
      return (
        <tr key={"TASK" + task.taskId}>
          <th scope="row">{task.nombre}</th>
          <td>{task.startDate}</td>
          <td>{task.dueDate}</td>
          <td>{task.createdOn}</td>
          <td>{task.completedOn}</td>
          <td>{task.timeLogger}</td>
          {usuario.rol === "ESTUDIANTE" ? (
            <td>CLICK</td>
          ) : (
            <div></div>
          )}
        </tr>
      );
    });
  };

  const renderBody = () => {
    if (open) {
      return (
        <div className="bodyTeamwork">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Fecha Inicio</th>
                <th scope="col">Fecha Limite</th>
                <th scope="col">Fecha Creación</th>
                <th scope="col">Fecha Entrega</th>
                <th scope="col">Minutos Registrados</th>
                {usuario.rol === "ESTUDIANTE" ? (
                  <th scope="col">Comentario</th>
                ) : (
                  <div></div>
                )}
              </tr>
            </thead>
            <tbody>{renderList()}</tbody>
          </table>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  return (
    <div className="row">
      <Card className="cardTeamwork" border="dark" text="dark">
        <Card.Header
          className="cardHeaderTeamwork "
          onClick={() => setOpen(!open)}
        >
          <Card.Title>
            <div className="row filaTitleTeamwork noselect">
              <div className="col-9 text-center nombreTeamwork">
                {teamwork.nombre}
              </div>
              <div className="col-2 numTasksTeamwork">
                {teamwork.tasks.length}
              </div>
              <div className="col-1"></div>
            </div>
          </Card.Title>
        </Card.Header>
        {renderBody()}
      </Card>
    </div>
  );
}

export default Teamwork;
