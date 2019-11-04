import React from "react";
import { Card } from "react-bootstrap";
import "./Teamwork.css";

class Teamwork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  renderBody = () => {
    if (this.state.open) {
      return <div className="bodyTeamwork">HOLA</div>;
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
