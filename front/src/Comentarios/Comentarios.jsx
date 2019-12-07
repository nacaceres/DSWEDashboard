import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Comentarios.css";
class Comentarios extends Component {
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
        <div className="outgoing_msg">
          <div className="sent_msg">
            <p>{this.state.answer}</p>
            <span className="time_date"> 11:01 AM | June 9</span>{" "}
          </div>
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
    if (this.state.chat && this.props.rol !== "ESTUDIANTE") {
      return (
        <div>
          <div className="incoming_msg">
            <div className="incoming_msg_img">
              {" "}
              <img
                src="https://ptetutorials.com/images/user-profile.png"
                alt="sunil"
              />{" "}
            </div>
            <div className="received_msg">
              <div className="received_withd_msg">
                <p>{this.state.complain}</p>
                <span className="time_date"> 11:01 AM | June 9</span>
              </div>
            </div>
          </div>
          {this.renderAnswer()}
        </div>
      );
    } else if (this.state.chat) {
    }
  }
  renderButton(state) {
    if (state === "Pendiente") {
      return "Responder";
    } else {
      return "Modificar";
    }
  }
  renderEncargado(encargado) {
    if (encargado !== undefined) {
      return encargado;
    } else {
      return "No ha sido asignado";
    }
  }
  checkMessageClass(id)
  {
    if(id!== this.state.id)
    {
      return "chat_list"
    }
    else
    {
      return "chat_list active_chat"
    }
  }
  renderMessages = () => {
    if (this.props.rol === "ESTUDIANTE") {
      return this.props.claims.map(d => (
        <div className="chat_list">
          <div className="chat_people">
            <div className="chat_img">
              {" "}
              <img
                src="https://ptetutorials.com/images/user-profile.png"
                alt="sunil"
              />
            </div>
            <div className="chat_ib">
              <h5>
                Sunil Rajput <span className="chat_date">Dec 25</span>
              </h5>
              <p>
                Test, which is a new approach to have all solutions astrology
                under one roof.
              </p>
            </div>
          </div>
        </div>
      ));
    } else {
      return this.props.claims.map(d => (
        <div
          className={this.checkMessageClass(d._id)}
          key={d._id}
          onClick={() => this.activateChat(d._id, d.complain, d.answer)}
        >
          <div className="chat_people">
            <div className="chat_img">
              {" "}
              <img
                src="https://ptetutorials.com/images/user-profile.png"
                alt="sunil"
              />
            </div>
            <div className="chat_ib">
              <h5>
                {d.student} <span className="chat_date">Dec 25</span>
              </h5>
              <p>
                Seccion: {d.section} - Estado: {d.state}
              </p>
            </div>
          </div>
        </div>
      ));
    }
  };

  render() {
    return (
      <div className="container comentarios">
        <h3 className=" text-center">Comentarios</h3>
        <div className="messaging">
          <div className="inbox_msg">
            <div className="inbox_people">
              <div className="headind_srch">
                <div className="recent_heading">
                  <h4>Historial</h4>
                </div>
              </div>
              <div className="inbox_chat">{this.renderMessages()}</div>
            </div>
            <div className="mesgs">
              <div className="msg_history">{this.renderChat()}</div>
              <div className="type_msg">
                <div className="input_msg_write">
                  <input
                    type="text"
                    className="write_msg"
                    placeholder="Type a message"
                  />
                  <button className="msg_send_btn" type="button">
                    <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center top_spac">Design by Sunil Rajput</p>
        </div>
      </div>
    );
  }
}
export default withRouter(Comentarios);
