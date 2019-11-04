import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Chat.css";
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: false,
      complain: "",
      answer: "",
      id: ""
    };
    this.input = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.activateChat = this.activateChat.bind(this);
  }
  componentDidUpdate() {
    if (this.state.chat) {
      let i;
      for (i in this.props.claims) {
        if (this.props.claims[i]._id === this.state.id) {
          if (this.state.answer !== this.props.claims[i].answer) {
            this.setState({
              answer: this.props.claims[i].answer
            });
          }
        }
      }
    }
  }

  handleSubmit(event) {
    let req = {};
    req["_id"] = this.state.id;
    req["answer"] = this.input.current.value;
    req["teacher"] = this.props.correo;
    req["state"] = "Contestado";
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
          this.setState({ answer: this.input.current.value });
        }
      });
    event.preventDefault();
  }
  activateChat(idParam, complainParam, answerParam) {
    this.setState({
      chat: true,
      complain: complainParam,
      answer: answerParam,
      id: idParam
    });
  }
  renderAnswer() {
    if (this.state.answer !== undefined) {
      return (
        <div className="answer">
          <p>{this.state.answer}</p>
        </div>
      );
    }
  }
  renderInputText() {
    if (this.state.answer !== undefined) {
      return "Modificar respuesta al reclamo";
    } else {
      return "Respuesta al reclamo";
    }
  }
  renderChat() {
    if (this.state.chat) {
      return (
        <div>
          <div className="board">
            <div className="complain">
              <p>{this.state.complain}</p>
            </div>

            {this.renderAnswer()}
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={this.renderInputText()}
              aria-label={this.renderInputText()}
              aria-describedby="button-addon2"
              ref={this.input}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                id="button-addon2"
                onClick={this.handleSubmit}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
  renderButton(state) {
    if (state === "Pendiente") {
      return "Responder";
    } else {
      return "Modificar";
    }
  }
  renderMessages = () => {
    return this.props.claims.map(d => (
      <tr key={d._id}>
        <th scope="row">{d.id_feedback}</th>
        <td>{d.state}</td>
        <td>{d.section}</td>
        <td>{d.student}</td>
        <td>
          <button
            className="btn btn-primary"
            onClick={() => this.activateChat(d._id, d.complain, d.answer)}
          >
            {this.renderButton(d.state)}
          </button>
        </td>
      </tr>
    ));
  };
  render() {
    return (
      <div className="row screen">
        <div className="list col-sm-6">
          <h1>Reclamos</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">idFeedback</th>
                <th scope="col">Estado</th>
                <th scope="col">Seccion</th>
                <th scope="col">Estudiante</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>{this.renderMessages()}</tbody>
          </table>
        </div>
        <div className="list col-sm-1"> </div>
        <div className="list col-sm-4">{this.renderChat()}</div>
        <div className="list col-sm-1"> </div>
      </div>
    );
  }
}
export default withRouter(Chat);
