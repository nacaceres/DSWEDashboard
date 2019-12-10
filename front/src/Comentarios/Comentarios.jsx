import React, { Component } from "react"; // sguzmanm: Why not refactor this with React Hooks
import { withRouter } from "react-router-dom";
import "./Comentarios.css";
class Comentarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: false,
      messages: [],
      id: "",
      inputMessage: "",
      estadoCom: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.activateChat = this.activateChat.bind(this);
  }
  componentDidUpdate() { // sguzmanm: You can make an early return here with an if(!this.state.chat) return;
    if (this.state.chat) {
      let i;
      for (i in this.props.claims) {
        if (this.props.claims[i]._id === this.state.id) { // sguzmanm: Please please avoid nested ifs please
          if (
            this.props.claims[i].messages.length !== this.state.messages.length
          ) {
            this.setState({
              messages: this.props.claims[i].messages
            });
          }
        }
      }
    }
  }
  fixDate(date) {
    let lista = date.split(" ");
    let mes = lista[1];
    let dia = lista[2];
    let horas = lista[4].split(":");
    let hora = horas[0];
    let minutos = horas[1];

    return hora + ":" + minutos + " | " + mes + " " + dia;
  }
  fixDate2(date) { // sguzmanm: Careful with naming, this function name has no meaning or at least try to be more specific
    let lista = date.split(" ");
    let mes = lista[1];
    let dia = lista[2];
    return mes + " " + dia;
  }
  handleSubmit(event, responsable) {
    if (
      this.state.id !== "" &&
      this.state.inputMessage !== "" &&
      this.state.inputMessage !== " "
    ) {
      if (
        this.state.estadoCom === "Pendiente" &&
        this.props.rol !== "ESTUDIANTE"
      ) { // sguzmanm: Refactor this if condition to a function and please avoid nested ifs by using returns
        let req = {};
        req["_id"] = this.state.id;
        req["message"] = {
          message: this.state.inputMessage,
          role: "PROFESOR",
          date: Date()
        };
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
            if (data.err) {
              console.log("Hubo un error haciendo el post de la respuesta");
            } else {
              this.setState({ inputMessage: "" });
            }
          });
      } else {
        let req = {};
        req["_id"] = this.state.id;
        req["message"] = {
          message: this.state.inputMessage,
          role: this.props.rol,
          date: Date()
        };
        fetch("addmessage", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(req)
        })
          .then(res => res.json())
          .then(data => {
            if (data.err) {
              console.log("Hubo un error haciendo el post de la respuesta");
            } else {
              this.setState({ inputMessage: "" });
            }
          });
      }
    }
    if (responsable !== "boton") {
      event.preventDefault();
    }
  }
  handleCheck(event) {
    if (this.state.id !== "") {
      let req = {};
      req["_id"] = this.state.id;
      req["state"] = "Resuelto";
      fetch("changestate", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
      })
        .then(res => res.json())
        .then(data => {
          if (data.err) {
            console.log("Hubo un error haciendo el post de la respuesta");
          } else {
            //this.setState({ estadoCom: "Resuelto" });
          }
        });
    }
  }
  handleChange(event) {
    this.setState({ inputMessage: event.target.value });
  }

  activateChat(idParam, messagesParam, stateParam) {
    this.setState({
      chat: true,
      messages: messagesParam,
      id: idParam,
      estadoCom: stateParam,
      inputMessage: ""
    });
  }

  renderChat() {
    if (this.state.chat && this.props.rol !== "ESTUDIANTE") { // sguzmanm: Refactor this if condition to a function and please avoid nested ifs by using returns
      return this.state.messages.map(d => {
        if (d.role === "ESTUDIANTE") {
          return (
            <div key={d.date}>
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
                    <p>{d.message}</p>
                    <span className="time_date"> {this.fixDate(d.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="outgoing_msg" key={d.date}>
              <div className="sent_msg">
                <p>{d.message}</p>
                <span className="time_date"> {this.fixDate(d.date)}</span>{" "}
              </div>
            </div>
          );
        }
      });
    } else if (this.state.chat) {
      return this.state.messages.map(d => {
        if (d.role !== "ESTUDIANTE") {
          return (
            <div key={d.date}>
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
                    <p>{d.message}</p>
                    <span className="time_date"> {this.fixDate(d.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="outgoing_msg" key={d.date}>
              <div className="sent_msg">
                <p>{d.message}</p>
                <span className="time_date"> {this.fixDate(d.date)}</span>{" "}
              </div>
            </div>
          );
        }
      });
    }
  }

  renderEncargado(encargado) {
    if (encargado !== undefined) {
      return encargado;
    } else {
      return "No ha sido asignado";
    }
  }
  checkMessageClass(id) {
    if (id !== this.state.id) {
      return "chat_list";
    } else {
      return "chat_list active_chat";
    }
  }
  renderMessages = () => {
    let primero = true;
    if (this.props.rol === "ESTUDIANTE") {
      return this.props.claims.map(d => {
        if (primero && d.state === "Resuelto") {
          primero = false;
          return (
            <div>
              <div className="chat_list active_chat">
                <div className="chat_people">
                  <div className="chat_ib">
                    <h5>Comentarios Resueltos</h5>
                  </div>
                </div>
              </div>
              <div
                className={this.checkMessageClass(d._id)}
                key={d._id}
                onClick={() => this.activateChat(d._id, d.messages, d.state)}
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
                      {this.renderEncargado(d.teacher)}{" "}
                      <span className="chat_date">
                        {this.fixDate2(d.fechaAct)}
                      </span>
                    </h5>
                    <p>
                      Seccion: {d.section} - Estado: {d.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div
              className={this.checkMessageClass(d._id)}
              key={d._id}
              onClick={() => this.activateChat(d._id, d.messages, d.state)}
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
                    {this.renderEncargado(d.teacher)}{" "}
                    <span className="chat_date">
                      {this.fixDate2(d.fechaAct)}
                    </span>
                  </h5>
                  <p>
                    Seccion: {d.section} - Estado: {d.state}
                  </p>
                </div>
              </div>
            </div>
          );
        }
      });
    } else {
      return this.props.claims.map(d => {
        if (primero && d.state === "Resuelto") {
          primero = false;
          return (
            <div>
              <div className="chat_list active_chat">
                <div className="chat_people">
                  <div className="chat_ib">
                    <h5>Comentarios Resueltos</h5>
                  </div>
                </div>
              </div>
              <div
                className={this.checkMessageClass(d._id)}
                key={d._id}
                onClick={() => this.activateChat(d._id, d.messages, d.state)}
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
                      {d.student}{" "}
                      <span className="chat_date">
                        {this.fixDate2(d.fechaAct)}
                      </span>
                    </h5>
                    <p>
                      Seccion: {d.section} - Estado: {d.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div
              className={this.checkMessageClass(d._id)}
              key={d._id}
              onClick={() => this.activateChat(d._id, d.messages, d.state)}
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
                    {d.student}{" "}
                    <span className="chat_date">
                      {this.fixDate2(d.fechaAct)}
                    </span>
                  </h5>
                  <p>
                    Seccion: {d.section} - Estado: {d.state}
                  </p>
                </div>
              </div>
            </div>
          );
        }
      });
    }
  };
  infoReclamo() {
    if (this.state.chat) {
      return <div>Aca va la parte de Varon</div>;
    }
  }
  render() {
    return (
        <div className=" container comentarios">
          <div className="messaging">
            <div className="inbox_msg">
              <div className="inbox_people">
                <div className="headind_srch">
                  <div className="recent_heading">
                    <h4>Comentarios</h4>
                  </div>
                </div>
                <div className="inbox_chat">{this.renderMessages()}</div>
              </div>
              <div className="mesgs">
                <div className="msg_history">
                  {this.infoReclamo()}
                  {this.renderChat()}
                </div>
                <div className="type_msg">
                  <div className="input_msg_write">
                    <form onSubmit={this.handleSubmit}>
                      <input
                        type="text"
                        className="write_msg"
                        placeholder="Type a message"
                        value={this.state.inputMessage}
                        onChange={this.handleChange.bind(this)}
                      />
                    </form>
                    <button
                      className="msg_send_btn"
                      type="button"
                      onClick={() => this.handleSubmit(this, "boton")}
                    >
                      <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                    </button>
                    <button
                      className="resolve_btn"
                      type="button"
                      onClick={() => this.handleCheck(this)}
                    >
                      <i className="fas fa-check" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
export default withRouter(Comentarios);
