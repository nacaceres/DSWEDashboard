import React from "react";
import "./Teamwork.css";

class Teamwork extends React.Component {
  renderInfo = (task) => {
    if (
      this.props.usuario !== null &&
      this.props.usuario.rol === "ESTUDIANTE"
    ) {
      return <td 
      onClick={() => {
        var val = {
          id: task.taskId,
          tipo:"TEAMWORK"
        };
        this.props.crearComentario("TEAMWORK", val);
      }}
    >
      <i className="fas fa-comment-medical "></i>
    </td>;
    }
  };

  renderInfo2 = () => {
    if (
      this.props.usuario !== null &&
      this.props.usuario.rol === "ESTUDIANTE"
    ) {
      return <th scope="col">Comentario</th>;
    }
  };

  renderList = () => {
    return this.props.teamwork.tasks.map(task => {
      return (
        <tr key={"TASK" + task.taskId}>
          <th scope="row">{task.nombre}</th>
          <td>{task.startDate}</td>
          <td>{task.dueDate}</td>
          <td>{task.createdOn}</td>
          <td>{task.completedOn}</td>
          <td>{task.timeLogger}</td>
          {this.renderInfo(task)}
        </tr>
      );
    });
  };

  renderBody = () => {
    return (
      <div className="table-responsive tablaTeamwork">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Limite</th>
              <th scope="col">Fecha Creación</th>
              <th scope="col">Fecha Entrega</th>
              <th scope="col">Minutos Registrados</th>
              {this.renderInfo2()}
            </tr>
          </thead>
          <tbody>{this.renderList()}</tbody>
        </table>
      </div>
    );
  };

  render() {
    return <div className="row">{this.renderBody()}</div>;
  }
}
export default Teamwork;
