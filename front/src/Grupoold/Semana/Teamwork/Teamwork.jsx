import React from "react"; // sguzmanm: Why not refactor using React hooks?
import { Card } from "react-bootstrap";
import "./Teamwork.css";

class Teamwork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  renderList = () => {
    console.log(this.props.teamwork.tasks);
    return this.props.teamwork.tasks.map(task => {
      return (
        <tr key={"TASK" + task.taskId}>
          <th scope="row">{task.nombre}</th>
          <td>{task.startDate}</td>
          <td>{task.dueDate}</td>
          <td>{task.createdOn}</td>
          <td>{task.completedOn}</td>
          <td>{task.timeLogger}</td>
          {this.props.usuario.rol === "ESTUDIANTE" ? (
            <td>CLICK</td>
          ) : (
            <div></div>
          )}
        </tr>
      );
    });
  };

  renderColMensaje = () => {};

  renderBody = () => {
    if (this.state.open) {
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
                {this.props.usuario.rol === "ESTUDIANTE" ? (
                  <th scope="col">Comentario</th>
                ) : (
                  <div></div>
                )}
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  render() {
    return (
      <div className="row">
        <Card className="cardTeamwork" border="dark" text="dark">
          <Card.Header
            className="cardHeaderTeamwork "
            onClick={() => this.setState({ open: !this.state.open })}
          >
            <Card.Title>
              <div className="row filaTitleTeamwork noselect">
                <div className="col-9 text-center nombreTeamwork">
                  {this.props.teamwork.nombre}
                </div>
                <div className="col-2 numTasksTeamwork">
                  {this.props.teamwork.tasks.length}
                </div>
                <div className="col-1"></div>
              </div>
            </Card.Title>
          </Card.Header>
          {this.renderBody()}
        </Card>
      </div>
    );
  }
}
export default Teamwork;
